// Notificaciones administrativas vía Telegram.
// Manda alertas al/los admin(s) cuando ocurren eventos relevantes (ventas, etc.).
//
// Diseño:
// - Fire-and-forget: si Telegram falla, NO bloquea el flujo del webhook que la
//   llama. La compra ya está acreditada en Supabase, la notificación es solo
//   un nice-to-have.
// - Multi-destinatario: soporta varios chat IDs (Fran + Augusto). Cada envío
//   es independiente, si uno falla los otros siguen.
// - Configurable por env var con fallback hardcoded a los IDs verificados.

import { sendMessage } from "./api"

// Chat IDs de los admins. Verificados vía @userinfobot en mayo 2026.
// Fran: 8246302347 | Augusto: 1524507913
const ADMIN_CHAT_IDS_FALLBACK = ["8246302347", "1524507913"]

function getAdminChatIds(): string[] {
  const envValue = process.env.TELEGRAM_ADMIN_CHAT_IDS
  if (envValue && envValue.trim()) {
    return envValue
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  }
  return ADMIN_CHAT_IDS_FALLBACK
}

// Escapa caracteres especiales de HTML para que no rompan el parse_mode HTML.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export type PurchaseNotification = {
  courseName: string
  courseSlug: string
  userName: string | null
  userEmail: string | null
  amountUsd: number
  provider: "mercadopago" | "nowpayments" | string
  orderId: string
}

/**
 * Notifica a los admins de una venta confirmada. Fire-and-forget:
 * los errores se loguean pero no se propagan.
 */
export async function notifyAdminOfPurchase(notification: PurchaseNotification): Promise<void> {
  const chatIds = getAdminChatIds()
  if (chatIds.length === 0) return

  const providerLabel =
    notification.provider === "mercadopago"
      ? "Mercado Pago"
      : notification.provider === "nowpayments"
      ? "Cripto (NOWPayments)"
      : notification.provider === "paypal"
      ? "PayPal"
      : notification.provider

  const displayName = notification.userName?.trim() || "Sin nombre"
  const displayEmail = notification.userEmail?.trim() || "—"

  const lines = [
    "<b>💰 Nueva venta Flowdex</b>",
    "",
    `<b>Curso:</b> ${escapeHtml(notification.courseName)}`,
    `<b>Usuario:</b> ${escapeHtml(displayName)} (${escapeHtml(displayEmail)})`,
    `<b>Monto:</b> $${notification.amountUsd.toFixed(2)} USD`,
    `<b>Proveedor:</b> ${escapeHtml(providerLabel)}`,
    `<b>Order:</b> <code>${escapeHtml(notification.orderId)}</code>`,
  ]
  const text = lines.join("\n")

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        await sendMessage({ chatId, text })
      } catch (error) {
        console.error("[admin-notify] envío a Telegram falló", {
          chatId,
          orderId: notification.orderId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    })
  )
}
