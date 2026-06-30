import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDeskPack } from "@/lib/payments/desk-packs"

// Crea un invoice de NOWPayments (cripto/USDT) para un pack del Desk. Espejo del
// de cursos sobre `desk_orders`. La acreditación la hace el IPN webhook del Desk.

type DeskOrderRow = {
  id: string
  user_id: string
  pack: string
  amount_usd: number
  status: string
}

type NowInvoiceResponse = {
  id: string
  invoice_url: string
  code?: string
  message?: string
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  // Compra sin login: el invitado no tiene sesión. La orden la identifica su id.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let body: { deskOrderId: string }
  try {
    body = (await request.json()) as { deskOrderId: string }
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }
  if (!body.deskOrderId) {
    return NextResponse.json({ error: "deskOrderId es obligatorio." }, { status: 400 })
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!apiKey) {
    return NextResponse.json({ error: "Falta NOWPAYMENTS_API_KEY." }, { status: 500 })
  }
  if (!appUrl) {
    return NextResponse.json({ error: "Falta NEXT_PUBLIC_APP_URL." }, { status: 500 })
  }
  const normalizedAppUrl = appUrl.replace(/\/$/, "")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let orderQuery = serviceClient
    .from("desk_orders")
    .select("id, user_id, pack, amount_usd, status")
    .eq("id", body.deskOrderId)
  orderQuery = user ? orderQuery.eq("user_id", user.id) : orderQuery.eq("status", "pending")
  const { data: orderRaw, error: orderError } = await orderQuery.maybeSingle()

  if (orderError || !orderRaw) {
    return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 })
  }

  const order = orderRaw as unknown as DeskOrderRow
  const pack = getDeskPack(order.pack)

  const invoicePayload = {
    price_amount: Number(order.amount_usd),
    price_currency: "usd",
    pay_currency: "usdttrc20",
    order_id: order.id,
    order_description: `Flowdex Desk - ${pack?.kind === "radar" ? "Pase" : "Pack"} ${pack?.name ?? order.pack}`,
    ipn_callback_url: `${normalizedAppUrl}/api/desk/payments/nowpayments/webhook`,
    success_url: `${normalizedAppUrl}/desk?compra=ok`,
    cancel_url: `${normalizedAppUrl}/desk/checkout?pack=${order.pack}&pago=cancelado`,
  }

  const nowResponse = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(invoicePayload),
  })

  const nowData = (await nowResponse.json().catch(() => null)) as NowInvoiceResponse | null

  if (!nowResponse.ok || !nowData?.invoice_url) {
    return NextResponse.json(
      {
        error: "No se pudo crear el invoice en NOWPayments.",
        providerCode: nowData?.code ?? "UNKNOWN_NOWPAYMENTS_ERROR",
        providerMessage: nowData?.message ?? null,
      },
      { status: nowResponse.status || 500 }
    )
  }

  await serviceClient
    .from("desk_orders")
    .update({ provider_order_id: nowData.id })
    .eq("id", order.id)

  return NextResponse.json({ invoiceUrl: nowData.invoice_url })
}
