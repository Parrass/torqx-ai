
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkshopSettings {
  id: string;
  tenant_id: string;
  workshop_name: string;
  business_name?: string;
  cnpj?: string;
  state_registration?: string;
  description?: string;
  logo_url?: string;
  workshop_photo_url?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  address?: string;
  working_hours: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
}

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

export const useWorkshopSettings = () => {
  const [settings, setSettings] = useState<WorkshopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar configurações da oficina
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workshop_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data || null);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar ou atualizar configurações
  const saveSettings = async (settingsData: Partial<WorkshopSettings>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      // Buscar tenant_id do usuário
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', userData.user.id)
        .single();

      if (userError) throw userError;
      if (!userProfile?.tenant_id) throw new Error('Tenant não encontrado para o usuário');

      let result;
      
      if (settings?.id) {
        // Atualizar configurações existentes
        const { data, error } = await supabase
          .from('workshop_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Criar novas configurações
        const { data, error } = await supabase
          .from('workshop_settings')
          .insert({
            ...settingsData,
            created_by_user_id: userData.user.id,
            tenant_id: userProfile.tenant_id
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setSettings(result);
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      
      return result;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Atualizar horários de funcionamento
  const updateWorkingHours = async (workingHours: WorkingHours) => {
    try {
      await saveSettings({ working_hours: workingHours });
    } catch (error) {
      console.error('Erro ao atualizar horários:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    updateWorkingHours,
    refetch: fetchSettings
  };
};
