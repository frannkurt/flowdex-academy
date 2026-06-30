// Helper para revocar el rol de Discord de un usuario para un curso puntual.
// Lo usamos desde el cron de expiración (revoke-expired-access).

import type { SupabaseClient } from "@supabase/supabase-js"
import { removeRole } from "./api"

export type RevokeDiscordResult =
  | { revoked: true; roleId: string; discordUserId: string }
  | { revoked: false; reason: string }

/**
 * Quita el rol de Discord asociado a un curso si existe un grant activo y el
 * usuario tiene su cuenta de Discord conectada.
 *
 * Es idempotente: si no hay grant activo o no hay conexión Discord, no hace nada.
 */
export async function revokeDiscordRoleForCourse({
  admin,
  userId,
  courseSlug,
}: {
  admin: SupabaseClient
  userId: string
  courseSlug: string
}): Promise<RevokeDiscordResult> {
  // 1) Buscar el grant activo
  const { data: grant, error: grantErr } = await admin
    .from("discord_role_grants")
    .select("id, role_id, revoked_at")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .is("revoked_at", null)
    .maybeSingle()

  if (grantErr) {
    return { revoked: false, reason: `grant lookup error: ${grantErr.message}` }
  }

  if (!grant) {
    return { revoked: false, reason: "no hay grant activo de Discord" }
  }

  // 2) Buscar la conexión de Discord del usuario
  const { data: connection, error: connErr } = await admin
    .from("discord_connections")
    .select("discord_user_id")
    .eq("user_id", userId)
    .maybeSingle()

  if (connErr) {
    return { revoked: false, reason: `connection lookup error: ${connErr.message}` }
  }

  if (!connection?.discord_user_id) {
    // Marcamos el grant como revoked igual para no dejarlo en estado raro
    await admin
      .from("discord_role_grants")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", grant.id)
    return { revoked: false, reason: "user no tiene cuenta Discord conectada" }
  }

  // 3) Llamar a Discord API para quitar el rol
  try {
    await removeRole({
      discordUserId: connection.discord_user_id,
      roleId: grant.role_id,
    })

    await admin
      .from("discord_role_grants")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", grant.id)

    return {
      revoked: true,
      roleId: grant.role_id,
      discordUserId: connection.discord_user_id,
    }
  } catch (err) {
    console.error("[discord-revoke] error quitando rol", {
      userId,
      courseSlug,
      roleId: grant.role_id,
      err: err instanceof Error ? err.message : String(err),
    })
    return {
      revoked: false,
      reason: err instanceof Error ? err.message : "remove role error",
    }
  }
}
