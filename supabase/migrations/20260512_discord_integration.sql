-- Discord integration tables
-- Migration: discord connections + role grants

-- Tabla: vincula un user de Flowdex con su cuenta de Discord
CREATE TABLE IF NOT EXISTS public.discord_connections (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_user_id text NOT NULL,
  discord_username text,
  discord_global_name text,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS discord_connections_discord_user_id_idx
  ON public.discord_connections(discord_user_id);

-- Tabla: registra qué roles de Discord se le asignaron a qué usuarios, por curso
CREATE TABLE IF NOT EXISTS public.discord_role_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  role_id text NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE(user_id, course_slug)
);

CREATE INDEX IF NOT EXISTS discord_role_grants_user_id_idx
  ON public.discord_role_grants(user_id);

CREATE INDEX IF NOT EXISTS discord_role_grants_role_id_idx
  ON public.discord_role_grants(role_id);

-- RLS: solo el dueño puede leer sus propias conexiones/grants
ALTER TABLE public.discord_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_role_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_discord_connection" ON public.discord_connections;
CREATE POLICY "users_read_own_discord_connection"
  ON public.discord_connections
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_read_own_discord_grants" ON public.discord_role_grants;
CREATE POLICY "users_read_own_discord_grants"
  ON public.discord_role_grants
  FOR SELECT
  USING (auth.uid() = user_id);

-- Las inserts/updates las hace el service role (server side desde Next.js),
-- así que no necesitamos políticas de insert/update para el cliente.
