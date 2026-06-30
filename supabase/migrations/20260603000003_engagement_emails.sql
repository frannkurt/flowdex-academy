-- Migration: engagement_emails (junio 2026)
--
-- Registro de mails de re-enganche enviados, para no repetir ni mandar fuera
-- de secuencia. Dos tipos:
--   - 'inactive'      → alumno que entró pero hace ≥7 días no vuelve. Ciclo de
--                       4 pasos (semanal). Se reinicia si vuelve a quedar
--                       inactivo: la lógica cuenta solo los envíos posteriores
--                       a su última actividad (last_seen_at).
--   - 'never_entered' → registró cuenta y nunca entró. 2 pasos (día 3 y 10).
--   - 'community'     → tiene curso activo pero no entró a NINGUNA comunidad
--                       (ni Discord ni Telegram). 2 pasos cada 3 días.
--   - 'course_completed' → felicitación al completar el 100% de un curso.
--                       Una sola vez por usuario+curso (course_slug).
--
-- La tabla es append-only: una fila por mail efectivamente enviado.

create table if not exists public.engagement_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('inactive', 'never_entered', 'community', 'course_completed')),
  step int not null check (step >= 1),
  course_slug text,
  sent_at timestamptz not null default now()
);

-- Idempotencia del mail de curso completado: imposible duplicarlo aunque el
-- alumno desmarque y vuelva a marcar el último módulo.
create unique index if not exists engagement_emails_course_completed_unique
  on public.engagement_emails (user_id, kind, course_slug)
  where kind = 'course_completed';

create index if not exists engagement_emails_user_idx on public.engagement_emails (user_id);
create index if not exists engagement_emails_kind_idx on public.engagement_emails (kind);
create index if not exists engagement_emails_sent_at_idx on public.engagement_emails (sent_at desc);

-- Solo service-role escribe/lee (el cron y el botón de admin corren con
-- service-role). RLS habilitado sin policies = bloqueado para anon/authenticated.
alter table public.engagement_emails enable row level security;
