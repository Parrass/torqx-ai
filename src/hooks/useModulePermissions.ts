
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { initializeUserPermissions } from '@/utils/permissionsUtils';

export interface ModulePermission {
  module_name: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export const useModulePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Buscando permissões para usuário:', user.id);

      // Primeiro, inicializar permissões se necessário
      await initializeUserPermissions();

      // Buscar role do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        setLoading(false);
        return;
      }

      setUserRole(userData.role);
      console.log('Role do usuário:', userData.role);

      // Buscar permissões específicas do usuário
      const { data: userPermissions, error: permissionsError } = await supabase
        .from('user_module_permissions')
        .select('*')
        .eq('user_id', user.id);

      if (permissionsError) {
        console.error('Erro ao buscar permissões:', permissionsError);
      } else {
        console.log('Permissões encontradas:', userPermissions);
        setPermissions(userPermissions || []);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (moduleName: string, permissionType: 'create' | 'read' | 'update' | 'delete'): boolean => {
    // Owner tem todas as permissões
    if (userRole === 'owner') {
      console.log(`Owner tem permissão ${permissionType} para ${moduleName}`);
      return true;
    }

    const modulePermission = permissions.find(p => p.module_name === moduleName);
    if (!modulePermission) {
      console.log(`Nenhuma permissão encontrada para módulo ${moduleName}`);
      return false;
    }

    const hasAccess = (() => {
      switch (permissionType) {
        case 'create':
          return modulePermission.can_create;
        case 'read':
          return modulePermission.can_read;
        case 'update':
          return modulePermission.can_update;
        case 'delete':
          return modulePermission.can_delete;
        default:
          return false;
      }
    })();

    console.log(`Permissão ${permissionType} para ${moduleName}:`, hasAccess);
    return hasAccess;
  };

  const hasModuleAccess = (moduleName: string): boolean => {
    return hasPermission(moduleName, 'read');
  };

  const canManageTeam = (): boolean => {
    return userRole === 'owner' || hasPermission('team_management', 'update');
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [user]);

  return {
    permissions,
    userRole,
    loading,
    hasPermission,
    hasModuleAccess,
    canManageTeam,
    refetch: fetchUserPermissions
  };
};
