// Endpoint proxy a data912.com para datos en vivo de BYMA (acciones, bonos,
// CEDEARs). data912 NO envía cabeceras CORS, así que el navegador no puede
// leerlo directo; lo resolvemos server-side igual que hacemos con Frankfurter
// en /api/forex-rate. Ventajas: (a) sin problema de CORS, (b) cacheamos con
// Next, (c) no exponemos al cliente la dependencia del tercero — si mañana
// cambiamos de fuente, el cambio queda contenido en este archivo.
//
// Esto alimenta el terminal experimental en /lab/terminal.

import { NextRequest } from "next/server"

// Cache server-side corto: los precios intradiarios cambian seguido pero no
// necesitamos golpear data912 en cada request del cliente. 30s es buen balance.
export const revalidate = 30

// Solo permitimos paths conocidos de data912 (evita usar el route como proxy
// abierto a cualquier URL).
const ALLOW = [
  "arg_stocks",
  "arg_bonds",
  "arg_cedears",
  "arg_corp",
  "arg_letras",
  "arg_notes",
  "arg_mep",
] as const

type Allowed = (typeof ALLOW)[number]

function isAllowed(value: string | null): value is Allowed {
  return typeof value === "string" && (ALLOW as readonly string[]).includes(value)
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get("path")

  if (!isAllowed(path)) {
    return Response.json(
      { error: "path inválido", allow: ALLOW },
      { status: 400 },
    )
  }

  try {
    const r = await fetch(`https://data912.com/live/${path}`, {
      next: { revalidate: 30 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; FlowdexTerminal/1.0)",
      },
    })

    if (!r.ok) {
      return Response.json(
        { error: `data912 respondió ${r.status}.` },
        { status: 502 },
      )
    }

    const data = await r.json()
    if (!Array.isArray(data)) {
      return Response.json(
        { error: "Respuesta inesperada de data912." },
        { status: 502 },
      )
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    })
  } catch (err) {
    console.error("[byma]", err)
    return Response.json(
      { error: "No pudimos consultar BYMA." },
      { status: 502 },
    )
  }
}
