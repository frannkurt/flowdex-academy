-- Canonical policy for course access durations.
--
-- Goals:
-- 1) Keep duration rules versioned in migrations (single source of truth in DB)
-- 2) Auto-fill expires_at on INSERT when it is omitted
-- 3) Backfill legacy rows that still have expires_at = NULL
--
-- Rules:
-- - membresia: 30 days
-- - inner-circle: 12 months
-- - kickstart-investment / expert-investment / kickstart-trading / trading-lab: 4 months
-- - fallback (other courses): 3 months

CREATE OR REPLACE FUNCTION public.compute_course_expiry_by_slug(
  base_ts timestamptz,
  course_slug text
)
RETURNS timestamptz
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF course_slug = 'membresia' THEN
    RETURN base_ts + interval '30 days';
  ELSIF course_slug = 'inner-circle' THEN
    RETURN base_ts + interval '12 months';
  ELSIF course_slug IN (
    'kickstart-investment',
    'expert-investment',
    'kickstart-trading',
    'trading-lab'
  ) THEN
    RETURN base_ts + interval '4 months';
  END IF;

  RETURN base_ts + interval '3 months';
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_course_default_expiry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug text;
BEGIN
  IF NEW.expires_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT slug
    INTO v_slug
  FROM public.courses
  WHERE id = NEW.course_id
  LIMIT 1;

  -- If course is missing, keep current behavior and let the FK/checks fail upstream.
  IF v_slug IS NULL THEN
    RETURN NEW;
  END IF;

  NEW.expires_at := public.compute_course_expiry_by_slug(
    COALESCE(NEW.granted_at, now()),
    v_slug
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_user_course_default_expiry ON public.user_courses;

CREATE TRIGGER trg_set_user_course_default_expiry
BEFORE INSERT ON public.user_courses
FOR EACH ROW
EXECUTE FUNCTION public.set_user_course_default_expiry();

-- Backfill only rows that still have expires_at = NULL.
UPDATE public.user_courses uc
SET expires_at = public.compute_course_expiry_by_slug(
  uc.granted_at,
  c.slug
)
FROM public.courses c
WHERE c.id = uc.course_id
  AND uc.expires_at IS NULL;
