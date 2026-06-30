-- Origen de la cuenta: discriminar quién entró por el Desk vs por la Academy.
-- El registro del Desk ya marca 'flowdex_desk' en raw_user_meta_data; lo
-- llevamos a profiles para que sea consultable (admin, métricas, segmentación).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_source text;

-- Backfill de las cuentas existentes desde la metadata real de auth.users.
UPDATE public.profiles p
SET signup_source = CASE
  WHEN (u.raw_user_meta_data ->> 'signup_source') ILIKE '%desk%' THEN 'desk'
  ELSE 'academy'
END
FROM auth.users u
WHERE u.id = p.id AND p.signup_source IS NULL;

-- Trigger: setear el origen al CREAR el perfil. En updates (on conflict) NO se
-- pisa, para que el origen quede fijo de por vida.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, full_name, signup_source)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when (new.raw_user_meta_data ->> 'signup_source') ilike '%desk%'
         then 'desk' else 'academy' end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case
      when excluded.full_name is null or excluded.full_name = '' then public.profiles.full_name
      else excluded.full_name
    end;

  return new;
end;
$function$;

COMMENT ON COLUMN public.profiles.signup_source IS 'Origen de la cuenta al crearse: ''desk'' (entró por Flowdex Desk) o ''academy'' (sitio principal). Fijo de por vida.';
