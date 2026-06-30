-- Anti-abuso: bloquear las 2 pruebas gratis a cuentas de confianza alta
-- (misma huella que otra cuenta = misma persona con varios mails). El flag vive
-- en desk_entitlements; el RPC lo respeta poniendo el límite gratis en 0. El
-- resto del modelo (founder/admin/packs) no cambia.
ALTER TABLE public.desk_entitlements
  ADD COLUMN IF NOT EXISTS free_blocked boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.desk_entitlements.free_blocked IS 'true = sin las 2 pruebas gratis (cuenta vinculada de confianza alta). Sigue pudiendo comprar packs.';

CREATE OR REPLACE FUNCTION public.desk_consume_run(p_user_id uuid, p_ticker text DEFAULT ''::text, p_board text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_tier        text;
  v_blocked     boolean := false;
  v_month       text := to_char((now() at time zone 'utc'), 'YYYY-MM');
  v_day         text := to_char((now() at time zone 'utc'), 'YYYY-MM-DD');
  v_month_start timestamptz := date_trunc('month', (now() at time zone 'utc')) at time zone 'utc';
  v_day_start   timestamptz := date_trunc('day',   (now() at time zone 'utc')) at time zone 'utc';
  v_free_limit  int := 2;
  v_admin_limit int := 20;
  v_used        int;
  v_id          uuid;
  v_credit_id   uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select tier, free_blocked into v_tier, v_blocked
    from public.desk_entitlements where user_id = p_user_id;
  if v_tier is null then
    insert into public.desk_entitlements(user_id, tier) values (p_user_id, 'trial')
      on conflict (user_id) do nothing;
    v_tier := 'trial';
    v_blocked := false;
  end if;

  -- Cuenta vinculada de confianza alta: sin pruebas gratis (debe comprar pack).
  if v_blocked then
    v_free_limit := 0;
  end if;

  -- Admin: cuenta interna, 20 análisis por DÍA (no usa packs).
  if v_tier = 'admin' then
    select count(*) into v_used from public.desk_runs
      where user_id = p_user_id and funded_by = 'internal' and created_at >= v_day_start;
    if v_used >= v_admin_limit then return null; end if;
    insert into public.desk_runs(user_id, ticker, board, decision, period, funded_by)
      values (p_user_id, p_ticker, p_board, '{}'::jsonb, v_day, 'internal') returning id into v_id;
    return v_id;
  end if;

  -- Free = 2 (0 si está bloqueada). Founder cuenta por MES; cliente DE POR VIDA.
  if v_tier = 'founder' then
    select count(*) into v_used from public.desk_runs
      where user_id = p_user_id and funded_by = 'free' and created_at >= v_month_start;
  else
    select count(*) into v_used from public.desk_runs
      where user_id = p_user_id and funded_by = 'free';
  end if;

  if v_used < v_free_limit then
    insert into public.desk_runs(user_id, ticker, board, decision, period, funded_by)
      values (p_user_id, p_ticker, p_board, '{}'::jsonb, v_month, 'free') returning id into v_id;
    return v_id;
  end if;

  -- Agotado el free: consumir un crédito de pack vigente (FIFO por vencimiento).
  select id into v_credit_id from public.desk_credits
    where user_id = p_user_id and credits_used < credits_total and expires_at > now()
    order by expires_at asc limit 1 for update;
  if v_credit_id is null then return null; end if;
  update public.desk_credits set credits_used = credits_used + 1 where id = v_credit_id;
  insert into public.desk_runs(user_id, ticker, board, decision, period, funded_by, credit_id)
    values (p_user_id, p_ticker, p_board, '{}'::jsonb, v_month, 'pack', v_credit_id) returning id into v_id;
  return v_id;
end;
$function$;
