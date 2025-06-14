
-- Habilitar Row Level Security na tabela customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Criar função de segurança para obter tenant_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM public.users 
        WHERE id = auth.uid()
    );
END;
$$;

-- Política para SELECT: usuários podem ver apenas clientes do seu tenant
CREATE POLICY "Users can view customers from their tenant" 
ON public.customers 
FOR SELECT 
USING (tenant_id = public.get_current_user_tenant_id());

-- Política para INSERT: usuários podem criar clientes apenas no seu tenant
CREATE POLICY "Users can create customers in their tenant" 
ON public.customers 
FOR INSERT 
WITH CHECK (tenant_id = public.get_current_user_tenant_id());

-- Política para UPDATE: usuários podem atualizar apenas clientes do seu tenant
CREATE POLICY "Users can update customers from their tenant" 
ON public.customers 
FOR UPDATE 
USING (tenant_id = public.get_current_user_tenant_id());

-- Política para DELETE: usuários podem deletar apenas clientes do seu tenant
CREATE POLICY "Users can delete customers from their tenant" 
ON public.customers 
FOR DELETE 
USING (tenant_id = public.get_current_user_tenant_id());

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON public.customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_document ON public.customers(document_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
