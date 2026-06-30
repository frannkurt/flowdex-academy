import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"

// Flujo actual: el checkout crea una orden en /api/orders/create con el monto
// final (incluyendo upgrade discount), graba esa orden en la tabla `orders`, y
// despues invoca este endpoint con `orderId`. Asi el webhook valida `amount_usd`
// contra el monto efectivamente cobrado en MercadoPago.
//
// El camino legacy (con `courseSlug` + external_reference como JSON) fue
// deprecado en mayo 2026 porque no validaba monto en el webhook. Cualquier
// llamada sin orderId ahora devuelve 400.

type PreferenceBody = {
  orderId: string
}

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  courses: {
    id: string
    name: string
    slug: string
    price: number
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  // Checkout exprés: sin sesión también se permite. La orden de un invitado
  // solo es conocida por quien la creó (UUID aleatorio devuelto por
  // /api/orders/create) y el único "abuso" posible es pagarle el curso a
  // otro. Con sesión, validamos pertenencia como siempre.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let body: PreferenceBody

  try {
    body = (await request.json()) as PreferenceBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  if (!body?.orderId) {
    return NextResponse.json(
      { error: "orderId es obligatorio. El flujo legacy con courseSlug fue deprecado." },
      { status: 400 }
    )
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
    .from("orders")
    .select("id, user_id, course_id, amount_usd, status, courses(id, name, slug, price)")
    .eq("id", body.orderId)

  // Con sesión: la orden tiene que ser del usuario. Sin sesión (invitado):
  // solo se aceptan órdenes pendientes.
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

  const client = new MercadoPagoConfig({ accessToken })
  const preferenceClient = new Preference(client)
  let mpData: { id?: string; init_point?: string; sandbox_init_point?: string } | null = null

  // En localhost, MP rechaza preferences con `auto_return: "approved"` porque las
  // back_urls apuntan a localhost (no es URL pública). En dev sacamos el
  // auto_return para que la preference se cree igual. En prod queda activo
  // porque NEXT_PUBLIC_APP_URL ya apunta al dominio real.
  const isLocalhost = normalizedAppUrl.includes("localhost") || normalizedAppUrl.includes("127.0.0.1")

  try {
    mpData = await preferenceClient.create({
      body: {
        items: [{ id: order.id, title: course.name, quantity: 1, currency_id: "USD", unit_price: Number(order.amount_usd) }],
        external_reference: order.id,
        notification_url: `${normalizedAppUrl}/api/payments/mercadopago/webhook`,
        back_urls: {
          // Invitados no tienen sesión: el dashboard los patearía al login.
          // Los mandamos a la página de confirmación, que explica que el
          // acceso llega por email.
          success: user
            ? `${normalizedAppUrl}/dashboard?payment=success`
            : `${normalizedAppUrl}/compra-confirmada`,
          failure: `${normalizedAppUrl}/checkout/${course.slug}?payment=cancelled`,
          pending: `${normalizedAppUrl}/checkout/${course.slug}?payment=pending`,
        },
        ...(isLocalhost ? {} : { auto_return: "approved" }),
      },
    })
  } catch (error) {
    // Logueamos el error real para diagnóstico (MP SDK tira excepción con detalle).
    console.error("[mp/preference] error creando preference", {
      message: error instanceof Error ? error.message : String(error),
      cause: error instanceof Error ? error.cause : undefined,
      orderId: order.id,
      isLocalhost,
    })
    return NextResponse.json(
      {
        error: "No se pudo crear la preferencia de pago.",
        detail: process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : undefined,
      },
      { status: 400 }
    )
  }

  const initPoint = mpData?.init_point ?? mpData?.sandbox_init_point
  if (!mpData?.id || !initPoint) {
    console.error("[mp/preference] respuesta de MP sin init_point", { mpData, orderId: order.id })
    return NextResponse.json({ error: "No se pudo crear la preferencia de pago." }, { status: 400 })
  }

  await serviceClient
    .from("orders")
    .update({ provider_reference: mpData.id })
    .eq("id", order.id)

  return NextResponse.json({ ok: true, initPoint, preferenceId: mpData.id })
}
