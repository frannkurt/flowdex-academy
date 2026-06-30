import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
type NowPaymentsInvoiceResponse = {
  id: string
  invoice_url: string
  order_id: string
  price_amount: number
  price_currency: string
  pay_currency: string
  order_description: string
  code?: string
  message?: string
}

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: string
  courses: {
    name: string
    slug: string
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  // Checkout exprés: sin sesión también se permite (misma lógica que el
  // endpoint de preference de MercadoPago — ver comentario allá).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let body: { orderId: string }
  try {
    body = (await request.json()) as { orderId: string }
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  if (!body.orderId) {
    return NextResponse.json({ error: "orderId es obligatorio." }, { status: 400 })
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!apiKey) {
    return NextResponse.json({ error: "Falta NOWPAYMENTS_API_KEY." }, { status: 500 })
  }
  if (!appUrl) {
    return NextResponse.json({ error: "Falta NEXT_PUBLIC_APP_URL." }, { status: 500 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let orderQuery = serviceClient
    .from("orders")
    .select("id, user_id, course_id, amount_usd, status, courses(name, slug)")
    .eq("id", body.orderId)

  if (user) {
    orderQuery = orderQuery.eq("user_id", user.id)
  } else {
    orderQuery = orderQuery.eq("status", "pending")
  }

  const { data: orderRaw, error: orderError } = await orderQuery.maybeSingle()

  if (orderError || !orderRaw) {
    return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 })
  }

  const order = orderRaw as unknown as OrderRow
  const course = Array.isArray(order.courses) ? order.courses[0] : order.courses
  const normalizedAppUrl = appUrl.replace(/\/$/, "")

  const invoicePayload = {
    price_amount: Number(order.amount_usd),
    price_currency: "usd",
    pay_currency: "usdttrc20",
    order_id: order.id,
    order_description: `Flowdex - ${course.name}`,
    ipn_callback_url: `${normalizedAppUrl}/api/payments/nowpayments/webhook`,
    success_url: user
      ? `${normalizedAppUrl}/dashboard?payment=success`
      : `${normalizedAppUrl}/compra-confirmada`,
    cancel_url: `${normalizedAppUrl}/checkout/${course.slug}?payment=cancelled`,
  }

  const nowResponse = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoicePayload),
  })

  const nowData = (await nowResponse.json().catch(() => null)) as NowPaymentsInvoiceResponse | null

  if (!nowResponse.ok || !nowData?.invoice_url) {
    const providerCode = nowData?.code ?? "UNKNOWN_NOWPAYMENTS_ERROR"
    const providerMessage = nowData?.message ?? "No se pudo crear el invoice en NOWPayments."

    return NextResponse.json(
      {
        error: "No se pudo crear el invoice en NOWPayments.",
        providerCode,
        providerMessage,
      },
      { status: nowResponse.status || 500 },
    )
  }

  await serviceClient
    .from("orders")
    .update({ provider_reference: nowData.id })
    .eq("id", order.id)

  return NextResponse.json({ invoiceUrl: nowData.invoice_url })
}
