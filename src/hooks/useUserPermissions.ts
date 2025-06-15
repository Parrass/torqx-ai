
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPermissions([]);
          setLoading(false);
          return;
        }

        // Buscar permissões do usuário
        const { data: userPermissions, error } = await supabase
          .from('user_module_permissions')
          .select('module_name, can_read')
          .eq('user_id', user.id)
          .eq('can_read', true);

        if (error) {
          console.error('Erro ao buscar permissões:', error);
          setPermissions([]);
        } else {
          const moduleNames = userPermissions?.map(p => p.module_name) || [];
          setPermissions(moduleNames);
        }
      } catch (error) {
        console.error('Erro ao carregar permissões:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, loading };
};
