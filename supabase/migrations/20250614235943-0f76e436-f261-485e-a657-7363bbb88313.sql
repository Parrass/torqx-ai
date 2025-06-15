
-- Criar tabela para armazenar configurações da oficina
CREATE TABLE public.workshop_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workshop_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    cnpj VARCHAR(18),
    state_registration VARCHAR(50),
    description TEXT,
    logo_url TEXT,
    workshop_photo_url TEXT,
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    working_hours JSONB DEFAULT '{}', -- Para armazenar horários de funcionamento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL
);

-- Criar índices para performance
CREATE INDEX idx_workshop_settings_tenant ON public.workshop_settings(tenant_id);

-- Habilitar RLS
ALTER TABLE public.workshop_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas de RLS para que cada tenant veja apenas suas próprias configurações
CREATE POLICY "Users can view their tenant workshop settings" ON public.workshop_settings
    FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create workshop settings for their tenant" ON public.workshop_settings
    FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant workshop settings" ON public.workshop_settings
    FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant workshop settings" ON public.workshop_settings
    FOR DELETE USING (tenant_id = get_current_user_tenant_id());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_workshop_settings_updated_at
    BEFORE UPDATE ON public.workshop_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Garantir que cada tenant tenha apenas uma configuração
CREATE UNIQUE INDEX idx_workshop_settings_unique_tenant ON public.workshop_settings(tenant_id);
