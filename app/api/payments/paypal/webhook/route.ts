import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/payments/paypal-client"
import { fulfillPaidOrder } from "@/lib/payments/fulfill-order"
import { fulfillPaidDeskOrder } from "@/lib/payments/fulfill-desk-order"

// Webhook de PayPal. Backup del capture de retorno: si el comprador cierra la
// pestaña tras aprobar (o el capture falla por red), PayPal igual dispara
// PAYMENT.CAPTURE.COMPLETED y acreditamos acá. fulfillPaidOrder es idempotente,
// así que disparar dos veces para la misma orden no duplica nada.
//
// Verificamos la firma con la API verify-webhook-signature de PayPal: requiere
// PAYPAL_WEBHOOK_ID (el id del webhook configurado en el dashboard) + los headers
// de transmisión. Sin verificación válida, no se acredita.

type CaptureResource = {
  custom_id?: string
  amount?: { value?: string; currency_code?: string }
}

type PaypalWebhookEvent = {
  event_type?: string
  resource?: CaptureResource
}

export async function POST(request: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    return NextResponse.json({ error: "PAYPAL_WEBHOOK_ID no configurado." }, { status: 500 })
  }

  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: "No se pudo leer el cuerpo." }, { status: 400 })
  }

  let event: PaypalWebhookEvent
  try {
    event = JSON.parse(rawBody) as PaypalWebhookEvent
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 })
  }

  const accessToken = await getPaypalAccessToken()
  if (!accessToken) {
    return NextResponse.json({ error: "PayPal no configurado." }, { status: 500 })
  }

  // Verificación de firma contra la API de PayPal.
  const verifyRes = await fetch(
    `${getPaypalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event,
      }),
    }
  )

  const verifyData = (await verifyRes.json().catch(() => null)) as {
    verification_status?: string
  } | null

  if (!verifyRes.ok || verifyData?.verification_status !== "SUCCESS") {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 })
  }

  // Solo nos interesa la captura completada. El resto se responde 200 para que
  // PayPal no reintente.
  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ ok: true })
  }

  const orderId = event.resource?.custom_id
  if (!orderId) {
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

  const paidAmount = Number(event.resource?.amount?.value)

  const result = await fulfillPaidOrder({
    serviceClient,
    orderId,
    paidAmount,
    provider: "paypal",
  })

  // Fallback: PayPal manda TODAS las capturas a este único webhook. Si el
  // custom_id no es una orden de curso, probamos como pack del Desk. Idempotente
  // (el capture de retorno ya pudo haberla acreditado).
  if (result === "not_found") {
    await fulfillPaidDeskOrder({
      serviceClient,
      deskOrderId: orderId,
      paidAmount,
      provider: "paypal",
    })
  }

  return NextResponse.json({ ok: true })
}
