
-- Corrigir o erro de recursão infinita nas políticas RLS da tabela users
DROP POLICY IF EXISTS "Owners and managers have full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view users from their tenant" ON public.users;
DROP POLICY IF EXISTS "Users can update users from their tenant" ON public.users;

-- Criar políticas mais simples e sem recursão
CREATE POLICY "Users can view users from same tenant"
    ON public.users FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update users from same tenant"
    ON public.users FOR UPDATE
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- Política para permitir inserção de novos usuários
CREATE POLICY "Users can insert users in same tenant"
    ON public.users FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_current_tenant_id());

-- Função para verificar se o usuário atual pode gerenciar equipe
CREATE OR REPLACE FUNCTION public.can_manage_team()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    user_role text;
    has_permission boolean := false;
BEGIN
    -- Buscar role do usuário
    SELECT role INTO user_role
    FROM public.users 
    WHERE id = auth.uid();
    
    -- Se for owner, pode gerenciar
    IF user_role = 'owner' THEN
        RETURN true;
    END IF;
    
    -- Verificar se tem permissão específica para team_management
    SELECT EXISTS(
        SELECT 1 
        FROM public.user_module_permissions 
        WHERE user_id = auth.uid() 
        AND module_name = 'team_management' 
        AND can_update = true
    ) INTO has_permission;
    
    RETURN COALESCE(has_permission, false);
END;
$$;

-- Política para deletar usuários (apenas quem pode gerenciar equipe)
CREATE POLICY "Team managers can delete users"
    ON public.users FOR DELETE
    TO authenticated
    USING (
        tenant_id = get_current_tenant_id() 
        AND public.can_manage_team()
        AND id != auth.uid() -- Não pode deletar a si mesmo
    );

-- Atualizar política de permissões para ser mais específica
DROP POLICY IF EXISTS "Team managers can manage permissions" ON public.user_module_permissions;

CREATE POLICY "Team managers can manage all permissions"
    ON public.user_module_permissions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
        AND public.can_manage_team()
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
        AND public.can_manage_team()
    );
