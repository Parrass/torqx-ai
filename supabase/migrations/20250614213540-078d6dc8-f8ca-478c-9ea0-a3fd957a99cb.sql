
-- Habilitar Row Level Security na tabela vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: usuários podem ver apenas veículos do seu tenant
CREATE POLICY "Users can view vehicles from their tenant" 
ON public.vehicles 
FOR SELECT 
USING (tenant_id = public.get_current_user_tenant_id());

-- Política para INSERT: usuários podem criar veículos apenas no seu tenant
CREATE POLICY "Users can create vehicles in their tenant" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (tenant_id = public.get_current_user_tenant_id());

-- Política para UPDATE: usuários podem atualizar apenas veículos do seu tenant
CREATE POLICY "Users can update vehicles from their tenant" 
ON public.vehicles 
FOR UPDATE 
USING (tenant_id = public.get_current_user_tenant_id());

-- Política para DELETE: usuários podem deletar apenas veículos do seu tenant
CREATE POLICY "Users can delete vehicles from their tenant" 
ON public.vehicles 
FOR DELETE 
USING (tenant_id = public.get_current_user_tenant_id());

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_vehicles_tenant_id ON public.vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON public.vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_model ON public.vehicles(brand, model);
