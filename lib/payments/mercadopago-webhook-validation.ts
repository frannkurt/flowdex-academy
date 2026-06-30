import { createHmac, timingSafeEqual } from "crypto"

/**
 * Valida la firma de un webhook de MercadoPago.
 *
 * MP firma con HMAC-SHA256 usando MP_WEBHOOK_SECRET.
 * Header: x-signature = "ts=<timestamp>,v1=<hmac_hex>"
 * Header: x-request-id = "<uuid>"
 * Template: "id:<data_id>;request-id:<x-request-id>;ts:<ts>;"
 *
 * Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 *
 * Si MP_WEBHOOK_SECRET no está configurado, falla la validación.
 */
export function validateMercadoPagoSignature({
  request,
  dataId,
}: {
  request: Request
  dataId: string | null
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET

  // Fail-closed: nunca aceptar webhooks sin secret configurado
  if (!secret) {
    console.error("[mp-webhook] MP_WEBHOOK_SECRET no configurado")
    return false
  }

  const xSignature = request.headers.get("x-signature")
  const xRequestId = request.headers.get("x-request-id")

  if (!xSignature || !xRequestId) {
    console.warn("[mp-webhook] Headers x-signature o x-request-id ausentes")
    return false
  }

  // Parsear "ts=...,v1=..."
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [k, ...rest] = p.split("=")
      return [k.trim(), rest.join("=").trim()]
    })
  )

  const ts = parts["ts"]
  const v1 = parts["v1"]

  if (!ts || !v1) {
    console.warn("[mp-webhook] Formato de x-signature inválido")
    return false
  }

  const template = `id:${dataId ?? ""};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac("sha256", secret).update(template).digest("hex")

  // Comparación constant-time (evita el side-channel de timing del `===`).
  const expBuf = Buffer.from(expected, "utf8")
  const v1Buf = Buffer.from(v1, "utf8")
  return expBuf.length === v1Buf.length && timingSafeEqual(expBuf, v1Buf)
}
