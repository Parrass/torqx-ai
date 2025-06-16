
-- Criar tabela para armazenar convites pendentes
CREATE TABLE IF NOT EXISTS public.user_invitations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email varchar(255) NOT NULL,
    full_name varchar(255) NOT NULL,
    phone varchar(20),
    role varchar(50) NOT NULL,
    permissions jsonb NOT NULL DEFAULT '{}',
    status varchar(20) NOT NULL DEFAULT 'pending', -- pending, accepted, expired
    invited_by_user_id uuid NOT NULL REFERENCES public.users(id),
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
    accepted_at timestamp with time zone,
    UNIQUE(email, tenant_id)
);

-- Habilitar RLS na tabela de convites
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Política para que usuários possam ver convites do seu tenant
CREATE POLICY "Users can view invitations from their tenant"
    ON public.user_invitations FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- Política para que usuários com permissão possam criar convites
CREATE POLICY "Team managers can create invitations"
    ON public.user_invitations FOR INSERT
    TO authenticated
    WITH CHECK (
        tenant_id = get_current_tenant_id() AND
        EXISTS (
            SELECT 1 FROM public.user_module_permissions ump
            WHERE ump.user_id = auth.uid()
            AND ump.module_name = 'team_management'
            AND ump.can_create = true
        )
    );

-- Política para atualizar convites (aceitar/rejeitar)
CREATE POLICY "Users can update their own invitations"
    ON public.user_invitations FOR UPDATE
    TO authenticated
    USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR 
           tenant_id = get_current_tenant_id());

-- Função para aceitar convite e criar usuário final
CREATE OR REPLACE FUNCTION public.accept_user_invitation(invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    invitation_record record;
    new_user_id uuid;
    current_user_email text;
BEGIN
    -- Buscar email do usuário atual
    SELECT email INTO current_user_email 
    FROM auth.users 
    WHERE id = auth.uid();
    
    -- Buscar convite válido
    SELECT * INTO invitation_record
    FROM public.user_invitations
    WHERE id = invitation_id
    AND email = current_user_email
    AND status = 'pending'
    AND expires_at > now();
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Convite não encontrado ou expirado');
    END IF;
    
    -- Criar usuário na tabela users
    INSERT INTO public.users (
        id,
        email,
        full_name,
        phone,
        role,
        tenant_id,
        status
    ) VALUES (
        auth.uid(),
        invitation_record.email,
        invitation_record.full_name,
        invitation_record.phone,
        invitation_record.role,
        invitation_record.tenant_id,
        'active'
    ) ON CONFLICT (id) DO UPDATE SET
        tenant_id = invitation_record.tenant_id,
        role = invitation_record.role,
        full_name = invitation_record.full_name,
        phone = invitation_record.phone,
        status = 'active';
    
    -- Criar permissões do usuário
    IF jsonb_typeof(invitation_record.permissions) = 'object' THEN
        INSERT INTO public.user_module_permissions (
            user_id,
            module_name,
            can_create,
            can_read,
            can_update,
            can_delete
        )
        SELECT 
            auth.uid(),
            key,
            (value->>'can_create')::boolean,
            (value->>'can_read')::boolean,
            (value->>'can_update')::boolean,
            (value->>'can_delete')::boolean
        FROM jsonb_each(invitation_record.permissions)
        ON CONFLICT (user_id, module_name) DO UPDATE SET
            can_create = EXCLUDED.can_create,
            can_read = EXCLUDED.can_read,
            can_update = EXCLUDED.can_update,
            can_delete = EXCLUDED.can_delete;
    END IF;
    
    -- Marcar convite como aceito
    UPDATE public.user_invitations
    SET status = 'accepted', accepted_at = now()
    WHERE id = invitation_id;
    
    RETURN jsonb_build_object('success', true, 'user_id', auth.uid());
END;
$$;

-- Criar view para convites com informações do convidador
CREATE OR REPLACE VIEW public.user_invitations_with_details AS
SELECT 
    ui.*,
    u.full_name as invited_by_name,
    t.business_name as company_name
FROM public.user_invitations ui
LEFT JOIN public.users u ON ui.invited_by_user_id = u.id
LEFT JOIN public.tenants t ON ui.tenant_id = t.id;
