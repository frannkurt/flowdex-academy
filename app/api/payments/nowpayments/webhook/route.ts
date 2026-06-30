import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import { sendPurchaseConfirmation } from "@/lib/emails/send"
import { buildGuestAccessUrl } from "@/lib/payments/guest-access-link"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"

type IpnPayload = {
  payment_status: string
  order_id: string
  payment_id: string | number
  price_amount?: number | string
  [key: string]: unknown
}

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: string
  courses: {
    slug: string
  }
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
    }
    return sorted
  }
  return obj
}

export async function POST(request: Request) {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET
  if (!ipnSecret) {
    return NextResponse.json({ error: "IPN secret no configurado." }, { status: 500 })
  }

  // Read raw body as text for HMAC validation
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: "No se pudo leer el cuerpo." }, { status: 400 })
  }

  const signature = request.headers.get("x-nowpayments-sig")
  if (!signature) {
    return NextResponse.json({ error: "Firma ausente." }, { status: 401 })
  }

  // Validate HMAC-SHA512: sort keys, stringify, compare
  let parsed: IpnPayload
  try {
    parsed = JSON.parse(rawBody) as IpnPayload
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 })
  }

  const sorted = sortObjectKeys(parsed)
  const expectedSig = createHmac("sha512", ipnSecret)
    .update(JSON.stringify(sorted))
    .digest("hex")

  // Comparación constant-time (evita el side-channel de timing del `!==`).
  const expBuf = Buffer.from(expectedSig, "utf8")
  const sigBuf = Buffer.from(String(signature || ""), "utf8")
  if (expBuf.length !== sigBuf.length || !timingSafeEqual(expBuf, sigBuf)) {
    return NextResponse.json({ error: "Firma invalida." }, { status: 401 })
  }

  const { payment_status, order_id } = parsed

  if (!order_id) {
    return NextResponse.json({ ok: true })
  }

  // Statuses to ignore (payment in progress)
  const ignoredStatuses = ["waiting", "confirming", "sending", "partially_paid"]
  if (ignoredStatuses.includes(payment_status)) {
    return NextResponse.json({ ok: true })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: orderRaw } = await serviceClient
    .from("orders")
    .select("id, user_id, course_id, amount_usd, status, courses(slug)")
    .eq("id", order_id)
    .maybeSingle()

  if (!orderRaw) {
    return NextResponse.json({ ok: true })
  }

  const order = orderRaw as unknown as OrderRow
  const courseSlug = Array.isArray(order.courses)
    ? order.courses[0]?.slug
    : (order.courses as { slug: string })?.slug

  if (payment_status === "finished" || payment_status === "confirmed") {
    // Idempotency guard
    if (order.status === "paid") {
      return NextResponse.json({ ok: true })
    }

    // Anti-underpago real: actually_paid y pay_amount vienen en la MISMA cripto
    // (USDT ≈ USD; otra cripto, igual ambos en esa moneda). El price_amount (USD
    // invoice) de abajo siempre matchea contra amount_usd (no-op), así que el chequeo
    // verdadero es en la cripto pagada, con 2% de tolerancia por redondeo. Campos
    // ausentes (NaN) → no rechaza (no rompe el flujo actual).
    const payExpected = Number(parsed.pay_amount)
    const payActual = Number(parsed.actually_paid)
    if (Number.isFinite(payExpected) && payExpected > 0 &&
        Number.isFinite(payActual) && payActual < payExpected * 0.98) {
      await serviceClient
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id)
        .eq("status", "pending")
      return NextResponse.json({ ok: true })
    }

    const paidAmount = Number(parsed.price_amount)
    const expectedAmount = Number(order.amount_usd)

    // Política de validación de monto (mayo 2026, consistente con MercadoPago):
    // - Tolerancia hacia abajo: USD 1.00. Bajo eso marca failed.
    // - Tolerancia hacia arriba: sin límite. Acreditamos igual si paga de más.
    // - Si paga >15% por encima, log estructurado en console.warn para review
    //   manual (devolución vía Discord/WhatsApp si corresponde).
    const UNDERPAYMENT_TOLERANCE_USD = 1
    const OVERPAYMENT_WARNING_THRESHOLD = 1.15

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount < expectedAmount - UNDERPAYMENT_TOLERANCE_USD
    ) {
      await serviceClient
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id)
        .eq("status", "pending")

      return NextResponse.json({ ok: true })
    }

    if (paidAmount > expectedAmount * OVERPAYMENT_WARNING_THRESHOLD) {
      console.warn("[now-webhook] Overpayment significativo detectado", {
        orderId: order.id,
        userId: order.user_id,
        courseSlug,
        expected: expectedAmount,
        paid: paidAmount,
        diff: paidAmount - expectedAmount,
        diffPct: Number((((paidAmount - expectedAmount) / expectedAmount) * 100).toFixed(2)),
      })
    }

    await serviceClient
      .from("orders")
      .update({ status: "paid" })
      .eq("id", order.id)

    if (courseSlug) {
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

      // Email de confirmación (fire-and-forget)
      try {
        const { data: profileRaw } = await serviceClient
          .from("profiles")
          .select("email, full_name")
          .eq("id", order.user_id)
          .maybeSingle()

        const profile = profileRaw as { email: string | null; full_name: string | null } | null
        if (profile?.email) {
          const firstName = profile.full_name?.split(" ")[0] ?? null
          // Checkout exprés: link para que la cuenta invisible elija contraseña.
          const accessUrl = await buildGuestAccessUrl(serviceClient, order.user_id, profile.email)
          await sendPurchaseConfirmation({
            to: profile.email,
            firstName,
            courseSlug,
            amountUsd: Number(order.amount_usd),
            expiresAt: expiresAtIso,
            isInnerCircle: courseSlug === "inner-circle",
            accessUrl,
          })
        }
      } catch (error) {
        console.error("[now-webhook] purchase email dispatch failed", error)
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
          provider: "nowpayments",
          orderId: order.id,
        })
      } catch (error) {
        console.error("[now-webhook] admin telegram notify failed", error)
      }
    }
  } else if (payment_status === "failed" || payment_status === "expired") {
    await serviceClient
      .from("orders")
      .update({ status: payment_status })
      .eq("id", order.id)
      .eq("status", "pending")
  }

  return NextResponse.json({ ok: true })
}
