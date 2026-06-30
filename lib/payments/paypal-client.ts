// Cliente PayPal mínimo sobre fetch (sin SDK, mismo criterio que MP/NOWPayments:
// cada dependencia ajena suma peso y superficie de fallo). Resuelve la base URL
// según el entorno y obtiene el access token OAuth para llamar la Orders API v2.

// PAYPAL_MODE controla sandbox vs producción. Default sandbox: nunca cobramos
// plata real por accidente si la env var falta.
export function getPaypalBaseUrl(): string {
  const mode = (process.env.PAYPAL_MODE ?? "sandbox").trim().toLowerCase()
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
}

export function getPaypalCredentials(): { clientId: string; secret: string } | null {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if (!clientId || !secret) return null
  return { clientId, secret }
}

// Intercambia client_id + secret por un access token. PayPal exige este token en
// el header Authorization de toda llamada a la Orders API.
export async function getPaypalAccessToken(): Promise<string | null> {
  const creds = getPaypalCredentials()
  if (!creds) return null

  const basic = Buffer.from(`${creds.clientId}:${creds.secret}`).toString("base64")

  const res = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = (await res.json().catch(() => null)) as { access_token?: string } | null
  if (!res.ok || !data?.access_token) {
    console.error("[paypal] no se pudo obtener access token", {
      status: res.status,
    })
    return null
  }

  return data.access_token
}
