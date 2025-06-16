
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

export interface UserInvitation {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  permissions: Record<string, UserPermission>;
  status: string;
  invited_by_user_id: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  invited_by_name?: string;
  company_name?: string;
}

interface RpcResponse {
  success: boolean;
  error?: string;
  user_id?: string;
}

export const useTeamManagement = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro, garantir que as permissões dos owners estejam corretas
      const { error: ensureError } = await supabase.rpc('initialize_owner_permissions');
      if (ensureError) {
        console.warn('Erro ao garantir permissões do owner:', ensureError);
      }

      const { data, error } = await supabase
        .from('users_with_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse permissions from JSON to UserPermission[] with proper type conversion
      const parsedUsers = (data || []).map(user => ({
        ...user,
        permissions: Array.isArray(user.permissions) 
          ? (user.permissions as unknown as UserPermission[])
          : []
      }));

      setUsers(parsedUsers);
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

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations_with_details')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match UserInvitation interface with safe type conversion
      const transformedInvitations: UserInvitation[] = (data || []).map(invitation => ({
        ...invitation,
        permissions: typeof invitation.permissions === 'object' && 
                    invitation.permissions !== null && 
                    !Array.isArray(invitation.permissions)
          ? invitation.permissions as unknown as Record<string, UserPermission>
          : {}
      }));

      setInvitations(transformedInvitations);
    } catch (err: any) {
      console.error('Erro ao carregar convites:', err);
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

  const createUserInvitation = async (userData: {
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    permissions: Record<string, UserPermission>;
  }) => {
    try {
      setLoading(true);

      // Get current user's tenant_id
      const { data: currentUser } = await supabase
        .from('users')
        .select('tenant_id, full_name')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!currentUser?.tenant_id) {
        throw new Error('Tenant não encontrado');
      }

      // Get company info
      const { data: tenant } = await supabase
        .from('tenants')
        .select('business_name, name')
        .eq('id', currentUser.tenant_id)
        .single();

      // Call edge function to send invitation
      const { data, error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          permissions: userData.permissions,
          tenant_id: currentUser.tenant_id,
          invited_by_user_id: (await supabase.auth.getUser()).data.user?.id,
          company_name: tenant?.business_name || tenant?.name
        }
      });

      if (error) throw error;

      await fetchUsers();
      await fetchInvitations();
      
      toast({
        title: 'Sucesso',
        description: `Convite enviado para ${userData.email}`,
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao enviar convite';
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

  const resendInvitation = async (invitationId: string) => {
    try {
      setLoading(true);

      // Primeiro, atualizar a data de expiração do convite existente
      const { error: updateError } = await supabase
        .from('user_invitations')
        .update({ 
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Erro ao atualizar convite:', updateError);
        throw new Error(`Erro ao atualizar convite: ${updateError.message}`);
      }

      // Buscar dados atualizados do convite
      const { data: invitation, error: fetchError } = await supabase
        .from('user_invitations_with_details')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar convite:', fetchError);
        throw new Error(`Erro ao buscar convite: ${fetchError.message}`);
      }

      if (!invitation) {
        throw new Error('Convite não encontrado');
      }

      // Agora gerar um novo magic link via edge function personalizada
      // Primeiro, vamos criar o magic link diretamente
      const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: invitation.email,
        options: {
          redirectTo: `${window.location.origin}/accept-invitation?invitation_id=${invitation.id}`,
          data: {
            invitation_id: invitation.id,
            full_name: invitation.full_name
          }
        }
      });

      if (magicLinkError) {
        console.error('Erro ao gerar magic link:', magicLinkError);
        // Não falhar completamente, pois o convite foi atualizado
        console.log('Magic link falhou, mas convite foi atualizado com sucesso');
      } else {
        console.log('Magic link gerado com sucesso para reenvio');
      }

      await fetchInvitations();
      
      toast({
        title: 'Sucesso',
        description: `Convite reenviado para ${invitation.email}`,
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao reenviar convite';
      console.error('Erro no reenvio:', err);
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

  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('accept_user_invitation', {
        invitation_id: invitationId
      });

      if (error) throw error;

      // Safe cast the response to the expected type using unknown
      const response = data as unknown as RpcResponse;

      if (!response.success) {
        throw new Error(response.error || 'Erro ao aceitar convite');
      }

      // Garantir que as permissões sejam inicializadas após aceitar convite
      await supabase.rpc('initialize_owner_permissions');

      toast({
        title: 'Sucesso',
        description: 'Convite aceito com sucesso!',
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao aceitar convite';
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

  const cancelInvitation = async (invitationId: string) => {
    try {
      setLoading(true);

      // Buscar dados do convite para verificar se o usuário já foi criado
      const { data: invitation, error: invitationError } = await supabase
        .from('user_invitations')
        .select('email, status')
        .eq('id', invitationId)
        .single();

      if (invitationError) {
        console.error('Erro ao buscar convite:', invitationError);
        throw new Error('Convite não encontrado');
      }

      // Verificar se existe um usuário com este email no sistema
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, status')
        .eq('email', invitation.email)
        .maybeSingle();

      if (userError) {
        console.error('Erro ao verificar usuário:', userError);
      }

      // Se o usuário existe e o convite foi aceito, desativar o usuário
      if (existingUser && invitation.status === 'accepted') {
        const { error: deactivateError } = await supabase
          .from('users')
          .update({ status: 'inactive' })
          .eq('id', existingUser.id);

        if (deactivateError) {
          console.error('Erro ao desativar usuário:', deactivateError);
          // Não falhar o cancelamento se não conseguir desativar
        } else {
          console.log('Usuário desativado devido ao cancelamento do convite');
        }
      }

      // Cancelar o convite
      const { error } = await supabase
        .from('user_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      await fetchInvitations();
      await fetchUsers(); // Atualizar lista de usuários para refletir mudanças de status
      
      toast({
        title: 'Sucesso',
        description: 'Convite cancelado',
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao cancelar convite';
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
    fetchInvitations();
    fetchModules();
  }, []);

  return {
    users,
    invitations,
    modules,
    loading,
    error,
    createUserInvitation,
    acceptInvitation,
    cancelInvitation,
    resendInvitation,
    updateUserPermissions,
    updateUserStatus,
    refetch: fetchUsers
  };
};
