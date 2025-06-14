
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkshopService {
  id: string;
  name: string;
  description?: string;
  category?: string;
  base_price: number;
  estimated_duration_minutes?: number;
  is_active: boolean;
  requires_parts: boolean;
  skill_level: string;
  warranty_days: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  created_by_user_id: string;
}

export const useWorkshopServices = () => {
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar todos os serviços
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workshop_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar novo serviço
  const createService = async (serviceData: Omit<WorkshopService, 'id' | 'created_at' | 'updated_at' | 'tenant_id' | 'created_by_user_id'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('workshop_services')
        .insert([{
          ...serviceData,
          created_by_user_id: userData.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o serviço.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Atualizar serviço
  const updateService = async (id: string, serviceData: Partial<WorkshopService>) => {
    try {
      const { data, error } = await supabase
        .from('workshop_services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(service => 
        service.id === id ? { ...service, ...data } : service
      ));
      
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Deletar serviço
  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workshop_services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Alternar status ativo/inativo
  const toggleServiceStatus = async (id: string) => {
    try {
      const service = services.find(s => s.id === id);
      if (!service) return;

      await updateService(id, { is_active: !service.is_active });
    } catch (error) {
      console.error('Erro ao alterar status do serviço:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refetch: fetchServices
  };
};
