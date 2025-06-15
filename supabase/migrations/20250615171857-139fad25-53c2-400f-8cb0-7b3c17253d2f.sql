
-- Habilitar RLS na tabela workshop_settings se não estiver habilitado
ALTER TABLE public.workshop_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para workshop_settings
DROP POLICY IF EXISTS "Users can view their workshop settings" ON public.workshop_settings;
CREATE POLICY "Users can view their workshop settings" 
ON public.workshop_settings 
FOR SELECT 
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create their workshop settings" ON public.workshop_settings;
CREATE POLICY "Users can create their workshop settings" 
ON public.workshop_settings 
FOR INSERT 
TO authenticated
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
  AND created_by_user_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update their workshop settings" ON public.workshop_settings;
CREATE POLICY "Users can update their workshop settings" 
ON public.workshop_settings 
FOR UPDATE 
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their workshop settings" ON public.workshop_settings;
CREATE POLICY "Users can delete their workshop settings" 
ON public.workshop_settings 
FOR DELETE 
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);
