// Endpoint proxy a Frankfurter.app (api.frankfurter.app) para fetchear
// cotizaciones FX server-side. Frankfurter usa los rates oficiales del
// ECB (Banco Central Europeo), publicados una vez al día, sin necesidad
// de API key ni rate limit relevante para nuestro uso.
//
// Lo usamos para auto-calcular el pip value en la Position Size Calculator
// cuando el par tiene QUOTE distinto a USD (USD/JPY, AUD/NZD, EUR/GBP, etc).
// Hacer el fetch desde el server tiene dos ventajas sobre llamar a
// Frankfurter directo desde el cliente: (a) podemos cachear con Next, (b)
// no exponemos al cliente la dependencia del tercero — si mañana cambiamos
// de proveedor, el cambio queda contenido en este archivo.
//
// Frankfurter NO tiene: oro (XAU), crypto, índices. Para esos pares el
// componente cliente cae al input manual de pip value.

import { NextRequest } from "next/server"

// Cache server-side: 1 hora. Los rates ECB son diarios, no necesitamos más
// frecuencia. Esto evita martillar la API de Frankfurter ante cambios de
// par del usuario y deja la latencia percibida en cero después del primer
// fetch del día.
export const revalidate = 3600

type RateResponse =
  | { rate: number; from: string; to: string; date: string; source: "frankfurter" }
  | { rate: 1; from: string; to: string; source: "identity" }

type ErrorResponse = { error: string }

function isValidCode(value: string | null): value is string {
  return typeof value === "string" && /^[A-Z]{3}$/.test(value)
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")?.toUpperCase() ?? null
  const to = searchParams.get("to")?.toUpperCase() ?? null

  if (!isValidCode(from) || !isValidCode(to)) {
    const err: ErrorResponse = { error: "Parámetros from/to inválidos (esperaba ISO-4217, ej USD)." }
    return Response.json(err, { status: 400 })
  }

  // Edge case: pedirse a sí mismo. Devolvemos 1 sin tocar la API.
  if (from === to) {
    const ok: RateResponse = { rate: 1, from, to, source: "identity" }
    return Response.json(ok)
  }

  try {
    const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`
    const r = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; FlowdexForex/1.0)",
      },
    })

    if (!r.ok) {
      // 404 típicamente significa que Frankfurter no soporta esa moneda
      // (no incluye XAU, crypto, índices). Devolvemos 404 también para
      // que el cliente sepa diferenciar "no soportado" de "error real".
      const status = r.status === 404 ? 404 : 502
      const err: ErrorResponse = {
        error:
          r.status === 404
            ? `Par ${from}/${to} no soportado por la fuente de precios.`
            : `Frankfurter respondió ${r.status}.`,
      }
      return Response.json(err, { status })
    }

    const data = (await r.json()) as { rates?: Record<string, number>; date?: string }
    const rate = data.rates?.[to]
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      const err: ErrorResponse = { error: "Respuesta de Frankfurter sin rate válido." }
      return Response.json(err, { status: 502 })
    }

    const ok: RateResponse = {
      rate,
      from,
      to,
      date: data.date ?? "",
      source: "frankfurter",
    }
    return Response.json(ok)
  } catch (err) {
    console.error("[forex-rate]", err)
    const errResponse: ErrorResponse = { error: "No pudimos consultar la cotización." }
    return Response.json(errResponse, { status: 502 })
  }
}
