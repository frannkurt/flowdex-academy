-- Afiliado por USUARIO (no texto libre): un nombre mal tipeado genera
-- inconsistencias. El cupón se asigna a un user_id real; affiliate_name queda
-- como cache de display (se llena del profile al asignar).
ALTER TABLE public.promo_codes
  ADD COLUMN IF NOT EXISTS affiliate_user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.coupon_redemptions
  ADD COLUMN IF NOT EXISTS affiliate_user_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS coupon_redemptions_affiliate_idx
  ON public.coupon_redemptions (affiliate_user_id);
COMMENT ON COLUMN public.promo_codes.affiliate_user_id IS 'Usuario dueño del cupón (afiliado). Fuente de verdad; affiliate_name es solo cache de display.';
