import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET  /api/inner-circle/manifesto  → { accepted: boolean }
// POST /api/inner-circle/manifesto  → registra la aceptación (idempotente)
//
// Persiste la aceptación del manifiesto del IC en base (antes localStorage),
// para que sea real, cross-device y quede registro. RLS asegura que cada uno
// solo toca su propia fila.

export async function GET() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ accepted: false }, { status: 200 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ accepted: false }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("inner_circle_manifesto")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  // Si la tabla no existe todavía (migración no corrida), no rompemos: el front
  // sigue funcionando con su fallback local.
  if (error && error.code === "42P01") {
    return NextResponse.json({ accepted: false, source: "table-missing" })
  }

  return NextResponse.json({ accepted: Boolean(data) })
}

export async function POST() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  const { error } = await supabase
    .from("inner_circle_manifesto")
    .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true })

  if (error && error.code === "42P01") {
    return NextResponse.json({ ok: true, source: "table-missing" })
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
