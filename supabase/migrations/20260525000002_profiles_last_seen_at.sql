-- Migration: agregar last_seen_at a profiles (mayo 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Contexto: auth.users.last_sign_in_at solo se actualiza cuando el usuario
-- hace login explícito (tipea password o pasa por Google OAuth). Si tiene
-- sesión persistente, puede entrar al sitio todos los días sin actualizar
-- ese campo. Eso falsea la detección de abandono en el panel admin.
--
-- last_seen_at se actualiza en proxy.ts en cada request a ruta web del
-- usuario autenticado (con throttle de 5min para no saturar la DB). Es la
-- "última vez que el alumno realmente entró", que es lo que importa para
-- engagement/retención.
--
-- Backfill: se inicializa con auth.users.last_sign_in_at para tener algún
-- valor histórico en lugar de NULL en todos. A partir del primer request
-- post-deploy, se va a ir actualizando con el dato real.

alter table public.profiles
  add column if not exists last_seen_at timestamptz;

-- Índice descendente para queries de "ordenar por más reciente" en el
-- panel admin (RegisteredUsersPanel sort, y MetricsPanel alumnos en riesgo).
create index if not exists profiles_last_seen_at_idx
  on public.profiles (last_seen_at desc nulls last);

-- Backfill desde auth.users.last_sign_in_at. Solo para los que ya tenían
-- login previo; los que nunca se loguearon quedan en NULL (que el panel
-- interpreta como "nunca entró").
update public.profiles p
set last_seen_at = u.last_sign_in_at
from auth.users u
where p.id = u.id
  and p.last_seen_at is null
  and u.last_sign_in_at is not null;

-- Función RPC throttle-safe para que el proxy.ts pueda actualizar
-- last_seen_at sin necesidad de policy de UPDATE para "users own profile"
-- (esa policy abriría la puerta a que el user cambie su role/email/etc).
-- La función corre con security definer (bypassa RLS) pero solo modifica
-- la fila del auth.uid() actual y solo si pasaron 6+ horas — el user NO
-- puede usarla para tocar otras filas ni para cambiar otros campos.
--
-- Throttle de 6 horas: máximo 4 updates por usuario activo por día, lo que
-- garantiza que cada vez que alguien entra "hoy" eso se refleja en el panel
-- (cualquier ventana del día cae en una ranura distinta). Más espaciado que
-- esto introduce un edge case donde dos visitas en el mismo día pueden no
-- actualizar el campo y el panel subestima la actividad por un día.
create or replace function public.touch_last_seen()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set last_seen_at = now()
  where id = auth.uid()
    and (last_seen_at is null or last_seen_at < now() - interval '6 hours');
end;
$$;

grant execute on function public.touch_last_seen() to authenticated;
