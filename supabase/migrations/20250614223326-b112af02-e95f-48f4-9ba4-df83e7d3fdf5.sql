
-- Create purchases table to track all purchases
CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    purchase_number INTEGER NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_document VARCHAR(20),
    supplier_contact JSONB DEFAULT '{}',
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date DATE,
    category VARCHAR(100) DEFAULT 'general',
    notes TEXT,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    created_by_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase items table for detailed purchase items
CREATE TABLE public.purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for purchase numbers per tenant
CREATE SEQUENCE purchase_number_seq START 1;

-- Create function to generate purchase number
CREATE OR REPLACE FUNCTION generate_purchase_number(tenant_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN nextval('purchase_number_seq');
END;
$$ LANGUAGE plpgsql;

-- Add indexes for better performance
CREATE INDEX idx_purchases_tenant_id ON public.purchases(tenant_id);
CREATE INDEX idx_purchases_purchase_date ON public.purchases(purchase_date);
CREATE INDEX idx_purchases_payment_status ON public.purchases(payment_status);
CREATE INDEX idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);

-- Add RLS policies
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view purchases from their tenant" 
    ON public.purchases FOR SELECT 
    USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create purchases for their tenant" 
    ON public.purchases FOR INSERT 
    WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update purchases from their tenant" 
    ON public.purchases FOR UPDATE 
    USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete purchases from their tenant" 
    ON public.purchases FOR DELETE 
    USING (tenant_id = get_current_user_tenant_id());

-- Purchase items policies
CREATE POLICY "Users can view purchase items from their tenant" 
    ON public.purchase_items FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE purchases.id = purchase_items.purchase_id 
        AND purchases.tenant_id = get_current_user_tenant_id()
    ));

CREATE POLICY "Users can create purchase items for their tenant" 
    ON public.purchase_items FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE purchases.id = purchase_items.purchase_id 
        AND purchases.tenant_id = get_current_user_tenant_id()
    ));

CREATE POLICY "Users can update purchase items from their tenant" 
    ON public.purchase_items FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE purchases.id = purchase_items.purchase_id 
        AND purchases.tenant_id = get_current_user_tenant_id()
    ));

CREATE POLICY "Users can delete purchase items from their tenant" 
    ON public.purchase_items FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE purchases.id = purchase_items.purchase_id 
        AND purchases.tenant_id = get_current_user_tenant_id()
    ));

-- Add trigger for updated_at
CREATE TRIGGER update_purchases_updated_at 
    BEFORE UPDATE ON public.purchases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for purchase metrics
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
