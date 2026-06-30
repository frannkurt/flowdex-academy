-- Migration: agregar policy de admin a public.orders (mayo 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Contexto: la migración original de orders (20260504000000_orders.sql) solo
-- incluyó la policy "orders: users read own" que filtra cada usuario a sus
-- propias órdenes. Esto causó que en el panel /admin tab Órdenes el admin
-- viera SOLO sus propias órdenes, porque el query corre con su sesión y RLS
-- aplica el filtro.
--
-- Las demás tablas (profiles, user_courses, course_progress, promo_codes,
-- class_bookings) ya tenían su "Admins can read all" policy. A orders se le
-- pasó por alto. Esta migración cierra ese gap.

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders"
  on public.orders
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Service role ya bypassa RLS por default, no necesitamos policy explícita
-- para él. Pero la dejamos por consistencia con las otras tablas.
drop policy if exists "Service role can manage orders" on public.orders;
create policy "Service role can manage orders"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);
