
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

const parseWorkingHours = (workingHoursData: unknown): WorkingHours => {
  console.log('useWorkshopSettings: Parsing working hours:', workingHoursData);
  
  if (!workingHoursData || typeof workingHoursData !== 'object') {
    console.log('useWorkshopSettings: No working hours data, using defaults');
    return defaultWorkingHours;
  }
  
  const data = workingHoursData as Record<string, any>;
  const hasRequiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    .every(day => data[day] && typeof data[day] === 'object');
  
  if (!hasRequiredDays) {
    console.log('useWorkshopSettings: Invalid working hours structure, using defaults');
    return defaultWorkingHours;
  }
  
  console.log('useWorkshopSettings: Working hours parsed successfully');
  return data as WorkingHours;
};

export const useWorkshopSettings = () => {
  const [settings, setSettings] = useState<WorkshopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      console.log('useWorkshopSettings: Starting to fetch settings...');
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('useWorkshopSettings: Authentication error:', authError);
        toast({
          title: "Erro de Autenticação",
          description: "Usuário não está autenticado.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('useWorkshopSettings: User authenticated:', user.id);
      
      // Buscar tenant_id do usuário
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('useWorkshopSettings: Error fetching user profile:', userError);
        toast({
          title: "Erro",
          description: "Não foi possível buscar dados do usuário.",
          variant: "destructive",
        });
        return;
      }

      console.log('useWorkshopSettings: User profile found:', userProfile);

      if (!userProfile?.tenant_id) {
        console.warn('useWorkshopSettings: No tenant_id found for user');
        toast({
          title: "Aviso",
          description: "Nenhuma oficina associada ao usuário.",
          variant: "destructive",
        });
        return;
      }

      // Buscar configurações da oficina
      console.log('useWorkshopSettings: Fetching workshop settings for tenant:', userProfile.tenant_id);
      
      const { data, error } = await supabase
        .from('workshop_settings')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('useWorkshopSettings: Error fetching settings:', error);
        throw error;
      }

      if (data) {
        console.log('useWorkshopSettings: Settings found:', data);
        const convertedSettings: WorkshopSettings = {
          ...data,
          working_hours: parseWorkingHours(data.working_hours)
        };
        setSettings(convertedSettings);
        console.log('useWorkshopSettings: Settings converted and set:', convertedSettings);
      } else {
        console.log('useWorkshopSettings: No settings found, will need to create');
        setSettings(null);
      }
    } catch (error) {
      console.error('useWorkshopSettings: Error in fetchSettings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsData: Partial<WorkshopSettings>) => {
    try {
      console.log('useWorkshopSettings: Starting to save settings:', settingsData);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error('useWorkshopSettings: No authenticated user');
        throw new Error('Usuário não autenticado');
      }

      console.log('useWorkshopSettings: User authenticated for save:', userData.user.id);

      // Buscar tenant_id do usuário
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', userData.user.id)
        .single();

      if (userError) {
        console.error('useWorkshopSettings: Error fetching user profile for save:', userError);
        throw userError;
      }
      
      if (!userProfile?.tenant_id) {
        console.error('useWorkshopSettings: No tenant found for user');
        throw new Error('Tenant não encontrado para o usuário');
      }

      console.log('useWorkshopSettings: Tenant found for save:', userProfile.tenant_id);

      let result;
      
      if (settings?.id) {
        console.log('useWorkshopSettings: Updating existing settings:', settings.id);
        
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
          working_hours: settingsData.working_hours as unknown as Database['public']['Tables']['workshop_settings']['Update']['working_hours'],
          updated_at: new Date().toISOString()
        };

        console.log('useWorkshopSettings: Update data prepared:', updateData);

        const { data, error } = await supabase
          .from('workshop_settings')
          .update(updateData)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) {
          console.error('useWorkshopSettings: Error updating settings:', error);
          throw error;
        }
        
        console.log('useWorkshopSettings: Settings updated successfully:', data);
        result = data;
      } else {
        console.log('useWorkshopSettings: Creating new settings');
        
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

        console.log('useWorkshopSettings: Insert data prepared:', insertData);

        const { data, error } = await supabase
          .from('workshop_settings')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('useWorkshopSettings: Error creating settings:', error);
          throw error;
        }

        console.log('useWorkshopSettings: Settings created successfully:', data);
        result = data;
      }

      const convertedResult: WorkshopSettings = {
        ...result,
        working_hours: parseWorkingHours(result.working_hours)
      };

      setSettings(convertedResult);
      
      console.log('useWorkshopSettings: Settings saved and state updated');
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      
      return convertedResult;
    } catch (error) {
      console.error('useWorkshopSettings: Error in saveSettings:', error);
      toast({
        title: "Erro",
        description: `Não foi possível salvar as configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateWorkingHours = async (workingHours: WorkingHours) => {
    try {
      console.log('useWorkshopSettings: Updating working hours:', workingHours);
      await saveSettings({ working_hours: workingHours });
    } catch (error) {
      console.error('useWorkshopSettings: Error updating working hours:', error);
    }
  };

  useEffect(() => {
    console.log('useWorkshopSettings: Hook initialized, fetching settings');
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
