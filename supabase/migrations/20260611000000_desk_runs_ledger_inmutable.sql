-- Migration: ledger inmutable del cupo del Desk. (Aplicada a live 2026-06-11 vía MCP.)
--
-- El cupo gratis se calcula CONTANDO filas de desk_runs (funded_by='free') y los
-- packs se refundan por trigger ante cualquier DELETE. Borrar del historial hacía
-- DELETE real => el contador bajaba y el crédito volvía: cupo infinito.
--
-- Fix: (1) soft-delete (hidden_at) para "borrar del historial" — la fila queda y
-- el conteo de cupo no se mueve; (2) se quita la policy de DELETE del owner (solo
-- el service role borra); (3) el refund por trigger queda SOLO para placeholders
-- (decision='{}'), que es el cancel legítimo del backend cuando un análisis falla.

alter table public.desk_runs add column if not exists hidden_at timestamptz;

drop policy if exists "desk_runs: owner delete" on public.desk_runs;

create or replace function public.desk_refund_credit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Refund solo si el run era un placeholder (análisis fallido cancelado por el
  -- backend). Un run completado jamás devuelve el crédito al borrarse.
  if old.decision = '{}'::jsonb and old.funded_by = 'pack' and old.credit_id is not null then
    update public.desk_credits
      set credits_used = greatest(0, credits_used - 1)
      where id = old.credit_id;
  end if;
  return old;
end;
$$;
