
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

        // Buscar role do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
          setPermissions([]);
          setLoading(false);
          return;
        }

        // Se for owner, inicializar permissões e dar acesso a tudo
        if (userData?.role === 'owner') {
          console.log('Usuário é owner, inicializando permissões...');
          
          // Chamar função para inicializar permissões do owner
          const { error: initError } = await supabase.rpc('initialize_owner_permissions');
          
          if (initError) {
            console.error('Erro ao inicializar permissões do owner:', initError);
          } else {
            console.log('Permissões do owner inicializadas com sucesso');
          }

          // Buscar todos os módulos ativos para o owner
          const { data: modules, error: modulesError } = await supabase
            .from('system_modules')
            .select('name')
            .eq('is_active', true);

          if (modulesError) {
            console.error('Erro ao buscar módulos:', modulesError);
            setPermissions([]);
          } else {
            const moduleNames = modules?.map(m => m.name) || [];
            console.log('Módulos disponíveis para owner:', moduleNames);
            setPermissions(moduleNames);
          }
        } else {
          // Para outros roles, buscar permissões específicas
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
