
-- Atualizar a tabela users para incluir campos necessários
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS created_by_user_id uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Criar tabela para definir módulos do sistema
CREATE TABLE IF NOT EXISTS public.system_modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL UNIQUE,
    display_name varchar(255) NOT NULL,
    description text,
    icon varchar(50),
    category varchar(50) DEFAULT 'general',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Inserir os módulos do sistema Torqx
INSERT INTO public.system_modules (name, display_name, description, icon, category) VALUES
('customers', 'Clientes', 'Gestão de clientes', 'users', 'core'),
('vehicles', 'Veículos', 'Gestão de veículos', 'car', 'core'),
('service_orders', 'Ordens de Serviço', 'Gestão de ordens de serviço', 'file-text', 'core'),
('inventory', 'Estoque', 'Gestão de estoque', 'package', 'operations'),
('purchases', 'Compras', 'Gestão de compras', 'shopping-cart', 'operations'),
('suppliers', 'Fornecedores', 'Gestão de fornecedores', 'truck', 'operations'),
('appointments', 'Agendamentos', 'Gestão de agendamentos', 'calendar', 'scheduling'),
('reports', 'Relatórios', 'Visualização de relatórios', 'bar-chart-3', 'analytics'),
('ai_assistant', 'IA Assistente', 'Acesso ao assistente de IA', 'bot', 'ai'),
('whatsapp_ai', 'WhatsApp IA', 'Integração WhatsApp com IA', 'message-square', 'ai'),
('settings', 'Configurações', 'Configurações do sistema', 'settings', 'admin'),
('team_management', 'Gestão de Equipe', 'Gestão de usuários e permissões', 'users', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Criar tabela para permissões modulares
CREATE TABLE IF NOT EXISTS public.user_module_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    module_name varchar(100) NOT NULL REFERENCES public.system_modules(name) ON DELETE CASCADE,
    can_create boolean DEFAULT false,
    can_read boolean DEFAULT false,
    can_update boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, module_name)
);

-- Criar trigger para updated_at
CREATE OR REPLACE TRIGGER update_user_module_permissions_updated_at
    BEFORE UPDATE ON public.user_module_permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para system_modules (todos podem ler)
CREATE POLICY "All authenticated users can read system modules"
ON public.system_modules FOR SELECT
TO authenticated
USING (true);

-- Políticas RLS para user_module_permissions
CREATE POLICY "Users can read their own permissions"
ON public.user_module_permissions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Apenas usuários com permissão de gestão de equipe podem gerenciar permissões
CREATE POLICY "Team managers can manage permissions"
ON public.user_module_permissions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_module_permissions ump
        WHERE ump.user_id = auth.uid()
        AND ump.module_name = 'team_management'
        AND ump.can_update = true
    )
);

-- Função para verificar permissões modulares
CREATE OR REPLACE FUNCTION public.check_user_permission(
    _user_id uuid,
    _module_name text,
    _permission_type text
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT CASE 
        WHEN _permission_type = 'create' THEN COALESCE(can_create, false)
        WHEN _permission_type = 'read' THEN COALESCE(can_read, false)
        WHEN _permission_type = 'update' THEN COALESCE(can_update, false)
        WHEN _permission_type = 'delete' THEN COALESCE(can_delete, false)
        ELSE false
    END
    FROM public.user_module_permissions
    WHERE user_id = _user_id AND module_name = _module_name;
$$;

-- View para facilitar consultas de usuários com permissões
CREATE OR REPLACE VIEW public.users_with_permissions AS
SELECT 
    u.id,
    u.tenant_id,
    u.email,
    u.full_name,
    u.phone,
    u.role,
    u.status,
    u.last_login_at,
    u.created_at,
    u.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'module_name', ump.module_name,
                'can_create', ump.can_create,
                'can_read', ump.can_read,
                'can_update', ump.can_update,
                'can_delete', ump.can_delete
            )
        ) FILTER (WHERE ump.module_name IS NOT NULL),
        '[]'::json
    ) as permissions
FROM public.users u
LEFT JOIN public.user_module_permissions ump ON u.id = ump.user_id
GROUP BY u.id, u.tenant_id, u.email, u.full_name, u.phone, u.role, u.status, u.last_login_at, u.created_at, u.updated_at;
