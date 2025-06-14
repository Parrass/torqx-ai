
-- Criar tabela de compras
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_number INTEGER NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_document VARCHAR(20),
    supplier_contact JSONB DEFAULT '{}',
    invoice_number VARCHAR(100),
    invoice_date DATE,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    category VARCHAR(100) DEFAULT 'general',
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    final_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date DATE,
    notes TEXT,
    created_by_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de itens de compra
CREATE TABLE IF NOT EXISTS public.purchase_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id),
    description TEXT NOT NULL,
    category VARCHAR(100),
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar sequência para numeração de compras
CREATE SEQUENCE IF NOT EXISTS purchase_number_seq START 1;

-- Função para gerar número da compra
CREATE OR REPLACE FUNCTION generate_purchase_number(tenant_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN nextval('purchase_number_seq');
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_purchases_updated_at
    BEFORE UPDATE ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_purchases_tenant_id ON public.purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON public.purchases(supplier_name);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON public.purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);

-- View para métricas de compras
CREATE OR REPLACE VIEW purchase_metrics AS
SELECT 
    p.tenant_id,
    DATE_TRUNC('month', p.purchase_date) as month,
    COUNT(*) as total_purchases,
    SUM(p.final_amount) as total_spent,
    AVG(p.final_amount) as avg_purchase_value,
    SUM(CASE WHEN p.payment_status = 'paid' THEN p.final_amount ELSE 0 END) as paid_amount,
    SUM(CASE WHEN p.payment_status = 'pending' THEN p.final_amount ELSE 0 END) as pending_amount
FROM public.purchases p
GROUP BY p.tenant_id, DATE_TRUNC('month', p.purchase_date);
