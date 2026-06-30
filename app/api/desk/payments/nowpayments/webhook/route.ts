import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { fulfillPaidDeskOrder } from "@/lib/payments/fulfill-desk-order"

// IPN webhook de NOWPayments para packs del Desk. order_id = deskOrderId.
// Valida HMAC-SHA512 (keys ordenadas), y al confirmarse el pago acredita vía
// fulfillPaidDeskOrder (valida monto e idempotencia).

type IpnPayload = {
  payment_status: string
  order_id: string
  price_amount?: number | string
  [key: string]: unknown
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

  let parsed: IpnPayload
  try {
    parsed = JSON.parse(rawBody) as IpnPayload
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const expectedSig = createHmac("sha512", ipnSecret)
    .update(JSON.stringify(sortObjectKeys(parsed)))
    .digest("hex")

  // Comparación constant-time (evita el side-channel de timing del `!==`).
  const expBuf = Buffer.from(expectedSig, "utf8")
  const sigBuf = Buffer.from(String(signature || ""), "utf8")
  if (expBuf.length !== sigBuf.length || !timingSafeEqual(expBuf, sigBuf)) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 })
  }

  const { payment_status, order_id } = parsed
  if (!order_id) {
    return NextResponse.json({ ok: true })
  }

  // En progreso: esperamos.
  if (["waiting", "confirming", "sending", "partially_paid"].includes(payment_status)) {
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

  if (payment_status === "finished" || payment_status === "confirmed") {
    // Guarda anti-underpago: NOWPayments reporta actually_paid y pay_amount en la
    // MISMA cripto (USDT ≈ USD; otra cripto, igual ambos en esa moneda). Comparamos
    // en su moneda nativa, con 2% de tolerancia por redondeo de red. Si faltan los
    // campos (NaN) no rechazamos (no rompe el flujo actual).
    const payExpected = Number(parsed.pay_amount)
    const payActual = Number(parsed.actually_paid)
    if (Number.isFinite(payExpected) && payExpected > 0 &&
        Number.isFinite(payActual) && payActual < payExpected * 0.98) {
      await serviceClient
        .from("desk_orders")
        .update({ status: "failed" })
        .eq("id", order_id)
        .eq("status", "pending")
      return NextResponse.json({ ok: true })
    }
    await fulfillPaidDeskOrder({
      serviceClient,
      deskOrderId: order_id,
      paidAmount: Number(parsed.price_amount),
      provider: "nowpayments",
    })
  } else if (payment_status === "failed" || payment_status === "expired") {
    await serviceClient
      .from("desk_orders")
      .update({ status: "failed" })
      .eq("id", order_id)
      .eq("status", "pending")
  }

  return NextResponse.json({ ok: true })
}
