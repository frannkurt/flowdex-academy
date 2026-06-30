-- Migration: cupo atómico del Desk (anti-race).
--
-- Reemplaza el patrón "chequear cupo (read) y después insertar (write)" — que tiene
-- una race: varios análisis simultáneos del mismo usuario pasan el chequeo antes de
-- que se registre el primero y se exceden el tope (sobrecosto en Gemini, que es pago).
--
-- `desk_consume_run` cuenta e inserta en UNA transacción, serializada por usuario con
-- un advisory lock → imposible exceder el tope aunque dispare N análisis a la vez.
-- Inserta un placeholder (decision '{}') que el backend completa al terminar bien, o
-- borra si el análisis falla. Solo lo puede llamar el service role (el backend).

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
  v_period text := to_char((now() at time zone 'utc'), 'YYYY-MM');
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
  v_limit := case v_tier when 'founder' then 10 else 5 end;

  select count(*) into v_used
    from public.desk_runs
    where user_id = p_user_id and period = v_period;

  if v_used >= v_limit then
    return null;  -- cupo del mes agotado
  end if;

  insert into public.desk_runs(user_id, ticker, board, decision, period)
    values (p_user_id, p_ticker, p_board, '{}'::jsonb, v_period)
    returning id into v_id;
  return v_id;
end;
$$;

-- Solo el backend (service role) puede consumir cupo; nunca el cliente.
revoke all on function public.desk_consume_run(uuid, text, text) from public, anon, authenticated;
grant execute on function public.desk_consume_run(uuid, text, text) to service_role;
