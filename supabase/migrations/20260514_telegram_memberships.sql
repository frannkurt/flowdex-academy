-- Telegram membership tracking
-- Vincula un usuario de Flowdex con su cuenta de Telegram una vez que entra a un grupo
-- via invite link generado por nosotros. Permite kickearlo después cuando expira el acceso.

CREATE TABLE IF NOT EXISTS public.telegram_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community text NOT NULL,             -- 'inner-circle' | 'trading' | 'investment'
  chat_id text NOT NULL,
  invite_name text,                     -- nombre con el que se generó el invite (ej. flowdex-abc12345-inner-circle)
  telegram_user_id bigint,              -- se llena cuando el usuario acepta el invite (via webhook)
  joined_at timestamptz,                -- idem
  kicked_at timestamptz,                -- se llena cuando se le revoca el acceso
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, community)
);

CREATE INDEX IF NOT EXISTS telegram_memberships_user_id_idx
  ON public.telegram_memberships(user_id);

CREATE INDEX IF NOT EXISTS telegram_memberships_telegram_user_id_idx
  ON public.telegram_memberships(telegram_user_id)
  WHERE telegram_user_id IS NOT NULL;

-- Búsqueda rápida por invite_name (lo que hace el webhook)
CREATE UNIQUE INDEX IF NOT EXISTS telegram_memberships_invite_name_unique
  ON public.telegram_memberships(invite_name)
  WHERE invite_name IS NOT NULL;

ALTER TABLE public.telegram_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_telegram_membership" ON public.telegram_memberships;
CREATE POLICY "users_read_own_telegram_membership"
  ON public.telegram_memberships
  FOR SELECT
  USING (auth.uid() = user_id);
