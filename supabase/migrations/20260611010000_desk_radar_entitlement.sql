-- Migration: gating del Radar de Dividendos (pase por tiempo, BACKLOG item 10).
-- (Aplicada a live 2026-06-11 vía MCP.)
--
-- radar_until null = sin acceso. Acceso vigente = radar_until > now().
-- El tier admin ve el Radar siempre (cuenta interna), sin tocar esta columna.
-- No interactúa con el cupo de créditos: es un entitlement aparte. El SKU de
-- pase (30d/90d/1año) lo acreditará el checkout seteando/extendiendo radar_until.
alter table public.desk_entitlements add column if not exists radar_until timestamptz;
