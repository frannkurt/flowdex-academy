-- Migration: aceptación del manifiesto del Inner Circle en base (junio 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Contexto: la aceptación del compromiso del IC ("Módulo 00 · Manifiesto")
-- vivía solo en localStorage: se podía saltear, no seguía entre dispositivos y
-- no dejaba registro. La movemos a la base, asociada al usuario, con RLS para
-- que cada uno solo vea/cree su propia fila. accepted_at queda como registro
-- del momento del compromiso.

create table if not exists public.inner_circle_manifesto (
  user_id uuid primary key references auth.users (id) on delete cascade,
  accepted_at timestamptz not null default now()
);

alter table public.inner_circle_manifesto enable row level security;

drop policy if exists "inner_circle_manifesto_select_own" on public.inner_circle_manifesto;
create policy "inner_circle_manifesto_select_own"
  on public.inner_circle_manifesto
  for select
  using (auth.uid() = user_id);

drop policy if exists "inner_circle_manifesto_insert_own" on public.inner_circle_manifesto;
create policy "inner_circle_manifesto_insert_own"
  on public.inner_circle_manifesto
  for insert
  with check (auth.uid() = user_id);
