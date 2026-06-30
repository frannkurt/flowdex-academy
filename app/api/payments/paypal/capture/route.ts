import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/payments/paypal-client"
import { fulfillPaidOrder } from "@/lib/payments/fulfill-order"

// return_url de PayPal. El comprador vuelve acá tras aprobar el pago. PayPal NO
// captura solo en este flujo: hay que llamar /capture explícitamente. Capturamos,
// acreditamos vía fulfillPaidOrder (idempotente, compartido con el webhook) y
// redirigimos. El webhook PAYMENT.CAPTURE.COMPLETED queda como backup por si el
// usuario cierra la pestaña antes de volver.

type OrderRow = {
  id: string
  provider_reference: string | null
  status: string
  courses: { slug: string } | { slug: string }[]
}

type CaptureResponse = {
  status?: string
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        custom_id?: string
        amount?: { value?: string; currency_code?: string }
      }>
    }
  }>
  message?: string
}

function redirectTo(appUrl: string, path: string) {
  return NextResponse.redirect(`${appUrl}${path}`)
}

export async function GET(request: Request) {
  const appUrlEnv = process.env.NEXT_PUBLIC_APP_URL ?? ""
  const appUrl = appUrlEnv.replace(/\/$/, "")

  const url = new URL(request.url)
  const ourOrderId = url.searchParams.get("order")
  // PayPal devuelve el id de su orden en ?token=
  const paypalOrderId = url.searchParams.get("token")

  if (!ourOrderId || !paypalOrderId) {
    return redirectTo(appUrl, "/?payment=error")
  }

  const supabase = await createSupabaseServerClient()
  const userResult = supabase ? await supabase.auth.getUser() : null
  const user = userResult?.data.user ?? null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return redirectTo(appUrl, "/?payment=error")
  }
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: orderRaw } = await serviceClient
    .from("orders")
    .select("id, provider_reference, status, courses(slug)")
    .eq("id", ourOrderId)
    .maybeSingle()

  if (!orderRaw) {
    return redirectTo(appUrl, "/?payment=error")
  }

  const order = orderRaw as unknown as OrderRow
  const courseSlug = Array.isArray(order.courses)
    ? order.courses[0]?.slug
    : (order.courses as { slug: string })?.slug

  const cancelPath = courseSlug ? `/checkout/${courseSlug}?payment=cancelled` : "/?payment=error"

  // El token recibido tiene que coincidir con el provider_reference que guardamos
  // al crear la orden: evita que alguien capture una orden ajena.
  if (order.provider_reference !== paypalOrderId) {
    return redirectTo(appUrl, cancelPath)
  }

  // Si ya estaba acreditada (webhook llegó primero), no recapturamos.
  if (order.status === "paid") {
    return redirectTo(
      appUrl,
      user ? "/dashboard?payment=success" : "/compra-confirmada"
    )
  }

  const accessToken = await getPaypalAccessToken()
  if (!accessToken) {
    return redirectTo(appUrl, cancelPath)
  }

  const captureRes = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  )

  const captureData = (await captureRes.json().catch(() => null)) as CaptureResponse | null

  if (!captureRes.ok || captureData?.status !== "COMPLETED") {
    console.error("[paypal/capture] captura no completada", {
      status: captureRes.status,
      paypalStatus: captureData?.status,
      message: captureData?.message,
      orderId: ourOrderId,
    })
    return redirectTo(appUrl, cancelPath)
  }

  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
  const paidAmount = Number(capture?.amount?.value)

  const result = await fulfillPaidOrder({
    serviceClient,
    orderId: ourOrderId,
    paidAmount,
    provider: "paypal",
  })

  if (result === "underpaid" || result === "not_found" || result === "no_course") {
    return redirectTo(appUrl, cancelPath)
  }

  return redirectTo(appUrl, user ? "/dashboard?payment=success" : "/compra-confirmada")
}
