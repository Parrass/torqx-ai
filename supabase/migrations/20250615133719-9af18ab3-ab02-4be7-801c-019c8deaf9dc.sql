
-- Primeiro, vamos criar um trigger para sincronizar usuários automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, tenant_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'owner',
    NULL -- será preenchido quando o tenant for criado
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ajustar políticas RLS para permitir criação de tenant por usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can create tenants" ON tenants;
DROP POLICY IF EXISTS "Users can view their tenant" ON tenants;
DROP POLICY IF EXISTS "Users can update their tenant" ON tenants;

-- Permitir criação de tenants por usuários autenticados
CREATE POLICY "Users can create tenants" 
ON tenants 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Permitir visualização de tenants pelo próprio usuário
CREATE POLICY "Users can view their tenant" 
ON tenants 
FOR SELECT 
TO authenticated
USING (
  id = (SELECT tenant_id FROM users WHERE id = auth.uid())
);

-- Permitir atualização de tenants pelo próprio usuário
CREATE POLICY "Users can update their tenant" 
ON tenants 
FOR UPDATE 
TO authenticated
USING (
  id = (SELECT tenant_id FROM users WHERE id = auth.uid())
);

-- Ajustar políticas da tabela users para permitir upsert
DROP POLICY IF EXISTS "Users can create their profile" ON users;
DROP POLICY IF EXISTS "Users can view their profile" ON users;
DROP POLICY IF EXISTS "Users can update their profile" ON users;

CREATE POLICY "Users can manage their profile" 
ON users 
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Criar função para obter ou criar tenant para usuário
CREATE OR REPLACE FUNCTION public.get_or_create_tenant_for_user()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tenant_id uuid;
  new_tenant_id uuid;
  user_email text;
BEGIN
  -- Buscar tenant_id do usuário atual
  SELECT tenant_id INTO user_tenant_id
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Se já tem tenant, retorna
  IF user_tenant_id IS NOT NULL THEN
    RETURN user_tenant_id;
  END IF;
  
  -- Buscar email do usuário
  SELECT email INTO user_email
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Criar novo tenant
  INSERT INTO public.tenants (
    name,
    business_name,
    email,
    document_number,
    status
  ) VALUES (
    COALESCE(SPLIT_PART(user_email, '@', 1), 'Oficina'),
    COALESCE(SPLIT_PART(user_email, '@', 1), 'Oficina'),
    user_email,
    '00000000000',
    'active'
  )
  RETURNING id INTO new_tenant_id;
  
  -- Atualizar usuário com tenant_id
  UPDATE public.users 
  SET tenant_id = new_tenant_id
  WHERE id = auth.uid();
  
  RETURN new_tenant_id;
END;
$$;
