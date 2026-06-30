-- Migration: sumar 'paypal' como provider válido en orders
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- El check original (20260504000000_orders.sql) solo permitía
-- ('mercadopago','nowpayments'). Sumamos PayPal como tercer canal de pago.

alter table public.orders
  drop constraint if exists orders_provider_check;

alter table public.orders
  add constraint orders_provider_check
  check (provider in ('mercadopago','nowpayments','paypal'));
