import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/journals?userId=<uuid>
// Devuelve el journal de un alumno (entradas con PnL, trades y notas) para que el
// profesor tenga criterio de dónde se traba. Solo admin; usa service-role para
// saltear el RLS (el journal está protegido por usuario).
export async function GET(request: Request) {
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

  const url = new URL(request.url)
  const userId = url.searchParams.get("userId")?.trim()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Falta SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Sin userId: lista de alumnos con actividad reciente (ordenados por última
  // entrada cargada), para clickear sin tener que buscar por email. El email lo
  // resuelve el panel desde su lista de usuarios.
  if (!userId) {
    const { data, error } = await admin
      .from("journal_entries")
      .select("user_id, updated_at")
      .order("updated_at", { ascending: false })
      .limit(500)

    if (error) {
      return NextResponse.json({ error: "No se pudo leer la actividad." }, { status: 500 })
    }

    const seen = new Set<string>()
    const recent: { user_id: string; last_active: string }[] = []
    for (const r of data ?? []) {
      if (!seen.has(r.user_id)) {
        seen.add(r.user_id)
        recent.push({ user_id: r.user_id, last_active: r.updated_at })
      }
    }
    return NextResponse.json({ recent })
  }

  const { data, error } = await admin
    .from("journal_entries")
    .select("id, entry_date, pnl_usd, trades_count, notes, updated_at")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "No se pudieron leer las entradas." }, { status: 500 })
  }

  return NextResponse.json({ entries: data ?? [] })
}
