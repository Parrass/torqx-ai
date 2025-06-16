
-- Recriar a view users_with_permissions com agregação correta das permissões
DROP VIEW IF EXISTS public.users_with_permissions;

CREATE VIEW public.users_with_permissions AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.role,
    u.status,
    u.tenant_id,
    u.last_login_at,
    u.created_at,
    u.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'module_name', ump.module_name,
                'can_create', ump.can_create,
                'can_read', ump.can_read,
                'can_update', ump.can_update,
                'can_delete', ump.can_delete
            )
        ) FILTER (WHERE ump.module_name IS NOT NULL),
        '[]'::json
    ) as permissions
FROM public.users u
LEFT JOIN public.user_module_permissions ump ON u.id = ump.user_id
GROUP BY u.id, u.email, u.full_name, u.phone, u.role, u.status, u.tenant_id, u.last_login_at, u.created_at, u.updated_at;

-- Função para garantir que owners tenham todas as permissões
CREATE OR REPLACE FUNCTION public.ensure_owner_permissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_record record;
  module_record record;
BEGIN
  -- Buscar todos os usuários com role 'owner'
  FOR owner_record IN 
    SELECT id FROM public.users WHERE role = 'owner'
  LOOP
    -- Para cada owner, garantir que tenha permissões para todos os módulos
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
        owner_record.id,
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
  END LOOP;
END;
$$;

-- Executar a função para garantir permissões dos owners existentes
SELECT public.ensure_owner_permissions();
