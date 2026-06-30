-- El cupón usado en la compra se guarda en la orden para engancharlo en el
-- fulfillment (registrar redención + comisión + bonus). Nullable: la mayoría
-- de las compras no llevan cupón.
ALTER TABLE public.desk_orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.orders      ADD COLUMN IF NOT EXISTS coupon_code text;
COMMENT ON COLUMN public.desk_orders.coupon_code IS 'Cupón de afiliado usado en la compra (si hubo). Engancha la comisión + los +2 análisis en el fulfillment.';
COMMENT ON COLUMN public.orders.coupon_code IS 'Cupón usado en la compra del curso (si hubo). Engancha la comisión del afiliado en el fulfillment.';
