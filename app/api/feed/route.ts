// Proxy server-side para las fuentes de datos del terminal (/lab/terminal)
// que tienen CORS abierto pero que el CSP del sitio no permite consultar
// directo desde el navegador (connect-src restringido). Las servimos desde
// nuestro propio dominio para que queden same-origin ('self'), cacheadas y
// sin exponer al cliente la dependencia de terceros.
//
// data912 (acciones/bonos/CEDEARs) tiene su propio route en /api/byma porque
// además no envía cabeceras CORS.

import { NextRequest } from "next/server"

export const revalidate = 60

const SOURCES = {
  dolares: "https://dolarapi.com/v1/dolares",
  riesgo: "https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais",
  inflacion: "https://api.argentinadatos.com/v1/finanzas/indices/inflacion",
  plazofijo: "https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo",
  fci: "https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo",
  cripto:
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
  cripto_dolar: "https://criptoya.com/api/dolar",
} as const

type Src = keyof typeof SOURCES

function isSrc(v: string | null): v is Src {
  return typeof v === "string" && v in SOURCES
}

export async function GET(req: NextRequest): Promise<Response> {
  const src = req.nextUrl.searchParams.get("src")
  if (!isSrc(src)) {
    return Response.json(
      { error: "src inválido", allow: Object.keys(SOURCES) },
      { status: 400 },
    )
  }

  try {
    const r = await fetch(SOURCES[src], {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; FlowdexTerminal/1.0)",
      },
    })
    if (!r.ok) {
      return Response.json({ error: `Fuente respondió ${r.status}.` }, { status: 502 })
    }
    const data = await r.json()
    return Response.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch (err) {
    console.error("[feed]", src, err)
    return Response.json({ error: "No pudimos consultar la fuente." }, { status: 502 })
  }
}
