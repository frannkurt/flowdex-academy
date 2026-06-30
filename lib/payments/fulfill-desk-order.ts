import type { SupabaseClient } from "@supabase/supabase-js"
import { getDeskPack } from "@/lib/payments/desk-packs"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"
import { buildGuestAccessUrl } from "@/lib/payments/guest-access-link"
import { sendDeskPurchaseEmail } from "@/lib/emails/desk-email"
import { recordRedemption, grantDeskCouponBonus } from "@/lib/payments/coupons"

// Acreditación de una orden pagada del Flowdex Desk. Compartida entre el capture
// de PayPal, el webhook de PayPal (fallback) y los webhooks de MercadoPago y
// NOWPayments — todos pueden disparar para la misma orden, así que es idempotente.
//
// A diferencia de fulfillPaidOrder (cursos → user_courses), acá la acreditación
// es: insertar una fila en desk_credits con el saldo del pack y su vencimiento
// (+6 meses). El Desk hosteado lee ese saldo vía el RPC desk_consume_run.
//
// Idempotencia y carrera (capture + webhook simultáneos): el "candado" es el flip
// atómico de status pending→paid. Solo el que gana el flip inserta los créditos.

// Política de validación de monto (misma que cursos, mayo 2026):
// - Tolerancia hacia abajo: USD 1.00. Bajo eso marca failed y no acredita.
// - Tolerancia hacia arriba: sin límite (conversión USD↔ARS, fees).
// - >15% por encima: log estructurado para review manual.
const UNDERPAYMENT_TOLERANCE_USD = 1
const OVERPAYMENT_WARNING_THRESHOLD = 1.15

type DeskOrderRow = {
  id: string
  user_id: string
  pack: string
  credits: number
  radar_days: number
  amount_usd: number
  status: string
  credit_expires_months: number
  coupon_code: string | null
}

export type FulfillDeskResult =
  | "fulfilled"
  | "already_paid"
  | "not_found"
  | "underpaid"

