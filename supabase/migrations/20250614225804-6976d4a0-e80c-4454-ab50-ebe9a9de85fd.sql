
-- Criar tabela de fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    document_type VARCHAR(20) DEFAULT 'cnpj',
    document_number VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    contact_person VARCHAR(255),
    address JSONB DEFAULT '{}',
    bank_info JSONB DEFAULT '{}',
    payment_terms INTEGER DEFAULT 30,
    credit_limit NUMERIC(12,2) DEFAULT 0.00,
    category VARCHAR(100) DEFAULT 'general',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    tags VARCHAR(255)[],
    created_by_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON public.suppliers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_document ON public.suppliers(document_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);

-- Adicionar referência de fornecedor na tabela de compras
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id);

-- Criar índice para a nova referência
CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON public.purchases(supplier_id);
