
import { supabase } from '@/integrations/supabase/client';

export const initializeUserPermissions = async () => {
  try {
    // Primeiro, buscar o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('Usuário não encontrado');
      return false;
    }

    // Buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      return false;
    }

    console.log('Dados do usuário:', userData);

    // Se for owner, inicializar permissões
    if (userData?.role === 'owner') {
      console.log('Inicializando permissões para owner...');
      
      const { error: initError } = await supabase.rpc('initialize_owner_permissions');
      
      if (initError) {
        console.error('Erro ao inicializar permissões:', initError);
        return false;
      }

      console.log('Permissões inicializadas com sucesso');
      return true;
    }

    return true;
  } catch (error) {
    console.error('Erro na inicialização de permissões:', error);
    return false;
  }
};

export const checkUserHasPermission = async (module: string, permission: 'create' | 'read' | 'update' | 'delete') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Buscar role do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // Owner tem todas as permissões
    if (userData?.role === 'owner') {
      return true;
    }

    // Verificar permissão específica
    const { data: permissionData } = await supabase
      .from('user_module_permissions')
      .select(`can_${permission}`)
      .eq('user_id', user.id)
      .eq('module_name', module)
      .single();

    return permissionData?.[`can_${permission}`] || false;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};
