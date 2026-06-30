import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { runReengagement } from "@/lib/emails/reengagement"

// Dispara la pasada de re-enganche desde el panel de admin. Solo admins.
//
// POST con body { dryRun?: boolean }:
//   - dryRun=true  → calcula a quién le llegaría qué, sin mandar ni registrar.
//   - dryRun=false → manda los mails y registra en engagement_emails.
//
// Es POST (no GET) porque manda mails reales: un GET podía dispararse por
// prefetch del navegador.
export async function POST(request: Request) {
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

  const body = (await request.json().catch(() => null)) as { dryRun?: boolean } | null
  const dryRun = body?.dryRun ?? false

  const summary = await runReengagement({ dryRun })

  return NextResponse.json(summary, { status: summary.ok ? 200 : 500 })
}