export async function fulfillPaidDeskOrder(args: {
  serviceClient: SupabaseClient
  deskOrderId: string
  paidAmount: number
  provider: "paypal" | "mercadopago" | "nowpayments"
}): Promise<FulfillDeskResult> {
  const { serviceClient, deskOrderId, paidAmount, provider } = args

  const { data: orderRaw } = await serviceClient
    .from("desk_orders")
    .select("id, user_id, pack, credits, radar_days, amount_usd, status, credit_expires_months, coupon_code")
    .eq("id", deskOrderId)
    .maybeSingle()

  if (!orderRaw) return "not_found"

  const order = orderRaw as unknown as DeskOrderRow

  if (order.status === "paid") return "already_paid"

  const expectedAmount = Number(order.amount_usd)

  if (!Number.isFinite(paidAmount) || paidAmount < expectedAmount - UNDERPAYMENT_TOLERANCE_USD) {
    await serviceClient
      .from("desk_orders")
      .update({ status: "failed" })
      .eq("id", order.id)
      .eq("status", "pending")
    return "underpaid"
  }

  if (paidAmount > expectedAmount * OVERPAYMENT_WARNING_THRESHOLD) {
    console.warn("[desk-fulfill] Overpayment significativo detectado", {
      deskOrderId: order.id,
      userId: order.user_id,
      pack: order.pack,
      expected: expectedAmount,
      paid: paidAmount,
      provider,
    })
  }

  // Candado de idempotencia: flip atómico pending→paid. Si no devuelve fila,
  // otro disparo (webhook/capture) ya la acreditó: no insertamos créditos de nuevo.
  const { data: claimed } = await serviceClient
    .from("desk_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle()

  if (!claimed) return "already_paid"

  // Acreditar el pack: créditos con vencimiento a +N meses de la compra.
  // Los pases puros del Radar (credits=0) saltean este insert.
  const months = Number(order.credit_expires_months) || 3
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + months)

  if (order.credits > 0) {
    const { data: creditRaw, error: creditError } = await serviceClient
      .from("desk_credits")
      .insert({
        user_id: order.user_id,
        credits_total: order.credits,
        credits_used: 0,
        source: `pack:${order.pack}`,
        order_ref: order.id,
        expires_at: expiresAt.toISOString(),
      })
      .select("id")
      .single()

    if (creditError || !creditRaw) {
      // Caso muy raro: ya cobramos pero falló el insert del crédito. Logueamos
      // fuerte para acreditarlo a mano (la orden quedó 'paid' con el monto cobrado).
      console.error("[desk-fulfill] CRÍTICO: pago acreditado pero falló el insert de créditos", {
        deskOrderId: order.id,
        userId: order.user_id,
        pack: order.pack,
        credits: order.credits,
        error: creditError,
      })
    } else {
      await serviceClient
        .from("desk_orders")
        .update({ credit_id: (creditRaw as { id: string }).id })
        .eq("id", order.id)
    }
  }

  // Cupón de afiliado: registrar la redención (comisión 20% del pack sobre lo
  // pagado) y, si es una redención nueva, sumarle los +2 análisis al comprador.
  // recordRedemption es idempotente (índice único): un doble disparo de webhook
  // no duplica comisión ni bonus.
  if (order.coupon_code) {
    try {
      const isNew = await recordRedemption({
        client: serviceClient,
        code: order.coupon_code,
        product: "desk",
        buyerId: order.user_id,
        orderRef: order.id,
        amountPaidUsd: expectedAmount,
      })
      if (isNew) {
        await grantDeskCouponBonus(serviceClient, order.user_id, order.id)
      }
    } catch (error) {
      console.error("[desk-fulfill] cupón: falló redención/bonus (compra ya acreditada)", {
        deskOrderId: order.id,
        coupon: order.coupon_code,
        error,
      })
    }
  }

  // Pase del Radar de Dividendos: extender radar_until. Si ya tiene un pase
  // vigente, los días se SUMAN al vencimiento actual (no se pisan); si no,
  // corren desde hoy. Upsert: el entitlement puede no existir todavía.
  const radarDays = Number(order.radar_days) || 0
  if (radarDays > 0) {
    try {
      const { data: entRaw } = await serviceClient
        .from("desk_entitlements")
        .select("radar_until, tier")
        .eq("user_id", order.user_id)
        .maybeSingle()
      const ent = entRaw as { radar_until: string | null; tier: string } | null
      const now = new Date()
      const current = ent?.radar_until ? new Date(ent.radar_until) : null
      const base = current && current > now ? current : now
      const radarUntil = new Date(base.getTime() + radarDays * 86400_000)
      const { error: radarError } = await serviceClient
        .from("desk_entitlements")
        .upsert(
          { user_id: order.user_id, tier: ent?.tier ?? "trial", radar_until: radarUntil.toISOString() },
          { onConflict: "user_id" }
        )
      if (radarError) throw radarError
    } catch (error) {
      console.error("[desk-fulfill] CRÍTICO: pago acreditado pero falló el pase del Radar", {
        deskOrderId: order.id,
        userId: order.user_id,
        pack: order.pack,
        radarDays,
        error,
      })
    }
  }

  // Mail de acceso al comprador (fire-and-forget: el pago ya está acreditado).
  // Si es cuenta invitada sin contraseña, accessUrl es el link de recovery para
  // que elija su clave; si ya tenía cuenta, el CTA entra directo al Desk.
  try {
    const pack = getDeskPack(order.pack)
    const { data: buyerRaw } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", order.user_id)
      .maybeSingle()
    const buyer = buyerRaw as { email: string | null; full_name: string | null } | null
    // El email del checkout siempre queda en auth.users (cuenta invisible recién
    // creada o cuenta preexistente). Si el profile quedó sin email (trigger que no
    // lo copió, cuenta vieja, etc.), lo recuperamos de auth.users para garantizar
    // que el comprador reciba SIEMPRE el mail de acceso.
    let buyerEmail = buyer?.email ?? null
    if (!buyerEmail) {
      const { data: authUser } = await serviceClient.auth.admin.getUserById(order.user_id)
      buyerEmail = authUser?.user?.email ?? null
    }
    if (buyerEmail) {
      const accessUrl = await buildGuestAccessUrl(serviceClient, order.user_id, buyerEmail)
      await sendDeskPurchaseEmail({
        to: buyerEmail,
        fullName: buyer?.full_name ?? null,
        packName: pack?.name
          ? `${pack.kind === "radar" ? "Pase" : "Pack"} ${pack.name}`
          : order.pack,
        credits: order.credits,
        radarDays: Number(order.radar_days) || 0,
        amountUsd: expectedAmount,
        expiresAt,
        accessUrl,
      })
    }
  } catch (error) {
    console.error("[desk-fulfill] purchase email dispatch failed", error)
  }

  // Aviso a admins por Telegram (fire-and-forget).
  try {
    const pack = getDeskPack(order.pack)
    const { data: profileRaw } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", order.user_id)
      .maybeSingle()
    const profile = profileRaw as { email: string | null; full_name: string | null } | null

    const parts = [
      order.credits > 0 ? `${order.credits} créditos` : null,
      Number(order.radar_days) > 0 ? `Radar ${order.radar_days}d` : null,
    ].filter(Boolean).join(" + ")
    await notifyAdminOfPurchase({
      courseName: `Desk · ${pack?.kind === "radar" ? "Pase" : "Pack"} ${pack?.name ?? order.pack} (${parts})`,
      courseSlug: `desk-pack-${order.pack}`,
      userName: profile?.full_name ?? null,
      userEmail: profile?.email ?? null,
      amountUsd: expectedAmount,
      provider,
      orderId: order.id,
    })
  } catch (error) {
    console.error("[desk-fulfill] admin telegram notify failed", error)
  }

  return "fulfilled"
}
