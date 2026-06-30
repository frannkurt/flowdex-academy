-- Migration: fix engagement_emails para course_completed (junio 2026)
--
-- La tabla engagement_emails se creó en producción con una versión previa de
-- 20260603000003 que NO incluía `course_slug` ni 'course_completed' en el check
-- de kind. Como esa migración usa `create table if not exists`, las ediciones
-- posteriores al archivo nunca se aplicaron a la DB ya existente. Resultado: el
-- mail de felicitación al completar un curso nunca se disparó — el check de
-- idempotencia en /api/progress tiraba error de columna inexistente y, por
-- diseño fail-safe (`if (!checkError && !already)`), abortaba el envío.
--
-- Este fix es idempotente y additive.

-- 1) Columna course_slug (registro de idempotencia por usuario+curso).
alter table public.engagement_emails
  add column if not exists course_slug text;

-- 2) Permitir kind = 'course_completed'.
alter table public.engagement_emails
  drop constraint if exists engagement_emails_kind_check;
alter table public.engagement_emails
  add constraint engagement_emails_kind_check
  check (kind in ('inactive', 'never_entered', 'community', 'course_completed'));

-- 3) Idempotencia del mail de curso completado: una sola vez por usuario+curso.
create unique index if not exists engagement_emails_course_completed_unique
  on public.engagement_emails (user_id, kind, course_slug)
  where kind = 'course_completed';
