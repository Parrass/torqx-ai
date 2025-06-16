
-- Habilitar RLS nas tabelas que ainda não têm
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela users
CREATE POLICY "Users can view users from their tenant"
    ON public.users FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update users from their tenant"
    ON public.users FOR UPDATE
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- Políticas para user_module_permissions
CREATE POLICY "Users can view permissions from their tenant"
    ON public.user_module_permissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY "Users can create permissions for their tenant"
    ON public.user_module_permissions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY "Users can update permissions for their tenant"
    ON public.user_module_permissions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY "Users can delete permissions for their tenant"
    ON public.user_module_permissions FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = user_module_permissions.user_id 
            AND users.tenant_id = get_current_tenant_id()
        )
    );

-- Políticas para user_invitations (melhorar as existentes)
DROP POLICY IF EXISTS "Users can view invitations from their tenant" ON public.user_invitations;
DROP POLICY IF EXISTS "Team managers can create invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON public.user_invitations;

CREATE POLICY "Users can view invitations from their tenant"
    ON public.user_invitations FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can create invitations for their tenant"
    ON public.user_invitations FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update invitations from their tenant"
    ON public.user_invitations FOR UPDATE
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- Política para permitir que owners/managers tenham acesso total
CREATE POLICY "Owners and managers have full access to users"
    ON public.users FOR ALL
    TO authenticated
    USING (
        tenant_id = get_current_tenant_id() AND
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.tenant_id = get_current_tenant_id()
            AND u.role IN ('owner', 'manager')
        )
    );
