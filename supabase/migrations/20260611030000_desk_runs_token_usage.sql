-- Uso de tokens por corrida del Desk. Calcado del patrón de tutor_usage:
-- input/output/cached + flag de cache hit. Permite el tab Consumo del /admin
-- (costo estimado, techo del free tier, consumo por usuario).
ALTER TABLE public.desk_runs
  ADD COLUMN IF NOT EXISTS gemini_calls  integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens_in     integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens_out    integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens_cached integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cache_hit     boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.desk_runs.gemini_calls  IS 'Cantidad de llamadas LLM en la corrida (0 si cache hit).';
COMMENT ON COLUMN public.desk_runs.tokens_in     IS 'Tokens de prompt sumados de todas las llamadas de la corrida.';
COMMENT ON COLUMN public.desk_runs.tokens_out    IS 'Tokens de respuesta sumados de todas las llamadas.';
COMMENT ON COLUMN public.desk_runs.tokens_cached IS 'Tokens servidos desde cache de contexto del proveedor.';
COMMENT ON COLUMN public.desk_runs.cache_hit     IS 'La corrida se sirvió del cache de análisis compartido (cero Gemini).';
