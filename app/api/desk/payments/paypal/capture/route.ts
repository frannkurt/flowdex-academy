import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/payments/paypal-client"
import { fulfillPaidDeskOrder } from "@/lib/payments/fulfill-desk-order"

// return_url de PayPal para packs del Desk. PayPal no captura solo: llamamos
// /capture explícitamente, acreditamos vía fulfillPaidDeskOrder (idempotente) y
// redirigimos. El webhook PAYMENT.CAPTURE.COMPLETED queda de backup.

type DeskOrderRow = {
  id: string
  pack: string
  provider_order_id: string | null
  status: string
}

type CaptureResponse = {
  status?: string
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ amount?: { value?: string; currency_code?: string } }>
    }
  }>
  message?: string
}

function redirectTo(appUrl: string, path: string) {
  return NextResponse.redirect(`${appUrl}${path}`)
}

export async function GET(request: Request) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")

  const url = new URL(request.url)
  const ourOrderId = url.searchParams.get("order")
  const paypalOrderId = url.searchParams.get("token") // PayPal devuelve su id en ?token=

  if (!ourOrderId || !paypalOrderId) {
    return redirectTo(appUrl, "/desk/checkout?pago=error")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return redirectTo(appUrl, "/desk/checkout?pago=error")
  }
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: orderRaw } = await serviceClient
    .from("desk_orders")
    .select("id, pack, provider_order_id, status")
    .eq("id", ourOrderId)
    .maybeSingle()

  if (!orderRaw) {
    return redirectTo(appUrl, "/desk/checkout?pago=error")
  }

  const order = orderRaw as unknown as DeskOrderRow
  const cancelPath = `/desk/checkout?pack=${order.pack}&pago=cancelado`

  // El token tiene que coincidir con el provider_order_id guardado al crear la
  // orden: evita que alguien capture una orden ajena.
  if (order.provider_order_id !== paypalOrderId) {
    return redirectTo(appUrl, cancelPath)
  }

  if (order.status === "paid") {
    return redirectTo(appUrl, "/desk?compra=ok")
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
    console.error("[desk/paypal/capture] captura no completada", {
      status: captureRes.status,
      paypalStatus: captureData?.status,
      message: captureData?.message,
      deskOrderId: ourOrderId,
    })
    return redirectTo(appUrl, cancelPath)
  }

  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
  const paidAmount = Number(capture?.amount?.value)

  const result = await fulfillPaidDeskOrder({
    serviceClient,
    deskOrderId: ourOrderId,
    paidAmount,
    provider: "paypal",
  })

  if (result === "underpaid" || result === "not_found") {
    return redirectTo(appUrl, cancelPath)
  }

  return redirectTo(appUrl, "/desk?compra=ok")
}
