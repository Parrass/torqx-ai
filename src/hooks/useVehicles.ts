
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Vehicle {
  id: string;
  customer_id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  fuel_type: string | null;
  engine_size: string | null;
  transmission: string | null;
  current_mileage: number | null;
  vin_chassis: string | null;
  status: 'active' | 'inactive';
  notes: string | null;
  condition_notes: string | null;
  technical_specs: any;
  maintenance_intervals: any;
  mileage_history: any;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    phone: string | null;
  };
}

export interface VehicleFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  brand?: string;
  fuel_type?: string;
  customer_id?: string;
  limit?: number;
  offset?: number;
}

export const useVehicles = (filters: VehicleFilters = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('vehicles')
        .select(`
          *,
          customer:customers(name, phone)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`license_plate.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,vin_chassis.ilike.%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      if (filters.fuel_type) {
        query = query.eq('fuel_type', filters.fuel_type);
      }

      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }

      // Transform data to match our interface with proper type conversion
      return data?.map(vehicle => ({
        ...vehicle,
        status: (vehicle.status as 'active' | 'inactive') || 'active',
        customer: vehicle.customer ? {
          name: vehicle.customer.name,
          phone: vehicle.customer.phone
        } : undefined
      })) || [];
    },
    enabled: !!user,
  });
};

export const useVehicleStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vehicle-stats'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get total vehicles
      const { count: totalVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      // Get active vehicles
      const { count: activeVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get vehicles by fuel type
      const { data: fuelTypes } = await supabase
        .from('vehicles')
        .select('fuel_type')
        .not('fuel_type', 'is', null);

      const fuelTypeCount = fuelTypes?.reduce((acc, vehicle) => {
        const fuel = vehicle.fuel_type || 'Não informado';
        acc[fuel] = (acc[fuel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get average mileage
      const { data: mileageData } = await supabase
        .from('vehicles')
        .select('current_mileage')
        .not('current_mileage', 'is', null);

      const averageMileage = mileageData?.length ? 
        mileageData.reduce((sum, v) => sum + (v.current_mileage || 0), 0) / mileageData.length : 0;

      return {
        totalVehicles: totalVehicles || 0,
        activeVehicles: activeVehicles || 0,
        inactiveVehicles: (totalVehicles || 0) - (activeVehicles || 0),
        fuelTypeDistribution: fuelTypeCount,
        averageMileage: Math.round(averageMileage)
      };
    },
    enabled: !!user,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (vehicleData: Omit<Vehicle, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      // Get user's tenant_id
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData?.tenant_id) {
        throw new Error('User tenant not found');
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert([{ ...vehicleData, tenant_id: userData.tenant_id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
      toast.success('Veículo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating vehicle:', error);
      toast.error('Erro ao criar veículo. Tente novamente.');
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...vehicleData }: Partial<Vehicle> & { id: string }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
      toast.success('Veículo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating vehicle:', error);
      toast.error('Erro ao atualizar veículo. Tente novamente.');
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
      toast.success('Veículo excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
      toast.error('Erro ao excluir veículo. Tente novamente.');
    },
  });
};
