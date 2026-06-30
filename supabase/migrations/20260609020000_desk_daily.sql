-- Migration: cupo DIARIO + tier admin.
--
-- Antes el cupo era mensual (period 'YYYY-MM') con límites founder=10 / trial=5.
-- Ahora es diario (period 'YYYY-MM-DD') con tres tiers:
--   trial (free) = 3/día · founder = 5/día · admin = 20/día.
-- Reemplaza la función de reserva atómica manteniendo el advisory lock por usuario.

create or replace function public.desk_consume_run(
  p_user_id uuid,
  p_ticker  text default '',
  p_board   text default ''
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier   text;
  v_limit  int;
  v_period text := to_char((now() at time zone 'utc'), 'YYYY-MM-DD');  -- diario
  v_used   int;
  v_id     uuid;
begin
  -- Serializa el consumo POR USUARIO (no bloquea a otros) para evitar la race.
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select tier into v_tier from public.desk_entitlements where user_id = p_user_id;
  if v_tier is null then
    insert into public.desk_entitlements(user_id, tier)
      values (p_user_id, 'trial')
      on conflict (user_id) do nothing;
    v_tier := 'trial';
  end if;
  v_limit := case v_tier when 'admin' then 20 when 'founder' then 5 else 3 end;

  select count(*) into v_used
    from public.desk_runs
    where user_id = p_user_id and period = v_period;

  if v_used >= v_limit then
    return null;  -- cupo del día agotado
  end if;

  insert into public.desk_runs(user_id, ticker, board, decision, period)
    values (p_user_id, p_ticker, p_board, '{}'::jsonb, v_period)
    returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.desk_consume_run(uuid, text, text) from public, anon, authenticated;
grant execute on function public.desk_consume_run(uuid, text, text) to service_role;
