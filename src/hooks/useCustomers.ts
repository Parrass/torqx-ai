
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  document_type: string | null;
  customer_type: 'individual' | 'business';
  address: any;
  notes: string | null;
  tags: string[] | null;
  status: 'active' | 'inactive';
  preferred_contact: 'phone' | 'email' | 'whatsapp';
  secondary_phone: string | null;
  credit_limit: number;
  payment_terms: number;
  total_spent: number;
  total_orders: number;
  last_service_date: string | null;
  preferred_technician_id: string | null;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  customer_type?: 'all' | 'individual' | 'business';
  limit?: number;
  offset?: number;
}

export const useCustomers = (filters: CustomerFilters = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['customers', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('customers')
        .select(`
          *,
          vehicles:vehicles(count)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,document_number.ilike.%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.customer_type && filters.customer_type !== 'all') {
        query = query.eq('customer_type', filters.customer_type);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }

      // Transform data to match our interface
      return data?.map(customer => ({
        ...customer,
        vehicles_count: customer.vehicles?.[0]?.count || 0
      })) || [];
    },
    enabled: !!user,
  });
};

export const useCustomerStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Get new customers this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newThisMonth } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get revenue and average ticket from customer metrics
      const { data: revenue } = await supabase
        .from('customers')
        .select('total_spent');

      const totalRevenue = revenue?.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) || 0;
      const averageTicket = totalCustomers ? totalRevenue / totalCustomers : 0;

      return {
        totalCustomers: totalCustomers || 0,
        newThisMonth: newThisMonth || 0,
        totalRevenue,
        averageTicket
      };
    },
    enabled: !!user,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (customerData: Omit<Customer, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
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
        .from('customers')
        .insert([{ ...customerData, tenant_id: userData.tenant_id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
      toast.success('Cliente criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast.error('Erro ao criar cliente. Tente novamente.');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...customerData }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast.error('Erro ao atualizar cliente. Tente novamente.');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      toast.error('Erro ao excluir cliente. Tente novamente.');
    },
  });
};
