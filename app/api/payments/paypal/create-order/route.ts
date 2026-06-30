import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/payments/paypal-client"

// Crea una orden en PayPal (Orders API v2, intent CAPTURE) y devuelve el link de
// aprobación para redirigir al comprador. Mismo flujo que MP/NOWPayments: la
// orden ya existe en `orders` (creada en /api/orders/create con el monto final),
// acá solo generamos el pago del lado de PayPal y guardamos su id como
// provider_reference. La acreditación la hace el capture de retorno + el webhook.

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

type PaypalOrderResponse = {
  id?: string
  links?: Array<{ href: string; rel: string; method: string }>
  message?: string
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  // Checkout exprés: sin sesión también se permite (misma lógica que MP/NOW).
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
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

  const accessToken = await getPaypalAccessToken()
  if (!accessToken) {
    return NextResponse.json(
      { error: "PayPal no configurado o credenciales inválidas." },
      { status: 500 }
    )
  }

  const paypalRes = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          // custom_id viaja en la captura y en el webhook: así reconciliamos.
          custom_id: order.id,
          description: `Flowdex - ${course.name}`.slice(0, 127),
          amount: {
            currency_code: "USD",
            value: Number(order.amount_usd).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Flowdex",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        // El return_url captura y acredita; el cancel vuelve al checkout.
        return_url: `${normalizedAppUrl}/api/payments/paypal/capture?order=${order.id}`,
        cancel_url: `${normalizedAppUrl}/checkout/${course.slug}?payment=cancelled`,
      },
    }),
  })

  const paypalData = (await paypalRes.json().catch(() => null)) as PaypalOrderResponse | null

  const approveUrl = paypalData?.links?.find((link) => link.rel === "approve")?.href

  if (!paypalRes.ok || !paypalData?.id || !approveUrl) {
    console.error("[paypal/create-order] respuesta inválida de PayPal", {
      status: paypalRes.status,
      message: paypalData?.message,
      orderId: order.id,
    })
    return NextResponse.json({ error: "No se pudo crear el pago en PayPal." }, { status: 400 })
  }

  await serviceClient
    .from("orders")
    .update({ provider_reference: paypalData.id })
    .eq("id", order.id)

  return NextResponse.json({ approveUrl })
}
