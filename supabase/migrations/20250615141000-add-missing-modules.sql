
-- Inserir módulos que podem estar faltando
INSERT INTO public.system_modules (name, display_name, description, icon, category) VALUES
('workshop_services', 'Serviços da Oficina', 'Gestão de serviços oferecidos', 'wrench', 'operations'),
('workshop_settings', 'Config. da Oficina', 'Configurações da oficina', 'building-2', 'admin')
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;

-- Garantir que todos os módulos estejam ativos
UPDATE public.system_modules SET is_active = true WHERE is_active = false;
