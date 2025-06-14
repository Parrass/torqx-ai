
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemModule {
  name: string;
  display_name: string;
  description: string;
  icon: string;
  category: string;
  is_active: boolean;
}

export interface UserPermission {
  module_name: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface TeamUser {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  status: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  permissions: UserPermission[];
}

export const useTeamManagement = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users_with_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar usuários';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;

      setModules(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar módulos:', err);
    }
  };

  const createUser = async (userData: {
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    permissions: Record<string, UserPermission>;
  }) => {
    try {
      setLoading(true);

      // Primeiro criar o usuário
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          status: 'active'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Depois criar as permissões
      const permissionsToInsert = Object.values(userData.permissions).map(permission => ({
        user_id: newUser.id,
        module_name: permission.module_name,
        can_create: permission.can_create,
        can_read: permission.can_read,
        can_update: permission.can_update,
        can_delete: permission.can_delete
      }));

      if (permissionsToInsert.length > 0) {
        const { error: permError } = await supabase
          .from('user_module_permissions')
          .insert(permissionsToInsert);

        if (permError) throw permError;
      }

      await fetchUsers();
      
      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso',
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar usuário';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: Record<string, UserPermission>) => {
    try {
      setLoading(true);

      // Deletar permissões existentes
      await supabase
        .from('user_module_permissions')
        .delete()
        .eq('user_id', userId);

      // Inserir novas permissões
      const permissionsToInsert = Object.values(permissions).map(permission => ({
        user_id: userId,
        module_name: permission.module_name,
        can_create: permission.can_create,
        can_read: permission.can_read,
        can_update: permission.can_update,
        can_delete: permission.can_delete
      }));

      if (permissionsToInsert.length > 0) {
        const { error } = await supabase
          .from('user_module_permissions')
          .insert(permissionsToInsert);

        if (error) throw error;
      }

      await fetchUsers();
      
      toast({
        title: 'Sucesso',
        description: 'Permissões atualizadas com sucesso',
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar permissões';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      
      toast({
        title: 'Sucesso',
        description: 'Status do usuário atualizado',
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar status';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchModules();
  }, []);

  return {
    users,
    modules,
    loading,
    error,
    createUser,
    updateUserPermissions,
    updateUserStatus,
    refetch: fetchUsers
  };
};
