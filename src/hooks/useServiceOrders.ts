
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ServiceOrder, 
  ServiceOrderStats, 
  transformServiceOrderData,
  createServiceOrderStats 
} from '@/types/serviceOrder';
import { ServiceOrderOperations } from '@/services/serviceOrderOperations';

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

  const operations = new ServiceOrderOperations(supabase, toast);

  const fetchServiceOrders = async () => {
    if (!user?.user_metadata?.tenant_id) return;

    try {
      setLoading(true);
      
      // Corrigindo a consulta para evitar ambiguidade no relacionamento
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          customers!inner(name, phone),
          vehicles!inner(brand, model, license_plate, year),
          assigned_technician:users!service_orders_assigned_technician_id_fkey(full_name)
        `)
        .eq('tenant_id', user.user_metadata.tenant_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw service orders data:', data);

      const transformedData = transformServiceOrderData(data || []);
      console.log('Transformed service orders:', transformedData);
      
      setServiceOrders(transformedData);
      setStats(createServiceOrderStats(transformedData));
      
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
      const result = await operations.create(orderData, user);
      if (result) {
        setServiceOrders(prev => [result, ...prev]);
        toast({
          title: 'Sucesso',
          description: 'Ordem de serviço criada com sucesso',
        });
      }
      return result;
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
      await operations.update(id, updates);
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
      await operations.delete(id);
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
