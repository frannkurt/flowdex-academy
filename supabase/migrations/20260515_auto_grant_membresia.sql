-- Auto-grant del primer mes de membresía cuando se activa inner-circle.
--
-- Modelo:
--   - inner-circle (curso, 12 meses): da acceso al contenido pedagógico
--   - membresia (suscripción, 30 días, $50): da acceso a Discord + Telegram
--
-- Cuando un alumno paga inner-circle, recibe automáticamente 1 mes gratis de
-- membresía. El trigger maneja también el caso "acumular": si ya tenía membresía
-- activa, los nuevos 30 días se suman; si estaba vencida, arranca ciclo nuevo
-- desde ahora.

CREATE OR REPLACE FUNCTION public.auto_grant_membresia_with_inner_circle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inner_circle_id uuid;
  v_membresia_id uuid;
  v_existing_expires_at timestamptz;
  v_new_expires_at timestamptz;
BEGIN
  -- Solo procesamos cuando is_active queda en true
  IF NEW.is_active IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- Resolvemos el course_id de inner-circle
  SELECT id INTO v_inner_circle_id
  FROM public.courses
  WHERE slug = 'inner-circle'
  LIMIT 1;

  IF v_inner_circle_id IS NULL OR NEW.course_id != v_inner_circle_id THEN
    -- No es el curso inner-circle, no hacemos nada
    RETURN NEW;
  END IF;

  -- Resolvemos el course_id de membresía
  SELECT id INTO v_membresia_id
  FROM public.courses
  WHERE slug = 'membresia'
  LIMIT 1;

  IF v_membresia_id IS NULL THEN
    -- Si no existe el curso "membresia" en el catálogo, no podemos crear el grant.
    -- Logueamos warning y seguimos sin romper la operación de inner-circle.
    RAISE WARNING 'auto_grant_membresia: curso "membresia" no existe en courses, salteando auto-grant para user %', NEW.user_id;
    RETURN NEW;
  END IF;

  -- Buscamos si el usuario ya tiene una membresía registrada
  SELECT expires_at INTO v_existing_expires_at
  FROM public.user_courses
  WHERE user_id = NEW.user_id AND course_id = v_membresia_id
  LIMIT 1;

  -- Calcular nuevo expires_at:
  --   - Si tiene membresía activa (expires_at > now): acumular (existing + 30 días)
  --   - Si tiene membresía vencida o no tiene: nuevo ciclo (now + 30 días)
  v_new_expires_at := GREATEST(COALESCE(v_existing_expires_at, now()), now()) + interval '30 days';

  -- Upsert de la membresía
  INSERT INTO public.user_courses (user_id, course_id, granted_at, expires_at, is_active)
  VALUES (NEW.user_id, v_membresia_id, now(), v_new_expires_at, true)
  ON CONFLICT (user_id, course_id) DO UPDATE
  SET
    expires_at = v_new_expires_at,
    is_active = true,
    granted_at = COALESCE(public.user_courses.granted_at, now());

  RAISE NOTICE 'auto_grant_membresia: extendida hasta % para user %', v_new_expires_at, NEW.user_id;
  RETURN NEW;
END;
$$;

-- Drop existing trigger si lo había de una migración previa (idempotencia)
DROP TRIGGER IF EXISTS trg_auto_grant_membresia ON public.user_courses;

-- Trigger se dispara después de INSERT o UPDATE de is_active a true
CREATE TRIGGER trg_auto_grant_membresia
AFTER INSERT OR UPDATE OF is_active ON public.user_courses
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.auto_grant_membresia_with_inner_circle();

-- Comentario para que quede claro en pg dump / pg_dump
COMMENT ON FUNCTION public.auto_grant_membresia_with_inner_circle IS
  'Cuando se activa inner-circle para un usuario, crea/extiende automáticamente su membresía por 30 días.';
