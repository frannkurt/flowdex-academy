-- Migration: SKUs de pase del Radar en el checkout del Desk. (Aplicada a live
-- 2026-06-11 vía MCP.) La orden lleva cuántos días de Radar acredita (0 = pack
-- de créditos puro). El fulfill extiende desk_entitlements.radar_until.
alter table public.desk_orders add column if not exists radar_days integer not null default 0;
