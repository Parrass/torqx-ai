
-- Verificar e corrigir as políticas RLS para onboarding

-- Primeiro, garantir que as tabelas de onboarding tenham RLS habilitado
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para onboarding_progress
DROP POLICY IF EXISTS "Users can manage their onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can manage their onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Políticas para onboarding_tasks
DROP POLICY IF EXISTS "Users can manage their onboarding tasks" ON public.onboarding_tasks;
CREATE POLICY "Users can manage their onboarding tasks" 
ON public.onboarding_tasks 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Corrigir as políticas de tenants para permitir que usuários criem e acessem seus tenants
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenant" ON public.tenants;
DROP POLICY IF EXISTS "Users can update their tenant" ON public.tenants;

-- Permitir que usuários autenticados criem tenants
CREATE POLICY "Authenticated users can create tenants" 
ON public.tenants 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Permitir que usuários vejam seus próprios tenants
CREATE POLICY "Users can view their own tenant" 
ON public.tenants 
FOR SELECT 
TO authenticated
USING (
  id IN (
    SELECT tenant_id 
    FROM public.users 
    WHERE id = auth.uid()
  )
);

-- Permitir que usuários atualizem seus próprios tenants
CREATE POLICY "Users can update their own tenant" 
ON public.tenants 
FOR UPDATE 
TO authenticated
USING (
  id IN (
    SELECT tenant_id 
    FROM public.users 
    WHERE id = auth.uid()
  )
);

-- Corrigir a função get_or_create_tenant_for_user para melhor tratamento de erros
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
  user_name text;
  user_exists boolean;
BEGIN
  -- Verificar se o usuário existe na tabela users
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = auth.uid()) INTO user_exists;
  
  -- Se o usuário não existe na tabela users, criar primeiro
  IF NOT user_exists THEN
    -- Buscar dados do auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
    
    -- Inserir usuário na tabela users
    INSERT INTO public.users (id, email, full_name, role, tenant_id)
    VALUES (
      auth.uid(),
      user_email,
      COALESCE(SPLIT_PART(user_email, '@', 1), 'Usuário'),
      'owner',
      NULL
    );
  END IF;

  -- Buscar tenant_id do usuário atual
  SELECT tenant_id INTO user_tenant_id
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Se já tem tenant, retorna
  IF user_tenant_id IS NOT NULL THEN
    RETURN user_tenant_id;
  END IF;
  
  -- Buscar dados do usuário
  SELECT email, full_name INTO user_email, user_name
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Se não encontrou o usuário, buscar no auth
  IF user_email IS NULL THEN
    SELECT email INTO user_email
    FROM auth.users 
    WHERE id = auth.uid();
  END IF;
  
  -- Criar novo tenant
  INSERT INTO public.tenants (
    name,
    business_name,
    email,
    document_number,
    status
  ) VALUES (
    COALESCE(user_name, SPLIT_PART(user_email, '@', 1), 'Oficina'),
    COALESCE(user_name, SPLIT_PART(user_email, '@', 1), 'Oficina'),
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
