-- Migration: agregar phone a profiles (junio 2026)
--
-- El teléfono se captura en el checkout (obligatorio) para poder contactar
-- o asistir al alumno cuando haga falta. Un teléfono por usuario, persistente.
-- No es sensible a la orden, por eso vive en profiles y no en orders.

alter table public.profiles
  add column if not exists phone text;
