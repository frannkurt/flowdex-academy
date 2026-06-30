-- Migration: Flowdex Desk — entitlements (tier) + runs (historial / cupo mensual).
--
-- Aditiva: no toca ninguna tabla existente. Las escribe el backend de Cloud Run con
-- SUPABASE_SERVICE_ROLE_KEY (bypassa RLS). Desde el cliente, el usuario solo puede
-- leer/borrar lo suyo; nunca escribir (el insert del run lo hace el service role al
-- terminar bien un análisis, que es lo que descuenta cupo).
--
-- Cupo mensual: used = count(desk_runs where user_id = ? and period = YYYY-MM actual).
-- limit = 5 (trial) | 10 (founder). Se resetea solo al cambiar de mes (sin job);
-- resets_at = primer día del mes próximo.

-- ---- desk_entitlements: tier por usuario (default 'trial' al primer uso) ----
create table if not exists public.desk_entitlements (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  tier        text        not null default 'trial' check (tier in ('trial', 'founder')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Reusa la función set_updated_at() de la migración de orders.
drop trigger if exists desk_entitlements_set_updated_at on public.desk_entitlements;
create trigger desk_entitlements_set_updated_at
  before update on public.desk_entitlements
  for each row execute function public.set_updated_at();

alter table public.desk_entitlements enable row level security;

drop policy if exists "desk_entitlements: owner read" on public.desk_entitlements;
create policy "desk_entitlements: owner read"
  on public.desk_entitlements for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "desk_entitlements: service role full" on public.desk_entitlements;
create policy "desk_entitlements: service role full"
  on public.desk_entitlements for all
  to service_role
  using (true) with check (true);

-- ---- desk_runs: un análisis por fila (la Lectura Flowdex completa en jsonb) ----
create table if not exists public.desk_runs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  ticker      text        not null,
  board       text,
  decision    jsonb       not null default '{}'::jsonb,  -- Lectura Flowdex completa (para reabrir)
  period      text        not null,                       -- 'YYYY-MM' para contar el mes
  created_at  timestamptz not null default now()
);

create index if not exists desk_runs_user_period_idx  on public.desk_runs (user_id, period);
create index if not exists desk_runs_user_created_idx on public.desk_runs (user_id, created_at desc);

alter table public.desk_runs enable row level security;

drop policy if exists "desk_runs: owner read" on public.desk_runs;
create policy "desk_runs: owner read"
  on public.desk_runs for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "desk_runs: owner delete" on public.desk_runs;
create policy "desk_runs: owner delete"
  on public.desk_runs for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "desk_runs: service role full" on public.desk_runs;
create policy "desk_runs: service role full"
  on public.desk_runs for all
  to service_role
  using (true) with check (true);
