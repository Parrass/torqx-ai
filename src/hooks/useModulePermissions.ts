
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

      // Se for owner, tem todas as permissões - garantir que estejam inicializadas
      if (userData.role === 'owner') {
        await supabase.rpc('initialize_owner_permissions');
      }

      // Buscar permissões específicas do usuário
      const { data: userPermissions, error: permissionsError } = await supabase
        .from('user_module_permissions')
        .select('*')
        .eq('user_id', user.id);

      if (permissionsError) {
        console.error('Erro ao buscar permissões:', permissionsError);
        setLoading(false);
        return;
      }

      setPermissions(userPermissions || []);
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (moduleName: string, permissionType: 'create' | 'read' | 'update' | 'delete'): boolean => {
    // Owner tem todas as permissões
    if (userRole === 'owner') {
      return true;
    }

    const modulePermission = permissions.find(p => p.module_name === moduleName);
    if (!modulePermission) {
      return false;
    }

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
