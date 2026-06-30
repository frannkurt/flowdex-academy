-- Migration: class_bookings table for Cal.com webhook ingestion (mayo 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Modelo: persistir reservas de Cal.com como métrica global de engagement.
-- Cal.com manda webhook BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
-- al endpoint /api/webhooks/calcom. NO se asocia a curso específico (Cal no
-- distingue por curso; una sesión de mentoría puede cubrir cualquier tema).
-- Sirve para: contar reservas próximas, clases dadas en el mes, tendencia
-- de uso del servicio de mentoría como señal de salud del producto.
--
-- booking_id es UNIQUE y viene de Cal.com (campo `uid` o `id` del payload).
-- Sobre reschedule, Cal manda el mismo booking_id con datos actualizados.
-- Sobre cancel, idem pero status cambia a "cancelled". Por eso upsert por
-- booking_id en el endpoint.
--
-- user_email NO se cruza con auth.users por foreign key (un cliente puede
-- agendar con un email distinto al de su cuenta Flowdex, o no tener cuenta).
-- Si querés mapear a auth.users, hacelo a nivel query con join condicional.

create table if not exists public.class_bookings (
  id            uuid          primary key default gen_random_uuid(),
  booking_id    text          not null unique,
  user_email    text,
  user_name     text,
  event_type    text,
  start_at      timestamptz,
  end_at        timestamptz,
  status        text          not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'rescheduled', 'rejected', 'pending')),
  -- Guardamos el payload crudo por si necesitamos backfill o debug. JSON
  -- pesa poco y nos da margen para sumar campos sin migración futura.
  payload       jsonb,
  created_at    timestamptz   not null default now(),
  updated_at    timestamptz   not null default now()
);

create index if not exists class_bookings_start_at_idx on public.class_bookings (start_at desc);
create index if not exists class_bookings_status_idx on public.class_bookings (status);
create index if not exists class_bookings_user_email_idx on public.class_bookings (lower(user_email));

-- Trigger para mantener updated_at en sync.
create or replace function public.touch_class_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_class_bookings_updated_at on public.class_bookings;
create trigger trg_class_bookings_updated_at
before update on public.class_bookings
for each row
execute function public.touch_class_bookings_updated_at();

-- RLS: solo admins leen, solo service_role escribe (el webhook usa service).
alter table public.class_bookings enable row level security;

drop policy if exists "Admins can read class bookings" on public.class_bookings;
create policy "Admins can read class bookings"
on public.class_bookings
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage class bookings" on public.class_bookings;
create policy "Service role can manage class bookings"
on public.class_bookings
for all
to service_role
using (true)
with check (true);
