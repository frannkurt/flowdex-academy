-- Auditoría de acciones de escritura del /admin (cargar créditos, asignar
-- tier, registrar venta manual, comisiones de afiliados). Si se toca plata o
-- accesos a mano, tiene que quedar rastro inmutable: quién, cuándo, qué, a quién.
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id       uuid REFERENCES auth.users(id),
  action         text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id),
  detail         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_actions_created_idx ON public.admin_actions (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_actions_target_idx  ON public.admin_actions (target_user_id);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Solo admins leen la auditoría. Las escrituras van por service-role (server
-- actions), que saltea RLS — nadie puede insertar/editar desde el cliente.
DROP POLICY IF EXISTS admin_actions_admin_read ON public.admin_actions;
CREATE POLICY admin_actions_admin_read ON public.admin_actions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin')
  );

COMMENT ON TABLE public.admin_actions IS 'Log inmutable de acciones de escritura del panel admin (créditos, tiers, ventas manuales, comisiones).';
