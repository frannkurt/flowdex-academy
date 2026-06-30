-- Tabla de auditoría del Tutor IA.
-- Se escribe con service role (server-side, route /api/tutor).
-- RLS: nadie puede leerla desde el cliente. Solo admin desde SQL.

create table if not exists public.tutor_usage (
  id            bigserial primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_slug   text not null,
  prompt_chars  integer not null default 0,
  reply_chars   integer not null default 0,
  tokens_input  integer,
  tokens_output integer,
  tokens_cached integer,
  cache_hit     boolean not null default false,
  blocked       boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists tutor_usage_user_id_idx     on public.tutor_usage(user_id);
create index if not exists tutor_usage_course_slug_idx on public.tutor_usage(course_slug);
create index if not exists tutor_usage_created_at_idx  on public.tutor_usage(created_at desc);

alter table public.tutor_usage enable row level security;

-- Sin policies => nadie puede leer/escribir desde el cliente.
-- El servidor escribe con SUPABASE_SERVICE_ROLE_KEY que bypasea RLS.

-- Consultas útiles (para correr manualmente desde Supabase SQL Editor):

-- Top users del día:
-- select user_id, count(*) as msgs, sum(tokens_input) as in_tokens, sum(tokens_output) as out_tokens
-- from public.tutor_usage
-- where created_at >= now() - interval '1 day'
-- group by user_id
-- order by msgs desc
-- limit 20;

-- Costo estimado del día (Gemini 2.5 Flash paid: $0.30/$2.50 por 1M tokens, cached: $0.075):
-- select
--   sum(coalesce(tokens_input, 0) - coalesce(tokens_cached, 0)) / 1e6 * 0.30
--   + sum(coalesce(tokens_cached, 0)) / 1e6 * 0.075
--   + sum(coalesce(tokens_output, 0)) / 1e6 * 2.50 as usd_estimate
-- from public.tutor_usage
-- where created_at >= now() - interval '1 day';

-- Jailbreaks detectados:
-- select user_id, count(*) as attempts
-- from public.tutor_usage
-- where blocked = true and created_at >= now() - interval '7 days'
-- group by user_id
-- order by attempts desc;
