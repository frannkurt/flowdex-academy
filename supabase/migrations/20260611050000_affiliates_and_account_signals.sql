-- ============================================================
-- Programa de afiliados (recicla promo_codes) + anti-abuso de cuentas
-- ============================================================

-- 1) El cupón ES el afiliado: extendemos promo_codes en vez de duplicar.
ALTER TABLE public.promo_codes
  ADD COLUMN IF NOT EXISTS affiliate_name          text,
  ADD COLUMN IF NOT EXISTS commission_pct_desk     numeric NOT NULL DEFAULT 20 CHECK (commission_pct_desk >= 0 AND commission_pct_desk <= 100),
  ADD COLUMN IF NOT EXISTS commission_pct_academy  numeric NOT NULL DEFAULT 5  CHECK (commission_pct_academy >= 0 AND commission_pct_academy <= 100),
  ADD COLUMN IF NOT EXISTS applies_desk            boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS applies_academy         boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.promo_codes.affiliate_name IS 'Nombre simple de la persona dueña del cupón (afiliado). NULL = cupón sin afiliado (promo común).';

-- 2) Redenciones: cada venta hecha con un cupón. Es el log del afiliado y la
--    base de la comisión. commission_paid_at = NULL hasta que marcás el pago mensual.
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text NOT NULL,
  affiliate_name    text,
  buyer_user_id     uuid REFERENCES auth.users(id),
  product           text NOT NULL CHECK (product IN ('desk', 'academy')),
  course_slug       text,
  order_ref         text,
  amount_paid_usd   numeric NOT NULL DEFAULT 0,
  commission_pct    numeric NOT NULL DEFAULT 0,
  commission_usd    numeric NOT NULL DEFAULT 0,
  commission_paid_at timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Uso único: en Desk, un cupón una sola vez por comprador. En Academy, una vez
-- por curso (puede reusarlo en OTROS cursos). El coalesce mete ambas reglas en
-- un solo índice: desk -> (code, buyer, 'desk', '') ; academy -> (code, buyer, 'academy', slug).
CREATE UNIQUE INDEX IF NOT EXISTS coupon_redemptions_once
  ON public.coupon_redemptions (code, buyer_user_id, product, COALESCE(course_slug, ''));
CREATE INDEX IF NOT EXISTS coupon_redemptions_code_idx ON public.coupon_redemptions (code);
CREATE INDEX IF NOT EXISTS coupon_redemptions_unpaid_idx ON public.coupon_redemptions (commission_paid_at) WHERE commission_paid_at IS NULL;

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coupon_redemptions_admin_read ON public.coupon_redemptions;
CREATE POLICY coupon_redemptions_admin_read ON public.coupon_redemptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- 3) Señales de cuenta (anti-abuso de las 2 pruebas gratis). IP + huella de
--    navegador por cuenta. Una vista/consulta agrupa por huella para detectar
--    la misma persona con varios mails.
CREATE TABLE IF NOT EXISTS public.desk_account_signals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),
  ip          text,
  fingerprint text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS desk_account_signals_fp_idx ON public.desk_account_signals (fingerprint);
CREATE INDEX IF NOT EXISTS desk_account_signals_ip_idx ON public.desk_account_signals (ip);
CREATE INDEX IF NOT EXISTS desk_account_signals_user_idx ON public.desk_account_signals (user_id);

ALTER TABLE public.desk_account_signals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS desk_account_signals_admin_read ON public.desk_account_signals;
CREATE POLICY desk_account_signals_admin_read ON public.desk_account_signals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

COMMENT ON TABLE public.coupon_redemptions IS 'Una fila por venta hecha con cupón. Log del afiliado + base de comisión. commission_paid_at = pago mensual.';
COMMENT ON TABLE public.desk_account_signals IS 'IP + fingerprint por cuenta del Desk para detectar multi-cuentas (farmeo de las 2 pruebas gratis).';
