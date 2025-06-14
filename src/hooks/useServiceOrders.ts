
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ServiceOrder {
  id: string;
  order_number: number;
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  status: string;
  priority: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  created_at: string;
  updated_at: string;
  customers: {
    name: string;
    phone?: string;
  };
  vehicles: {
    brand: string;
    model: string;
    license_plate: string;
    year?: number;
  };
  technician?: {
    full_name: string;
  } | null;
}

// Interface for creating/updating service orders (without nested objects)
interface ServiceOrderInput {
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  status?: string;
  priority?: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
}

export interface ServiceOrderStats {
  total: number;
  draft: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  total_revenue: number;
}

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [stats, setStats] = useState<ServiceOrderStats>({
    total: 0,
    draft: 0,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchServiceOrders = async () => {
    if (!user?.user_metadata?.tenant_id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          customers!inner(name, phone),
          vehicles!inner(brand, model, license_plate, year),
          technician:users(full_name)
        `)
        .eq('tenant_id', user.user_metadata.tenant_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(order => ({
        ...order,
        technician: order.technician && 
                   typeof order.technician === 'object' && 
                   order.technician !== null && 
                   'full_name' in order.technician 
          ? { full_name: (order.technician as any).full_name }
          : null
      })) as ServiceOrder[];

      setServiceOrders(transformedData);
      
      // Calculate stats
      const statsData = transformedData.reduce((acc, so) => {
        acc.total++;
        if (so.status in acc) {
          acc[so.status as keyof ServiceOrderStats] = (acc[so.status as keyof ServiceOrderStats] as number) + 1;
        }
        if (so.final_cost) {
          acc.total_revenue += so.final_cost;
        }
        return acc;
      }, {
        total: 0,
        draft: 0,
        scheduled: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        total_revenue: 0,
      });

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching service orders:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar ordens de serviço',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createServiceOrder = async (orderData: Partial<ServiceOrder>) => {
    if (!user?.user_metadata?.tenant_id) return;

    try {
      // Create input object with only database fields
      const inputData: ServiceOrderInput & { tenant_id: string; created_by_user_id: string } = {
        customer_id: orderData.customer_id!,
        vehicle_id: orderData.vehicle_id!,
        problem_description: orderData.problem_description!,
        assigned_technician_id: orderData.assigned_technician_id,
        status: orderData.status || 'draft',
        priority: orderData.priority || 'normal',
        customer_complaint: orderData.customer_complaint,
        internal_notes: orderData.internal_notes,
        estimated_cost: orderData.estimated_cost,
        estimated_hours: orderData.estimated_hours,
        vehicle_mileage: orderData.vehicle_mileage,
        scheduled_start_date: orderData.scheduled_start_date,
        estimated_completion_date: orderData.estimated_completion_date,
        tenant_id: user.user_metadata.tenant_id,
        created_by_user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('service_orders')
        .insert(inputData)
        .select(`
          *,
          customers!inner(name, phone),
          vehicles!inner(brand, model, license_plate, year),
          technician:users(full_name)
        `)
        .single();

      if (error) throw error;

      // Transform the returned data
      const transformedData = {
        ...data,
        technician: data.technician && 
                   typeof data.technician === 'object' && 
                   data.technician !== null && 
                   'full_name' in data.technician 
          ? { full_name: (data.technician as any).full_name }
          : null
      } as ServiceOrder;

      setServiceOrders(prev => [transformedData, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Ordem de serviço criada com sucesso',
      });

      return transformedData;
    } catch (error) {
      console.error('Error creating service order:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar ordem de serviço',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateServiceOrder = async (id: string, updates: Partial<ServiceOrder>) => {
    try {
      // Create input object with only database fields
      const updateData: Partial<ServiceOrderInput> = {
        customer_id: updates.customer_id,
        vehicle_id: updates.vehicle_id,
        assigned_technician_id: updates.assigned_technician_id,
        status: updates.status,
        priority: updates.priority,
        problem_description: updates.problem_description,
        customer_complaint: updates.customer_complaint,
        internal_notes: updates.internal_notes,
        estimated_cost: updates.estimated_cost,
        final_cost: updates.final_cost,
        estimated_hours: updates.estimated_hours,
        final_hours: updates.final_hours,
        vehicle_mileage: updates.vehicle_mileage,
        scheduled_start_date: updates.scheduled_start_date,
        estimated_completion_date: updates.estimated_completion_date,
        actual_completion_date: updates.actual_completion_date,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof ServiceOrderInput] === undefined) {
          delete updateData[key as keyof ServiceOrderInput];
        }
      });
      
      const { error } = await supabase
        .from('service_orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setServiceOrders(prev => 
        prev.map(so => so.id === id ? { ...so, ...updates } : so)
      );

      toast({
        title: 'Sucesso',
        description: 'Ordem de serviço atualizada com sucesso',
      });
    } catch (error) {
      console.error('Error updating service order:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar ordem de serviço',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteServiceOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServiceOrders(prev => prev.filter(so => so.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Ordem de serviço excluída com sucesso',
      });
    } catch (error) {
      console.error('Error deleting service order:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir ordem de serviço',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchServiceOrders();
  }, [user]);

  return {
    serviceOrders,
    stats,
    loading,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
    refetch: fetchServiceOrders,
  };
};
