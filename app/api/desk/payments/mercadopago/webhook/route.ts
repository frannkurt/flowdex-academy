import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateMercadoPagoSignature } from "@/lib/payments/mercadopago-webhook-validation"
import { fulfillPaidDeskOrder } from "@/lib/payments/fulfill-desk-order"

// Webhook de MercadoPago para packs del Desk. external_reference = deskOrderId.
// Valida firma, trae el pago, y si está aprobado acredita vía fulfillPaidDeskOrder
// (que valida monto e idempotencia). Aislado del webhook de cursos: cada
// preference setea su propia notification_url.

type MpWebhook = { action?: string; data?: { id?: string }; type?: string }

const UUID_RE = /^[0-9a-f-]{36}$/

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const mpAccessToken = process.env.MP_ACCESS_TOKEN
  if (!supabaseUrl || !serviceRoleKey || !mpAccessToken) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 })
  }

  let payload: MpWebhook
  try {
    payload = (await request.json()) as MpWebhook
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
    headers: { Authorization: `Bearer ${mpAccessToken}` },
  })

  const payment = (await paymentResponse.json().catch(() => null)) as
    | { status?: string; external_reference?: string; transaction_amount?: number }
    | null

  if (!payment) {
    return NextResponse.json({ ok: true })
  }

  const ref = payment.external_reference ?? ""
  if (!UUID_RE.test(ref)) {
    return NextResponse.json({ ok: true })
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  if (!paymentResponse.ok || payment.status !== "approved") {
    if (payment.status === "rejected" || payment.status === "cancelled") {
      await serviceClient
        .from("desk_orders")
        .update({ status: "failed" })
        .eq("id", ref)
        .eq("status", "pending")
    }
    return NextResponse.json({ ok: true })
  }

  const paidAmount =
    typeof payment.transaction_amount === "number" ? payment.transaction_amount : Number.NaN

  await fulfillPaidDeskOrder({
    serviceClient,
    deskOrderId: ref,
    paidAmount,
    provider: "mercadopago",
  })

  return NextResponse.json({ ok: true })
}
