
-- Primeiro, vamos corrigir a política RLS que está causando recursão infinita
-- Removendo as políticas problemáticas
DROP POLICY IF EXISTS "Team managers can manage permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Users can read their own permissions" ON public.user_module_permissions;

-- Criar função segura para obter o role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.users 
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$;

-- Criar função para verificar se usuário é owner ou tem permissão específica
CREATE OR REPLACE FUNCTION public.user_has_module_access(module_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
  has_permission boolean;
BEGIN
  -- Buscar role do usuário
  SELECT role INTO user_role
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Se for owner, tem acesso a tudo
  IF user_role = 'owner' THEN
    RETURN true;
  END IF;
  
  -- Caso contrário, verificar permissões específicas
  SELECT EXISTS(
    SELECT 1 
    FROM public.user_module_permissions 
    WHERE user_id = auth.uid() 
    AND module_name = user_has_module_access.module_name 
    AND can_read = true
  ) INTO has_permission;
  
  RETURN COALESCE(has_permission, false);
END;
$$;

-- Recriar políticas RLS mais seguras
CREATE POLICY "Users can read their own permissions or if owner"
ON public.user_module_permissions FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'owner'
);

CREATE POLICY "Owners and managers can manage permissions"
ON public.user_module_permissions FOR ALL
TO authenticated
USING (
  public.get_current_user_role() IN ('owner', 'manager') OR
  user_id = auth.uid()
);

-- Criar função para inicializar permissões do owner automaticamente
CREATE OR REPLACE FUNCTION public.initialize_owner_permissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  module_record record;
BEGIN
  -- Buscar dados do usuário atual
  SELECT id, role INTO current_user_id, current_user_role
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Se for owner, criar permissões para todos os módulos
  IF current_user_role = 'owner' THEN
    -- Remover permissões existentes para evitar conflitos
    DELETE FROM public.user_module_permissions 
    WHERE user_id = current_user_id;
    
    -- Inserir permissões completas para todos os módulos ativos
    FOR module_record IN 
      SELECT name FROM public.system_modules WHERE is_active = true
    LOOP
      INSERT INTO public.user_module_permissions (
        user_id, 
        module_name, 
        can_create, 
        can_read, 
        can_update, 
        can_delete
      ) VALUES (
        current_user_id,
        module_record.name,
        true,
        true,
        true,
        true
      ) ON CONFLICT (user_id, module_name) DO UPDATE SET
        can_create = true,
        can_read = true,
        can_update = true,
        can_delete = true;
    END LOOP;
  END IF;
END;
$$;
