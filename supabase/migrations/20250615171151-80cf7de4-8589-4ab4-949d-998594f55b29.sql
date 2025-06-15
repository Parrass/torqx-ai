
-- Corrigir a função get_or_create_tenant_for_user para lidar melhor com tenants existentes
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
  existing_tenant_id uuid;
  unique_document text;
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
  
  -- Verificar se existe um tenant órfão (sem usuários associados) que possa ser usado
  SELECT t.id INTO existing_tenant_id
  FROM public.tenants t
  LEFT JOIN public.users u ON u.tenant_id = t.id
  WHERE u.id IS NULL
  AND t.status = 'active'
  LIMIT 1;
  
  -- Se encontrou um tenant órfão, usar ele
  IF existing_tenant_id IS NOT NULL THEN
    -- Atualizar o tenant com os dados do usuário
    UPDATE public.tenants 
    SET 
      name = COALESCE(user_name, SPLIT_PART(user_email, '@', 1), 'Oficina'),
      business_name = COALESCE(user_name, SPLIT_PART(user_email, '@', 1), 'Oficina'),
      email = user_email,
      updated_at = NOW()
    WHERE id = existing_tenant_id;
    
    -- Atualizar usuário com tenant_id
    UPDATE public.users 
    SET tenant_id = existing_tenant_id
    WHERE id = auth.uid();
    
    RETURN existing_tenant_id;
  END IF;
  
  -- Gerar um document_number único
  unique_document := LPAD((EXTRACT(EPOCH FROM NOW())::bigint % 100000000000)::text, 11, '0');
  
  -- Garantir que é único
  WHILE EXISTS(SELECT 1 FROM public.tenants WHERE document_number = unique_document) LOOP
    unique_document := LPAD(((EXTRACT(EPOCH FROM NOW())::bigint + FLOOR(RANDOM() * 1000))::bigint % 100000000000)::text, 11, '0');
  END LOOP;
  
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
    unique_document,
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

-- Associar o usuário atual ao tenant existente
UPDATE public.users 
SET tenant_id = 'a13f3b92-0607-4a71-9b3f-7baeafd973a4'
WHERE id = '54e1acde-8abb-42fd-b01f-ec240d47d1b4';

-- Verificar se as políticas RLS estão corretas
DROP POLICY IF EXISTS "Users can manage their onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can manage their onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their onboarding tasks" ON public.onboarding_tasks;
CREATE POLICY "Users can manage their onboarding tasks" 
ON public.onboarding_tasks 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
