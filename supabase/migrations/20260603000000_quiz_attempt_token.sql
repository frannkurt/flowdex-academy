-- Migration: token de idempotencia para intentos de examen (junio 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Contexto: el cliente genera un token único por intento de examen y lo manda
-- en el submit. Si el envío llega dos veces con el mismo token (por un corte de
-- red y el reintento del cliente), el server devuelve el resultado ya guardado
-- en vez de crear un intento duplicado / chocar con el cooldown. Eso requiere
-- una columna donde guardar ese token, con unicidad.
--
-- La columna es nullable: los intentos viejos quedan con NULL. El índice único
-- es parcial (solo sobre valores no nulos) para no romper esas filas.
--
-- IMPORTANTE: correr ESTE SQL antes de desplegar el código que usa el token,
-- porque el insert de /api/exams/submit ya incluye la columna attempt_token.

alter table public.user_quiz_attempts
  add column if not exists attempt_token text;

create unique index if not exists user_quiz_attempts_attempt_token_key
  on public.user_quiz_attempts (attempt_token)
  where attempt_token is not null;
