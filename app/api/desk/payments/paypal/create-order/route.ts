import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/payments/paypal-client"
import { getDeskPack } from "@/lib/payments/desk-packs"

// Crea una orden PayPal (Orders API v2, intent CAPTURE) para un pack del Desk.
// Espejo del create-order de cursos pero sobre `desk_orders`. La acreditación la
// hace el capture de retorno + el fallback del webhook de PayPal.

type DeskOrderRow = {
  id: string
  user_id: string
  pack: string
  amount_usd: number
  status: string
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

  // Compra sin login: el invitado no tiene sesión. La orden la identifica su id
  // (UUID aleatorio que solo conoce quien la creó).
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
          custom_id: order.id, // viaja en captura y webhook: así reconciliamos
          description: `Flowdex Desk - ${pack?.kind === "radar" ? "Pase" : "Pack"} ${pack?.name ?? order.pack}`.slice(0, 127),
          amount: {
            currency_code: "USD",
            value: Number(order.amount_usd).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Flowdex Desk",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${normalizedAppUrl}/api/desk/payments/paypal/capture?order=${order.id}`,
        cancel_url: `${normalizedAppUrl}/desk/checkout?pack=${order.pack}&pago=cancelado`,
      },
    }),
  })

  const paypalData = (await paypalRes.json().catch(() => null)) as PaypalOrderResponse | null
  const approveUrl = paypalData?.links?.find((link) => link.rel === "approve")?.href

  if (!paypalRes.ok || !paypalData?.id || !approveUrl) {
    console.error("[desk/paypal/create-order] respuesta inválida de PayPal", {
      status: paypalRes.status,
      message: paypalData?.message,
      deskOrderId: order.id,
    })
    return NextResponse.json({ error: "No se pudo crear el pago en PayPal." }, { status: 400 })
  }

  await serviceClient
    .from("desk_orders")
    .update({ provider_order_id: paypalData.id })
    .eq("id", order.id)

  return NextResponse.json({ approveUrl })
}
