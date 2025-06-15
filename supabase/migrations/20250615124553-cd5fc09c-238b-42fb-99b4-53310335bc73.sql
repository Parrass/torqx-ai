
-- Criar tabela para gerenciar instâncias WhatsApp
CREATE TABLE public.whatsapp_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    instance_name VARCHAR(255) NOT NULL UNIQUE,
    instance_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'created',
    qr_code TEXT,
    pairing_code VARCHAR(20),
    token VARCHAR(255),
    webhook_url TEXT,
    settings JSONB DEFAULT '{}',
    is_connected BOOLEAN DEFAULT false,
    last_connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar RLS
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;

-- Política para que apenas usuários do mesmo tenant vejam suas instâncias
CREATE POLICY "Users can view their tenant's whatsapp instances" 
    ON public.whatsapp_instances 
    FOR SELECT 
    USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create their tenant's whatsapp instances" 
    ON public.whatsapp_instances 
    FOR INSERT 
    WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's whatsapp instances" 
    ON public.whatsapp_instances 
    FOR UPDATE 
    USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's whatsapp instances" 
    ON public.whatsapp_instances 
    FOR DELETE 
    USING (tenant_id = get_current_user_tenant_id());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_whatsapp_instances_updated_at 
    BEFORE UPDATE ON public.whatsapp_instances 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
