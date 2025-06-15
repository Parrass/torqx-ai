
-- Inserir o módulo workshop_settings que está faltando
INSERT INTO public.system_modules (name, display_name, description, icon, category) VALUES
('workshop_settings', 'Config. da Oficina', 'Configurações da oficina', 'building-2', 'admin')
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;

-- Garantir que todos os módulos estejam ativos
UPDATE public.system_modules SET is_active = true WHERE name = 'workshop_settings';

-- Inicializar permissões para todos os usuários owner existentes
INSERT INTO public.user_module_permissions (
  user_id, 
  module_name, 
  can_create, 
  can_read, 
  can_update, 
  can_delete
)
SELECT 
  u.id,
  'workshop_settings',
  true,
  true,
  true,
  true
FROM public.users u
WHERE u.role = 'owner'
ON CONFLICT (user_id, module_name) DO UPDATE SET
  can_create = true,
  can_read = true,
  can_update = true,
  can_delete = true;
