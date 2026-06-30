import { NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"

export const dynamic = "force-dynamic"

/**
 * POST /api/telegram/webhook
 *
 * Recibe updates de Telegram (configurados via setWebhook). Nos interesa solo
 * el evento `chat_member` cuando un usuario nuevo se une a un grupo usando
 * un invite link generado por nosotros (identificado por el campo `name`).
 *
 * Cuando capturamos el join, guardamos el mapping telegram_user_id ↔ user_id de
 * Flowdex en `telegram_memberships` para poder kickear después cuando expire.
 *
 * Seguridad: Telegram envía el header `X-Telegram-Bot-Api-Secret-Token` con el
 * secret que configuramos al registrar el webhook. Lo validamos.
 */

type TelegramChatMemberStatus =
  | "creator"
  | "administrator"
  | "member"
  | "restricted"
  | "left"
  | "kicked"

type TelegramChatMember = {
  user: {
    id: number
    first_name?: string
    username?: string
  }
  status: TelegramChatMemberStatus
}

type TelegramUpdate = {
  update_id: number
  chat_member?: {
    chat: { id: number; type: string; title?: string }
    from: { id: number }
    date: number
    old_chat_member: TelegramChatMember
    new_chat_member: TelegramChatMember
    invite_link?: {
      invite_link: string
      name?: string
      creator: { id: number; is_bot: boolean }
      is_revoked?: boolean
    }
  }
}

export async function POST(request: NextRequest) {
  // 1) Validar secret token (fail-closed: sin secret seteado, rechazamos todo).
  const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET
  const receivedToken = request.headers.get("x-telegram-bot-api-secret-token")

  if (!expectedToken) {
    console.error("[telegram/webhook] TELEGRAM_WEBHOOK_SECRET no configurado — rechazando request")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
  }

  if (receivedToken !== expectedToken) {
    console.warn("[telegram/webhook] secret token mismatch", {
      received: receivedToken ? "present" : "missing",
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2) Parsear update
  let update: TelegramUpdate
  try {
    update = (await request.json()) as TelegramUpdate
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const event = update.chat_member
  if (!event) {
    // No es chat_member, ignoramos (Telegram puede mandar otros tipos de updates)
    return NextResponse.json({ ok: true })
  }

  const oldStatus = event.old_chat_member.status
  const newStatus = event.new_chat_member.status
  const inviteName = event.invite_link?.name

  // Solo nos importa: alguien que ANTES NO ERA miembro, AHORA es miembro,
  // y vino via un invite link con `name` (los nuestros siempre lo tienen).
  // La validación final la hace el DB lookup más abajo — si el name matchea
  // un row de telegram_memberships, es nuestro.
  const wasOutside = oldStatus === "left" || oldStatus === "kicked"
  const isInside = newStatus === "member" || newStatus === "administrator"

  if (!(wasOutside && isInside) || !inviteName) {
    return NextResponse.json({ ok: true })
  }

  // 3) Buscar la membership pending matcheando por invite_name
  const admin = createSupabaseAdminClient()
  if (!admin) {
    console.error("[telegram/webhook] no admin client disponible")
    return NextResponse.json({ ok: true })
  }

  const { data: membership, error: lookupErr } = await admin
    .from("telegram_memberships")
    .select("id, user_id, community")
    .eq("invite_name", inviteName)
    .maybeSingle()

  if (lookupErr) {
    console.error("[telegram/webhook] error lookup", { inviteName, lookupErr })
    return NextResponse.json({ ok: true })
  }

  if (!membership) {
    console.warn("[telegram/webhook] no membership row para invite_name", { inviteName })
    return NextResponse.json({ ok: true })
  }

  // 4) Actualizar con el telegram_user_id y joined_at
  const telegramUserId = event.new_chat_member.user.id
  const { error: updateErr } = await admin
    .from("telegram_memberships")
    .update({
      telegram_user_id: telegramUserId,
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      kicked_at: null, // Reset por si re-entra después de un kick previo
    })
    .eq("id", membership.id)

  if (updateErr) {
    console.error("[telegram/webhook] error actualizando membership", {
      membershipId: membership.id,
      updateErr,
    })
  } else {
    console.log("[telegram/webhook] usuario joined", {
      flowdexUserId: membership.user_id,
      telegramUserId,
      community: membership.community,
    })
  }

  return NextResponse.json({ ok: true })
}
