import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDeskPack } from "@/lib/payments/desk-packs"

// Crea una preference de MercadoPago para un pack del Desk. Espejo del de cursos
// pero sobre `desk_orders`: external_reference = deskOrderId, notification_url al
// webhook del Desk. La acreditación la hace ese webhook (MP es asíncrono).

type DeskOrderRow = {
  id: string
  user_id: string
  pack: string
  amount_usd: number
  status: string
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

  const accessToken = process.env.MP_ACCESS_TOKEN
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!accessToken) {
    return NextResponse.json({ error: "Falta MP_ACCESS_TOKEN." }, { status: 500 })
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

  const client = new MercadoPagoConfig({ accessToken })
  const preferenceClient = new Preference(client)

  // En localhost MP rechaza auto_return porque las back_urls no son públicas.
  const isLocalhost = normalizedAppUrl.includes("localhost") || normalizedAppUrl.includes("127.0.0.1")

  let mpData: { id?: string; init_point?: string; sandbox_init_point?: string } | null = null
  try {
    mpData = await preferenceClient.create({
      body: {
        items: [
          {
            id: order.id,
            title: `Flowdex Desk - ${pack?.kind === "radar" ? "Pase" : "Pack"} ${pack?.name ?? order.pack}`,
            quantity: 1,
            currency_id: "USD",
            unit_price: Number(order.amount_usd),
          },
        ],
        external_reference: order.id,
        notification_url: `${normalizedAppUrl}/api/desk/payments/mercadopago/webhook`,
        back_urls: {
          success: `${normalizedAppUrl}/desk?compra=ok`,
          failure: `${normalizedAppUrl}/desk/checkout?pack=${order.pack}&pago=cancelado`,
          pending: `${normalizedAppUrl}/desk/checkout?pack=${order.pack}&pago=pendiente`,
        },
        ...(isLocalhost ? {} : { auto_return: "approved" }),
      },
    })
  } catch (error) {
    console.error("[desk/mp/preference] error creando preference", {
      message: error instanceof Error ? error.message : String(error),
      deskOrderId: order.id,
      isLocalhost,
    })
    return NextResponse.json({ error: "No se pudo crear la preferencia de pago." }, { status: 400 })
  }

  const initPoint = mpData?.init_point ?? mpData?.sandbox_init_point
  if (!mpData?.id || !initPoint) {
    console.error("[desk/mp/preference] respuesta sin init_point", { deskOrderId: order.id })
    return NextResponse.json({ error: "No se pudo crear la preferencia de pago." }, { status: 400 })
  }

  await serviceClient
    .from("desk_orders")
    .update({ provider_order_id: mpData.id })
    .eq("id", order.id)

  return NextResponse.json({ initPoint })
}
