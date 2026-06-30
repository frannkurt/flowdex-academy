import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Proxy admin → salud del Desk. El navegador no puede tener el token compartido,
// así que el panel pega acá (server-side): verificamos que el usuario sea admin
// y recién entonces consultamos el endpoint de salud del Desk (Python, Cloud Run)
// con el DESK_ADMIN_TOKEN. Solo lectura, sin side effects.

const DESK_URL = process.env.DESK_API_URL ?? "https://desk.flowdex.com.ar"

export async function GET() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Solo administradores." }, { status: 403 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Solo administradores." }, { status: 403 })
  }

  const token = process.env.DESK_ADMIN_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "DESK_ADMIN_TOKEN no configurado en el entorno de la Academy." },
      { status: 503 },
    )
  }

  try {
    const res = await fetch(`${DESK_URL}/api/admin/health`, {
      headers: { "X-Desk-Admin-Token": token },
      cache: "no-store",
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `El Desk respondió ${res.status}.` },
        { status: 502 },
      )
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    // El Desk puede estar dormido (escala a cero) o caído.
    return NextResponse.json(
      { error: "No se pudo contactar al Desk (¿dormido o caído?)." },
      { status: 502 },
    )
  }
}
