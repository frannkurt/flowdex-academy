// Helpers para interactuar con la Discord REST API.
// Las llamadas se hacen desde server-side (API routes), usando el bot token y el OAuth access_token del usuario.

import { DISCORD_API_BASE, getRedirectUri } from "./config"

export type DiscordTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export type DiscordUser = {
  id: string
  username: string
  global_name?: string | null
  avatar?: string | null
  discriminator?: string
}

type DiscordGuildMember = {
  user?: { id: string }
  roles?: string[]
}

async function getGuildMember({
  botToken,
  guildId,
  discordUserId,
}: {
  botToken: string
  guildId: string
  discordUserId: string
}): Promise<DiscordGuildMember | null> {
  const res = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/members/${discordUserId}`, {
    headers: { Authorization: `Bot ${botToken}` },
  })

  if (res.status === 404) return null

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord get member falló (${res.status}): ${errText}`)
  }

  return (await res.json()) as DiscordGuildMember
}

async function assertRoleAssigned({
  botToken,
  guildId,
  discordUserId,
  roleId,
}: {
  botToken: string
  guildId: string
  discordUserId: string
  roleId: string
}): Promise<void> {
  const member = await getGuildMember({ botToken, guildId, discordUserId })
  if (!member) {
    throw new Error("Discord verify role falló: el usuario no figura en el server")
  }

  const roles = member.roles ?? []
  if (!roles.includes(roleId)) {
    throw new Error(
      "Discord verify role falló: el rol no quedó aplicado (revisar jerarquía/permisos del bot)"
    )
  }
}

/**
 * Intercambia el código de OAuth por un access_token.
 * Se llama en el callback después de que el usuario autoriza en Discord.
 */
export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth credentials no configuradas en env vars")
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
  })

  const res = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord token exchange falló (${res.status}): ${errText}`)
  }

  return (await res.json()) as DiscordTokenResponse
}

/**
 * Obtiene la info del usuario que acaba de autorizar (con su access_token).
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord /users/@me falló (${res.status}): ${errText}`)
  }

  return (await res.json()) as DiscordUser
}

/**
 * Agrega un usuario al server de Flowdex y le asigna el rol indicado.
 * Si el usuario ya está en el server, solo le suma el rol.
 *
 * Discord API: PUT /guilds/{guild.id}/members/{user.id}
 * Docs: https://discord.com/developers/docs/resources/guild#add-guild-member
 */
export async function addMemberWithRole({
  discordUserId,
  accessToken,
  roleId,
}: {
  discordUserId: string
  accessToken: string
  roleId: string
}): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!botToken || !guildId) {
    throw new Error("DISCORD_BOT_TOKEN o DISCORD_GUILD_ID no configurados")
  }

  // Primero: ¿ya está el usuario en el server? Si sí, solo agregamos el rol.
  const existingMember = await getGuildMember({ botToken, guildId, discordUserId })

  if (existingMember) {
    // Usuario ya en el server → solo asignar rol
    return assignRole({ discordUserId, roleId })
  }

  // Usuario no está en el server → agregarlo con el rol incluido
  const res = await fetch(
    `${DISCORD_API_BASE}/guilds/${guildId}/members/${discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        roles: [roleId],
      }),
    }
  )

  if (!res.ok && res.status !== 204) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord add member falló (${res.status}): ${errText}`)
  }

  await assertRoleAssigned({ botToken, guildId, discordUserId, roleId })
}

/**
 * Asigna un rol a un miembro que ya está en el server.
 *
 * Discord API: PUT /guilds/{guild.id}/members/{user.id}/roles/{role.id}
 */
export async function assignRole({
  discordUserId,
  roleId,
}: {
  discordUserId: string
  roleId: string
}): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!botToken || !guildId) {
    throw new Error("DISCORD_BOT_TOKEN o DISCORD_GUILD_ID no configurados")
  }

  const res = await fetch(
    `${DISCORD_API_BASE}/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bot ${botToken}` },
    }
  )

  if (!res.ok && res.status !== 204) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord assign role falló (${res.status}): ${errText}`)
  }

  await assertRoleAssigned({ botToken, guildId, discordUserId, roleId })
}

/**
 * Quita un rol a un miembro. Útil para cuando se da de baja un curso o se procesa un refund.
 */
export async function removeRole({
  discordUserId,
  roleId,
}: {
  discordUserId: string
  roleId: string
}): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!botToken || !guildId) {
    throw new Error("DISCORD_BOT_TOKEN o DISCORD_GUILD_ID no configurados")
  }

  const res = await fetch(
    `${DISCORD_API_BASE}/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` },
    }
  )

  if (!res.ok && res.status !== 204) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Discord remove role falló (${res.status}): ${errText}`)
  }
}
