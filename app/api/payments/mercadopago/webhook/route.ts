import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import { validateMercadoPagoSignature } from "@/lib/payments/mercadopago-webhook-validation"
import { sendPurchaseConfirmation } from "@/lib/emails/send"
import { buildGuestAccessUrl } from "@/lib/payments/guest-access-link"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"

// Dispara el email de confirmación de compra. Fire-and-forget: si Resend
// está mal configurado o falla, NO bloqueamos la respuesta del webhook
// (la compra ya está acreditada en Supabase).
async function dispatchPurchaseEmail(
  admin: SupabaseClient,
  userId: string,
  courseSlug: string,
  amountUsd: number,
  expiresAt: string
) {
  try {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle()

    const typedProfile = profile as { email: string | null; full_name: string | null } | null
    if (!typedProfile?.email) return

    const firstName = typedProfile.full_name?.split(" ")[0] ?? null

    // Checkout exprés: link para que la cuenta invisible elija contraseña.
    const accessUrl = await buildGuestAccessUrl(admin, userId, typedProfile.email)

    await sendPurchaseConfirmation({
      to: typedProfile.email,
      firstName,
      courseSlug,
      amountUsd,
      expiresAt,
      isInnerCircle: courseSlug === "inner-circle",
      accessUrl,
    })
  } catch (error) {
    console.error("[mp-webhook] purchase email dispatch failed", error)
  }
}

type MercadoPagoWebhook = {
  action?: string
  data?: {
    id?: string
  }
  type?: string
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const mpAccessToken = process.env.MP_ACCESS_TOKEN

  if (!supabaseUrl || !serviceRoleKey || !mpAccessToken) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 })
  }

  let payload: MercadoPagoWebhook

  try {
    payload = (await request.json()) as MercadoPagoWebhook
  } catch {
    return NextResponse.json({ ok: true })
  }

  const paymentId = payload.data?.id
  const isPaymentEvent = payload.type === "payment" || payload.action?.startsWith("payment")

  if (!validateMercadoPagoSignature({ request, dataId: paymentId ?? null })) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 })
  }

  if (!isPaymentEvent || !paymentId) {
    return NextResponse.json({ ok: true })
  }

  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${mpAccessToken}`,
    },
  })

  const payment = (await paymentResponse.json().catch(() => null)) as
    | {
        status?: string
        external_reference?: string
        transaction_amount?: number
      }
    | null

  if (!paymentResponse.ok || !payment || payment.status !== "approved") {
    // Handle failed/expired → update order if external_reference is a plain UUID (orderId)
    if (payment && (payment.status === "rejected" || payment.status === "cancelled")) {
      const ref = payment.external_reference
      if (ref && /^[0-9a-f-]{36}$/.test(ref)) {
        const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
        await serviceClient
          .from("orders")
          .update({ status: "failed" })
          .eq("id", ref)
          .eq("status", "pending")
      }
    }
    return NextResponse.json({ ok: true })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // ---- NEW PATH: external_reference is a plain orderId UUID ----
  const externalRef = payment.external_reference ?? ""
  const isOrderId = /^[0-9a-f-]{36}$/.test(externalRef)

  if (isOrderId) {
    const { data: orderRaw } = await adminClient
      .from("orders")
      .select("id, user_id, course_id, status, amount_usd, courses(slug)")
      .eq("id", externalRef)
      .maybeSingle()

    if (!orderRaw) return NextResponse.json({ ok: true })

    type OrderWithCourse = {
      id: string
      user_id: string
      course_id: string
      status: string
      amount_usd: number
      courses: { slug: string } | { slug: string }[]
    }
    const order = orderRaw as unknown as OrderWithCourse
    if (order.status === "paid") return NextResponse.json({ ok: true })

    const courseSlug = Array.isArray(order.courses)
      ? order.courses[0]?.slug
      : (order.courses as { slug: string })?.slug

    if (!courseSlug) return NextResponse.json({ ok: true })

    const paidAmount =
      typeof payment.transaction_amount === "number" ? payment.transaction_amount : Number.NaN
    const expectedAmount = Number(order.amount_usd)

    // Política de validación de monto (mayo 2026, decidida con Franco):
    // - Tolerancia hacia abajo: USD 1.00. Si pagó menos de eso fuera de
    //   tolerancia, marca failed y no acredita. Protege contra fraude estilo
    //   el LEGACY PATH eliminado en mayo.
    // - Tolerancia hacia arriba: sin límite. Acreditamos igual aunque pague
    //   de más. Protege al cliente honesto cuyo monto sube por conversión
    //   USD↔ARS o por un fee mínimo de MP.
    // - Si paga >15% por encima, log estructurado en console.warn. Eso queda
    //   en Vercel logs para revisión manual (devolución vía Discord/WA si
    //   corresponde). Aprovechamos que somos chicos para resolver casos
    //   raros con soporte directo.
    const UNDERPAYMENT_TOLERANCE_USD = 1
    const OVERPAYMENT_WARNING_THRESHOLD = 1.15

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount < expectedAmount - UNDERPAYMENT_TOLERANCE_USD
    ) {
      await adminClient
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id)
        .eq("status", "pending")

      return NextResponse.json({ ok: true })
    }

    if (paidAmount > expectedAmount * OVERPAYMENT_WARNING_THRESHOLD) {
      console.warn("[mp-webhook] Overpayment significativo detectado", {
        orderId: order.id,
        userId: order.user_id,
        courseSlug,
        expected: expectedAmount,
        paid: paidAmount,
        diff: paidAmount - expectedAmount,
        diffPct: Number((((paidAmount - expectedAmount) / expectedAmount) * 100).toFixed(2)),
      })
    }

    await adminClient
      .from("orders")
      .update({ status: "paid" })
      .eq("id", order.id)

    const expiresAtIso = getCourseAccessExpiryDate(courseSlug).toISOString()

    await adminClient.from("user_courses").upsert(
      {
        user_id: order.user_id,
        course_id: order.course_id,
        is_active: true,
        granted_at: new Date().toISOString(),
        expires_at: expiresAtIso,
      },
      { onConflict: "user_id,course_id" }
    )

    await dispatchPurchaseEmail(
      adminClient,
      order.user_id,
      courseSlug,
      Number(order.amount_usd),
      expiresAtIso
    )

    // Notificación a admins por Telegram (fire-and-forget).
    try {
      const { data: profileForNotif } = await adminClient
        .from("profiles")
        .select("email, full_name")
        .eq("id", order.user_id)
        .maybeSingle()
      const { data: courseForNotif } = await adminClient
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
        provider: "mercadopago",
        orderId: order.id,
      })
    } catch (error) {
      console.error("[mp-webhook] admin telegram notify failed", error)
    }

    return NextResponse.json({ ok: true })
  }

  // ---- LEGACY PATH ELIMINADO ----
  // El flujo legacy (external_reference como JSON {user_id, course_slug}) fue
  // removido en mayo 2026 por vulnerabilidad de seguridad: no validaba monto y
  // permitía otorgar acceso a cursos pagando cualquier cifra mínima.
  //
  // Hoy todos los pagos legítimos generan external_reference = orderId UUID
  // (ver /api/payments/mercadopago/preference). Si llega un webhook con
  // external_reference no-UUID, NO se otorga acceso. Solo se loguea para
  // auditoría y se responde 200 OK para que MercadoPago no reintente.
  console.warn(
    "[mp-webhook] external_reference no-UUID recibido, ignorado por seguridad:",
    externalRef
  )
  return NextResponse.json({ ok: true })
}
