// Helpers para interactuar con la Telegram Bot API.
// Todas las llamadas se hacen server-side usando el bot token.

import { TELEGRAM_API_BASE } from "./config"

export class TelegramApiError extends Error {
  method: string
  description: string
  errorCode?: number

  constructor({
    method,
    description,
    errorCode,
  }: {
    method: string
    description: string
    errorCode?: number
  }) {
    super(`Telegram ${method} falló: ${description}`)
    this.name = "TelegramApiError"
    this.method = method
    this.description = description
    this.errorCode = errorCode
  }
}

export type TelegramInviteLink = {
  invite_link: string
  creator?: { id: number; is_bot: boolean; first_name: string }
  creates_join_request?: boolean
  is_primary?: boolean
  is_revoked?: boolean
  expire_date?: number
  member_limit?: number
  name?: string
}

type TelegramResponse<T> = {
  ok: boolean
  result?: T
  description?: string
  error_code?: number
}

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN no configurado en env vars")
  }
  return token
}

async function callBotApi<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const token = getBotToken()
  const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    cache: "no-store",
  })

  const data = (await res.json().catch(() => ({}))) as TelegramResponse<T>

  if (!res.ok || !data.ok || !data.result) {
    const reason = data.description ?? `HTTP ${res.status}`
    throw new TelegramApiError({
      method,
      description: reason,
      errorCode: data.error_code,
    })
  }

  return data.result
}

/**
 * Genera un link de invitación de un solo uso para sumar al usuario al canal/grupo.
 * El link expira en `expiresInSeconds` o cuando alguien lo usa.
 *
 * Telegram API: createChatInviteLink
 * Docs: https://core.telegram.org/bots/api#createchatinvitelink
 */
export async function createOneTimeInvite({
  chatId,
  expiresInSeconds,
  name,
}: {
  chatId: string
  expiresInSeconds: number
  name?: string
}): Promise<TelegramInviteLink> {
  const safeName = name ? name.slice(0, 32) : undefined
  const expireDate = Math.floor(Date.now() / 1000) + Math.max(60, expiresInSeconds)

  const inviteParams: Record<string, unknown> = {
    chat_id: chatId,
    member_limit: 1,
    expire_date: expireDate,
  }
  if (safeName) inviteParams.name = safeName

  return await callBotApi<TelegramInviteLink>("createChatInviteLink", inviteParams)
}

/**
 * Saca a un usuario del canal/grupo. Útil cuando expira la membresía.
 * Hacemos ban + unban inmediato para que pueda volver a entrar si re-suscribe.
 *
 * Telegram API: banChatMember + unbanChatMember
 */
export async function kickFromChat({
  chatId,
  telegramUserId,
}: {
  chatId: string
  telegramUserId: number
}): Promise<void> {
  // Ban temporal (hasta dentro de 60 segundos)
  await callBotApi<boolean>("banChatMember", {
    chat_id: chatId,
    user_id: telegramUserId,
    until_date: Math.floor(Date.now() / 1000) + 60,
  })

  // Unban inmediato así puede re-entrar después con un invite nuevo
  await callBotApi<boolean>("unbanChatMember", {
    chat_id: chatId,
    user_id: telegramUserId,
    only_if_banned: true,
  })
}

/**
 * Manda un mensaje de texto a un chat. Soporta formato HTML básico
 * (<b>, <i>, <code>, <a href="">) — más seguro que Markdown porque
 * no requiere escapar caracteres especiales.
 *
 * Telegram API: sendMessage
 * Docs: https://core.telegram.org/bots/api#sendmessage
 */
export async function sendMessage({
  chatId,
  text,
  parseMode = "HTML",
  disableWebPagePreview = true,
}: {
  chatId: string
  text: string
  parseMode?: "HTML" | "MarkdownV2"
  disableWebPagePreview?: boolean
}): Promise<void> {
  await callBotApi<unknown>("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: disableWebPagePreview,
  })
}

/**
 * Verifica que el bot tenga permisos correctos en un chat.
 * Útil para debugging y health checks.
 */
export async function getBotChatStatus(chatId: string): Promise<{ status: string; can_invite_users?: boolean }> {
  const token = getBotToken()
  // Pedimos getChatMember para nuestro propio bot
  const meRes = await fetch(`${TELEGRAM_API_BASE}/bot${token}/getMe`, { cache: "no-store" })
  const me = (await meRes.json()) as TelegramResponse<{ id: number }>
  if (!me.ok || !me.result) {
    throw new Error("No se pudo obtener info del bot")
  }

  const result = await callBotApi<{
    status: string
    can_invite_users?: boolean
  }>("getChatMember", {
    chat_id: chatId,
    user_id: me.result.id,
  })

  return result
}
