
-- Remover todas as políticas existentes para tenants
DROP POLICY IF EXISTS "Allow tenant creation during registration" ON tenants;
DROP POLICY IF EXISTS "Users can view their own tenant" ON tenants;
DROP POLICY IF EXISTS "Users can update their own tenant" ON tenants;

-- Criar políticas mais simples e funcionais
-- Permitir INSERT para usuários autenticados (após criar a conta)
CREATE POLICY "Authenticated users can create tenants" 
ON tenants 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Permitir SELECT apenas para usuários do tenant
CREATE POLICY "Users can view their tenant" 
ON tenants 
FOR SELECT 
TO authenticated
USING (
  id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Permitir UPDATE apenas para usuários do tenant
CREATE POLICY "Users can update their tenant" 
ON tenants 
FOR UPDATE 
TO authenticated
USING (
  id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Adicionar políticas RLS para a tabela users também
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Users can create their profile" 
ON users 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

-- Permitir SELECT apenas do próprio perfil
CREATE POLICY "Users can view their profile" 
ON users 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Permitir UPDATE apenas do próprio perfil
CREATE POLICY "Users can update their profile" 
ON users 
FOR UPDATE 
TO authenticated
USING (id = auth.uid());
