-- Comisión de afiliado en cursos: el fulfillment de Academy está repartido en 3
-- webhooks (PayPal usa fulfillPaidOrder; MP y NOWPayments tienen lógica inline),
-- todos terminan poniendo orders.status='paid'. Un trigger en ese flip cubre los
-- 3 caminos en un solo lugar, sin tocar código de pagos. Idempotente: ON CONFLICT
-- DO NOTHING contra el índice único de coupon_redemptions.
-- (El Desk NO usa este trigger: su fulfillment es compartido y se maneja en
--  fulfill-desk-order.ts, que además otorga los +2 análisis del comprador.)

CREATE OR REPLACE FUNCTION public.record_academy_coupon_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo  public.promo_codes%ROWTYPE;
  v_slug   text;
  v_pct    numeric;
  v_comm   numeric;
BEGIN
  -- Solo en la transición a 'paid', y solo si la orden llevó cupón.
  IF NEW.status <> 'paid' OR OLD.status = 'paid' OR NEW.coupon_code IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_promo FROM public.promo_codes
    WHERE code = upper(trim(NEW.coupon_code)) LIMIT 1;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  SELECT slug INTO v_slug FROM public.courses WHERE id = NEW.course_id;

  v_pct  := COALESCE(v_promo.commission_pct_academy, 0);
  v_comm := round((COALESCE(NEW.amount_usd, 0) * v_pct / 100)::numeric, 2);

  INSERT INTO public.coupon_redemptions
    (code, affiliate_name, buyer_user_id, product, course_slug, order_ref,
     amount_paid_usd, commission_pct, commission_usd)
  VALUES
    (v_promo.code, v_promo.affiliate_name, NEW.user_id, 'academy', v_slug, NEW.id::text,
     COALESCE(NEW.amount_usd, 0), v_pct, v_comm)
  ON CONFLICT (code, buyer_user_id, product, COALESCE(course_slug, '')) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_academy_coupon_commission ON public.orders;
CREATE TRIGGER trg_academy_coupon_commission
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.record_academy_coupon_commission();
