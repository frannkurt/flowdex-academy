-- Migration: orders table for unified checkout (Mercado Pago + NOWPayments)
-- Run this in Supabase SQL Editor (DO NOT run automatically)

create table if not exists public.orders (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  course_id          uuid        not null references public.courses(id) on delete restrict,
  amount_usd         numeric(12,2) not null,
  amount_ars         numeric(12,2),
  provider           text        not null check (provider in ('mercadopago','nowpayments')),
  provider_reference text,
  status             text        not null default 'pending'
                                 check (status in ('pending','paid','failed','expired')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- RLS
alter table public.orders enable row level security;

-- Users can only read their own orders
create policy "orders: users read own"
  on public.orders for select
  using (auth.uid() = user_id);

-- Service role has full access (handled via service-role client, RLS bypassed)

-- Indexes
create index if not exists orders_user_status_idx      on public.orders (user_id, status);
create index if not exists orders_provider_ref_idx     on public.orders (provider, provider_reference);
