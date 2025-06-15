
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type WorkshopSettingsRow = Database['public']['Tables']['workshop_settings']['Row'];
type WorkshopSettingsInsert = Database['public']['Tables']['workshop_settings']['Insert'];
type WorkshopSettingsUpdate = Database['public']['Tables']['workshop_settings']['Update'];

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
  working_hours: WorkingHours;
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
}

export interface WorkingHours {
  monday: { isOpen: boolean; openTime: string; closeTime: string; };
  tuesday: { isOpen: boolean; openTime: string; closeTime: string; };
  wednesday: { isOpen: boolean; openTime: string; closeTime: string; };
  thursday: { isOpen: boolean; openTime: string; closeTime: string; };
  friday: { isOpen: boolean; openTime: string; closeTime: string; };
  saturday: { isOpen: boolean; openTime: string; closeTime: string; };
  sunday: { isOpen: boolean; openTime: string; closeTime: string; };
}

const defaultWorkingHours: WorkingHours = {
  monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
  tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
  wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
  thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
  friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
  saturday: { isOpen: true, openTime: '08:00', closeTime: '12:00' },
  sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
};

// Função helper para validar e converter working_hours
const parseWorkingHours = (workingHoursData: unknown): WorkingHours => {
  if (!workingHoursData || typeof workingHoursData !== 'object') {
    return defaultWorkingHours;
  }
  
  // Verificar se tem a estrutura básica esperada
  const data = workingHoursData as Record<string, any>;
  const hasRequiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    .every(day => data[day] && typeof data[day] === 'object');
  
  if (!hasRequiredDays) {
    return defaultWorkingHours;
  }
  
  return data as WorkingHours;
};

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

      if (data) {
        // Converter os dados do Supabase para o formato esperado
        const convertedSettings: WorkshopSettings = {
          ...data,
          working_hours: parseWorkingHours(data.working_hours)
        };
        setSettings(convertedSettings);
      } else {
        setSettings(null);
      }
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
        const updateData: WorkshopSettingsUpdate = {
          workshop_name: settingsData.workshop_name,
          business_name: settingsData.business_name,
          cnpj: settingsData.cnpj,
          state_registration: settingsData.state_registration,
          description: settingsData.description,
          logo_url: settingsData.logo_url,
          workshop_photo_url: settingsData.workshop_photo_url,
          phone: settingsData.phone,
          mobile: settingsData.mobile,
          email: settingsData.email,
          website: settingsData.website,
          address: settingsData.address,
          working_hours: settingsData.working_hours as unknown as Database['public']['Tables']['workshop_settings']['Update']['working_hours']
        };

        const { data, error } = await supabase
          .from('workshop_settings')
          .update(updateData)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Criar novas configurações
        const insertData: WorkshopSettingsInsert = {
          workshop_name: settingsData.workshop_name!,
          business_name: settingsData.business_name,
          cnpj: settingsData.cnpj,
          state_registration: settingsData.state_registration,
          description: settingsData.description,
          logo_url: settingsData.logo_url,
          workshop_photo_url: settingsData.workshop_photo_url,
          phone: settingsData.phone,
          mobile: settingsData.mobile,
          email: settingsData.email,
          website: settingsData.website,
          address: settingsData.address,
          working_hours: settingsData.working_hours as unknown as Database['public']['Tables']['workshop_settings']['Insert']['working_hours'],
          created_by_user_id: userData.user.id,
          tenant_id: userProfile.tenant_id
        };

        const { data, error } = await supabase
          .from('workshop_settings')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Converter resultado para o formato esperado
      const convertedResult: WorkshopSettings = {
        ...result,
        working_hours: parseWorkingHours(result.working_hours)
      };

      setSettings(convertedResult);
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      
      return convertedResult;
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
