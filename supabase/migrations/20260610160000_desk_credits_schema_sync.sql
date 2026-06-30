-- Migration (SYNC): esquema de la era "créditos" del Desk.
--
-- Estas estructuras se aplicaron a la DB live el 2026-06-10 vía MCP y nunca se
-- volcaron al repo (drift detectado en la auditoría del 2026-06-11). Este archivo
-- reconstruye el estado live para que el repo reproduzca el schema. Todo es
-- idempotente (if not exists / or replace): re-aplicarlo no rompe nada.
--
-- Modelo de cupo vigente:
--   trial (cliente)  -> 2 análisis gratis DE POR VIDA (one-time, no se renuevan)
--   founder          -> 2 gratis POR MES (se renuevan el 1°)
--   admin            -> cuenta interna, 20 análisis por DÍA (no usa packs)
--   packs (pagos)    -> desk_credits, consumo FIFO por vencimiento
-- El gate atómico vive en el RPC desk_consume_run (advisory lock por usuario).

-- ── Packs comprados: saldo de créditos con vencimiento ─────────────────────────
create table if not exists public.desk_credits (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  credits_total integer not null,
  credits_used  integer not null default 0,
  source        text,            -- ej. 'pack:inicial'
  order_ref     text,            -- id de desk_orders que lo acreditó
  granted_at    timestamptz default now(),
  expires_at    timestamptz not null
);

alter table public.desk_credits enable row level security;

drop policy if exists desk_credits_owner_read on public.desk_credits;
create policy desk_credits_owner_read on public.desk_credits
  for select using (auth.uid() = user_id);
-- Escribe SOLO el service role (bypassa RLS); el cliente nunca.

-- ── Órdenes de compra de packs (checkout) ──────────────────────────────────────
create table if not exists public.desk_orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  pack                  text not null,
  credits               integer not null,
  amount_usd            numeric(10,2) not null,
  provider              text,
  provider_order_id     text,
  status                text not null default 'pending',  -- pending | paid | failed
  credit_expires_months integer not null default 6,
  credit_id             uuid,
  created_at            timestamptz default now(),
  paid_at               timestamptz
);

alter table public.desk_orders enable row level security;

drop policy if exists desk_orders_owner_read on public.desk_orders;
create policy desk_orders_owner_read on public.desk_orders
  for select using (auth.uid() = user_id);

-- ── desk_runs: de dónde salió cada análisis ────────────────────────────────────
alter table public.desk_runs add column if not exists funded_by text not null default 'free';
  -- 'free' | 'pack' | 'internal'
alter table public.desk_runs add column if not exists credit_id uuid;

-- ── RPC de consumo atómico (versión vigente) ───────────────────────────────────
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
  v_tier        text;
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

  select tier into v_tier from public.desk_entitlements where user_id = p_user_id;
  if v_tier is null then
    insert into public.desk_entitlements(user_id, tier) values (p_user_id, 'trial')
      on conflict (user_id) do nothing;
    v_tier := 'trial';
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

  -- Free = 2. Founder cuenta por MES (se renueva); cliente cuenta DE POR VIDA (one-time).
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
$$;

revoke all on function public.desk_consume_run(uuid, text, text) from public, anon, authenticated;
grant execute on function public.desk_consume_run(uuid, text, text) to service_role;

-- ── Trigger de refund al borrar un run ─────────────────────────────────────────
-- (La versión original refundaba ante CUALQUIER delete; la migración siguiente
-- la restringe a placeholders. Acá va la función por completitud histórica.)
create or replace function public.desk_refund_credit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.funded_by = 'pack' and old.credit_id is not null then
    update public.desk_credits
      set credits_used = greatest(0, credits_used - 1)
      where id = old.credit_id;
  end if;
  return old;
end;
$$;

drop trigger if exists desk_runs_refund_credit on public.desk_runs;
create trigger desk_runs_refund_credit
  after delete on public.desk_runs
  for each row execute function public.desk_refund_credit();
