// Helper para revocar el acceso de Telegram de un usuario en una comunidad puntual.
// Lo usamos desde el cron de expiración (revoke-expired-access).

import type { SupabaseClient } from "@supabase/supabase-js"
import { kickFromChat } from "./api"
import { TelegramCommunity } from "./config"

export type RevokeTelegramResult =
  | { kicked: true; community: TelegramCommunity; telegramUserId: number }
  | { kicked: false; reason: string }

/**
 * Saca al usuario del grupo de Telegram correspondiente a `community` si tiene
 * una membership activa (ya entró via invite y aún no fue kickeado).
 *
 * Es idempotente: si no hay membership o ya fue kickeado, no hace nada.
 */
export async function revokeTelegramMembership({
  admin,
  userId,
  community,
}: {
  admin: SupabaseClient
  userId: string
  community: TelegramCommunity
}): Promise<RevokeTelegramResult> {
  const { data: membership, error: lookupErr } = await admin
    .from("telegram_memberships")
    .select("id, telegram_user_id, chat_id, kicked_at")
    .eq("user_id", userId)
    .eq("community", community)
    .maybeSingle()

  if (lookupErr) {
    return { kicked: false, reason: `lookup error: ${lookupErr.message}` }
  }

  if (!membership) {
    return { kicked: false, reason: "no membership row" }
  }

  if (!membership.telegram_user_id) {
    return { kicked: false, reason: "user nunca entró al grupo (telegram_user_id NULL)" }
  }

  if (membership.kicked_at) {
    return { kicked: false, reason: "ya fue kickeado previamente" }
  }

  try {
    await kickFromChat({
      chatId: membership.chat_id,
      telegramUserId: membership.telegram_user_id,
    })

    await admin
      .from("telegram_memberships")
      .update({
        kicked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", membership.id)

    return {
      kicked: true,
      community,
      telegramUserId: membership.telegram_user_id,
    }
  } catch (err) {
    console.error("[telegram-revoke] error kickeando", {
      userId,
      community,
      telegramUserId: membership.telegram_user_id,
      err: err instanceof Error ? err.message : String(err),
    })
    return {
      kicked: false,
      reason: err instanceof Error ? err.message : "kick error",
    }
  }
}
