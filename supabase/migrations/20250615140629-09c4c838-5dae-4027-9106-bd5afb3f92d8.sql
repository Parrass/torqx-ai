
-- Corrigir a constraint de tenant_id na tabela users para permitir valores nulos
-- durante o processo de registro inicial
ALTER TABLE public.users ALTER COLUMN tenant_id DROP NOT NULL;

-- Criar função melhorada para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role, tenant_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'phone',
    'owner',
    NULL -- será preenchido quando o tenant for criado
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  
  RETURN NEW;
END;
$$;

-- Atualizar a função get_or_create_tenant_for_user para funcionar melhor
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
BEGIN
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
