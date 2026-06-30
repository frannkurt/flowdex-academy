import type { SupabaseClient } from "@supabase/supabase-js"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import { sendPurchaseConfirmation } from "@/lib/emails/send"
import { buildGuestAccessUrl } from "@/lib/payments/guest-access-link"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"

// Acreditación de una orden pagada, compartida entre el capture de retorno y el
// webhook de PayPal (los dos pueden disparar para la misma orden; la guarda de
// idempotencia evita doble acreditación). Replica exactamente la política de
// validación de monto de los webhooks de MercadoPago y NOWPayments.
//
// MP/NOWPayments mantienen su lógica inline (código que ya anda, no se toca).
// Este helper nace con PayPal y centraliza solo el camino nuevo.

// Política de validación de monto (mayo 2026, decidida con Franco):
// - Tolerancia hacia abajo: USD 1.00. Bajo eso marca failed y no acredita.
// - Tolerancia hacia arriba: sin límite. Acreditamos igual si paga de más.
// - Si paga >15% por encima, log estructurado para review manual.
const UNDERPAYMENT_TOLERANCE_USD = 1
const OVERPAYMENT_WARNING_THRESHOLD = 1.15

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: string
  courses: { slug: string } | { slug: string }[]
}

export type FulfillResult =
  | "fulfilled"
  | "already_paid"
  | "not_found"
  | "underpaid"
  | "no_course"

export async function fulfillPaidOrder(args: {
  serviceClient: SupabaseClient
  orderId: string
  paidAmount: number
  provider: "paypal" | "mercadopago" | "nowpayments"
}): Promise<FulfillResult> {
  const { serviceClient, orderId, paidAmount, provider } = args

  const { data: orderRaw } = await serviceClient
    .from("orders")
    .select("id, user_id, course_id, amount_usd, status, courses(slug)")
    .eq("id", orderId)
    .maybeSingle()

  if (!orderRaw) return "not_found"

  const order = orderRaw as unknown as OrderRow

  // Idempotencia: si ya está acreditada, no repetimos nada.
  if (order.status === "paid") return "already_paid"

  const courseSlug = Array.isArray(order.courses)
    ? order.courses[0]?.slug
    : (order.courses as { slug: string })?.slug

  if (!courseSlug) return "no_course"

  const expectedAmount = Number(order.amount_usd)

  if (!Number.isFinite(paidAmount) || paidAmount < expectedAmount - UNDERPAYMENT_TOLERANCE_USD) {
    await serviceClient
      .from("orders")
      .update({ status: "failed" })
      .eq("id", order.id)
      .eq("status", "pending")
    return "underpaid"
  }

  if (paidAmount > expectedAmount * OVERPAYMENT_WARNING_THRESHOLD) {
    console.warn("[paypal] Overpayment significativo detectado", {
      orderId: order.id,
      userId: order.user_id,
      courseSlug,
      expected: expectedAmount,
      paid: paidAmount,
      diff: paidAmount - expectedAmount,
      diffPct: Number((((paidAmount - expectedAmount) / expectedAmount) * 100).toFixed(2)),
    })
  }

  // Flip ATÓMICO pending→paid: el capture de retorno y el webhook de PayPal pueden
  // dispararse para la MISMA orden a la vez. El chequeo de arriba (status==="paid")
  // es check-then-act y no frena la carrera; esta guarda sí: solo UNA llamada gana el
  // flip. Si no ganamos (otra ya acreditó), salimos sin repetir user_courses + email.
  const { data: flippedRows } = await serviceClient
    .from("orders")
    .update({ status: "paid" })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id")
  if (!flippedRows || flippedRows.length === 0) return "already_paid"

  const expiresAtIso = getCourseAccessExpiryDate(courseSlug).toISOString()

  await serviceClient.from("user_courses").upsert(
    {
      user_id: order.user_id,
      course_id: order.course_id,
      is_active: true,
      granted_at: new Date().toISOString(),
      expires_at: expiresAtIso,
    },
    { onConflict: "user_id,course_id" }
  )

  // Email de confirmación (fire-and-forget: la compra ya está acreditada).
  try {
    const { data: profileRaw } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", order.user_id)
      .maybeSingle()

    const profile = profileRaw as { email: string | null; full_name: string | null } | null
    // El email del checkout siempre queda en auth.users (cuenta invisible recién
    // creada o cuenta preexistente). Si el profile quedó sin email, lo recuperamos
    // de auth.users para garantizar que el comprador reciba SIEMPRE el mail.
    let buyerEmail = profile?.email ?? null
    if (!buyerEmail) {
      const { data: authUser } = await serviceClient.auth.admin.getUserById(order.user_id)
      buyerEmail = authUser?.user?.email ?? null
    }
    if (buyerEmail) {
      const firstName = profile?.full_name?.split(" ")[0] ?? null
      const accessUrl = await buildGuestAccessUrl(serviceClient, order.user_id, buyerEmail)
      await sendPurchaseConfirmation({
        to: buyerEmail,
        firstName,
        courseSlug,
        amountUsd: Number(order.amount_usd),
        expiresAt: expiresAtIso,
        isInnerCircle: courseSlug === "inner-circle",
        accessUrl,
      })
    }
  } catch (error) {
    console.error("[paypal] purchase email dispatch failed", error)
  }

  // Notificación a admins por Telegram (fire-and-forget).
  try {
    const { data: profileForNotif } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", order.user_id)
      .maybeSingle()
    const { data: courseForNotif } = await serviceClient
      .from("courses")
      .select("name")
      .eq("id", order.course_id)
      .maybeSingle()

    const typedProfile = profileForNotif as { email: string | null; full_name: string | null } | null
    const typedCourse = courseForNotif as { name: string | null } | null

    await notifyAdminOfPurchase({
      courseName: typedCourse?.name ?? courseSlug,
      courseSlug,
      userName: typedProfile?.full_name ?? null,
      userEmail: typedProfile?.email ?? null,
      amountUsd: Number(order.amount_usd),
      provider,
      orderId: order.id,
    })
  } catch (error) {
    console.error("[paypal] admin telegram notify failed", error)
  }

  return "fulfilled"
}
