-- Migration: journal_entries table for the trader Journal (V1)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Modelo: una entrada por usuario por dia (upsert via unique constraint).
-- pnl_usd permite negativos. trades_count >= 0. notes opcional.
-- La fecha se guarda como `date` (sin timezone): el cliente envia la fecha
-- local del usuario en formato YYYY-MM-DD para evitar el lio de TZs en V1.

create table if not exists public.journal_entries (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  entry_date    date        not null,
  pnl_usd       numeric(14,2) not null default 0,
  trades_count  integer     not null default 0 check (trades_count >= 0),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, entry_date)
);

-- Auto-update updated_at (reusa la funcion creada en la migration de orders)
drop trigger if exists journal_entries_set_updated_at on public.journal_entries;
create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.set_updated_at();

-- RLS
alter table public.journal_entries enable row level security;

-- Usuario lee sus propias entradas
drop policy if exists "journal_entries: users read own" on public.journal_entries;
create policy "journal_entries: users read own"
  on public.journal_entries for select
  to authenticated
  using (auth.uid() = user_id);

-- Usuario inserta sus propias entradas
drop policy if exists "journal_entries: users insert own" on public.journal_entries;
create policy "journal_entries: users insert own"
  on public.journal_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Usuario actualiza sus propias entradas
drop policy if exists "journal_entries: users update own" on public.journal_entries;
create policy "journal_entries: users update own"
  on public.journal_entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Usuario borra sus propias entradas
drop policy if exists "journal_entries: users delete own" on public.journal_entries;
create policy "journal_entries: users delete own"
  on public.journal_entries for delete
  to authenticated
  using (auth.uid() = user_id);

-- Service role bypassa RLS naturalmente, pero dejamos policy explicita por consistencia
drop policy if exists "journal_entries: service role full" on public.journal_entries;
create policy "journal_entries: service role full"
  on public.journal_entries for all
  to service_role
  using (true)
  with check (true);

-- Indices
create index if not exists journal_entries_user_date_idx
  on public.journal_entries (user_id, entry_date desc);
