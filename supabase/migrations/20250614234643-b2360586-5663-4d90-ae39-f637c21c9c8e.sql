
-- Criar tabela para armazenar os serviços prestados pela oficina
CREATE TABLE public.workshop_services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    base_price DECIMAL(12,2) DEFAULT 0.00,
    estimated_duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    requires_parts BOOLEAN DEFAULT false,
    skill_level VARCHAR(50) DEFAULT 'basic', -- basic, intermediate, advanced
    warranty_days INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL
);

-- Criar índices para performance
CREATE INDEX idx_workshop_services_tenant ON public.workshop_services(tenant_id);
CREATE INDEX idx_workshop_services_category ON public.workshop_services(category);
CREATE INDEX idx_workshop_services_active ON public.workshop_services(is_active);

-- Habilitar RLS
ALTER TABLE public.workshop_services ENABLE ROW LEVEL SECURITY;

-- Criar políticas de RLS para que cada tenant veja apenas seus próprios serviços
CREATE POLICY "Users can view their tenant services" ON public.workshop_services
    FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create services for their tenant" ON public.workshop_services
    FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant services" ON public.workshop_services
    FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant services" ON public.workshop_services
    FOR DELETE USING (tenant_id = get_current_user_tenant_id());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_workshop_services_updated_at
    BEFORE UPDATE ON public.workshop_services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
