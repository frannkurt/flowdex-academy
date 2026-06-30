import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revokeTelegramMembership } from "@/lib/telegram/membership-revoke"
import { revokeDiscordRoleForCourse } from "@/lib/discord/membership-revoke"
import { sendAccessRevoked } from "@/lib/emails/send"

// Aseguramos que Vercel Cron no cachee la respuesta y siempre ejecute la lógica real.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Slug que dispara revoke de Discord+Telegram cuando expira.
// Cambió de "inner-circle" (que era el curso de 12 meses) a "membresia" (30 días).
// El curso inner-circle sigue activo 12 meses para que el alumno acceda al contenido,
// pero la comunidad (Discord + Telegram) sólo está abierta mientras dura la membresia.
const MEMBRESIA_SLUG = "membresia"

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    // If there is no secret configured, avoid exposing a public maintenance endpoint.
    return false
  }

  const authHeader = request.headers.get("authorization") ?? ""
  return authHeader === `Bearer ${cronSecret}`
}

type ExpiredCourseRow = {
  user_id: string
  course_id: string
  courses:
    | { slug: string | null }
    | Array<{ slug: string | null }>
    | null
}

function pickSlug(row: ExpiredCourseRow): string | null {
  if (!row.courses) return null
  if (Array.isArray(row.courses)) return row.courses[0]?.slug ?? null
  return row.courses.slug ?? null
}

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Servidor no configurado." }, { status: 500 })
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const nowIso = new Date().toISOString()

  // 1) Encontrar los user_courses expirados (sin actualizar todavía) con su slug
  //    asociado para poder identificar a los de inner-circle y revocarles Discord/Telegram.
  const { data: expiredRows, error: fetchError } = await adminClient
    .from("user_courses")
    .select("user_id, course_id, courses(slug)")
    .eq("is_active", true)
    .not("expires_at", "is", null)
    .lte("expires_at", nowIso)

  if (fetchError) {
    console.error("[revoke-expired-access] error fetching expired rows", fetchError)
    return NextResponse.json(
      { error: "No se pudo consultar accesos vencidos." },
      { status: 500 }
    )
  }

  const rows = (expiredRows ?? []) as ExpiredCourseRow[]

  // Buscar emails de los usuarios que vamos a revocar, en un solo query.
  // Se usan más adelante para el aviso de "tu acceso terminó".
  const userIds = Array.from(new Set(rows.map((row) => row.user_id)))
  const profileByUserId = new Map<string, { email: string | null; full_name: string | null }>()
  if (userIds.length > 0) {
    const { data: profilesData } = await adminClient
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds)

    const profiles = (profilesData ?? []) as Array<{
      id: string
      email: string | null
      full_name: string | null
    }>
    for (const profile of profiles) {
      profileByUserId.set(profile.id, { email: profile.email, full_name: profile.full_name })
    }
  }

  // 2) Para cada user_course de inner-circle expirado, revocar Telegram + Discord.
  //    Los otros cursos (trading-lab, kickstart-*, expert-*) no revocan acceso a
  //    comunidades — los alumnos pueden quedarse en sus grupos.
  type RevokeOutcome = {
    userId: string
    slug: string | null
    telegram: { ok: boolean; reason?: string }
    discord: { ok: boolean; reason?: string }
  }
  const revokeOutcomes: RevokeOutcome[] = []

  for (const row of rows) {
    const slug = pickSlug(row)
    if (slug !== MEMBRESIA_SLUG) continue

    const tgResult = await revokeTelegramMembership({
      admin: adminClient,
      userId: row.user_id,
      community: "inner-circle",
    })

    const dsResult = await revokeDiscordRoleForCourse({
      admin: adminClient,
      userId: row.user_id,
      courseSlug: MEMBRESIA_SLUG,
    })

    revokeOutcomes.push({
      userId: row.user_id,
      slug,
      telegram: tgResult.kicked
        ? { ok: true }
        : { ok: false, reason: tgResult.reason },
      discord: dsResult.revoked
        ? { ok: true }
        : { ok: false, reason: dsResult.reason },
    })
  }

  // 3) Marcar TODOS los user_courses expirados como inactivos (independiente del slug).
  const { data: updatedData, error: updateError } = await adminClient
    .from("user_courses")
    .update({ is_active: false })
    .eq("is_active", true)
    .not("expires_at", "is", null)
    .lte("expires_at", nowIso)
    .select("user_id, course_id")

  if (updateError) {
    console.error("[revoke-expired-access] error updating", updateError)
    return NextResponse.json(
      { error: "No se pudo revocar accesos vencidos." },
      { status: 500 }
    )
  }

  // 4) Email de "acceso revocado" a cada usuario afectado.
  //    Fire-and-forget: si Resend falla, NO bloquea la respuesta.
  let emailsSent = 0
  for (const row of rows) {
    const slug = pickSlug(row)
    if (!slug) continue
    const profile = profileByUserId.get(row.user_id)
    if (!profile?.email) continue

    try {
      const ok = await sendAccessRevoked({
        to: profile.email,
        firstName: profile.full_name?.split(" ")[0] ?? null,
        courseSlug: slug,
      })
      if (ok) emailsSent += 1
    } catch (error) {
      console.error("[revoke-expired-access] email failed", { userId: row.user_id, error })
    }
  }

  console.log("[revoke-expired-access] ejecutado", {
    totalRevoked: updatedData?.length ?? 0,
    innerCircleRevokes: revokeOutcomes.length,
    emailsSent,
    executedAt: nowIso,
  })

  return NextResponse.json({
    ok: true,
    revoked: updatedData?.length ?? 0,
    innerCircleRevokes: revokeOutcomes.length,
    revokeDetails: revokeOutcomes,
    emailsSent,
    executedAt: nowIso,
  })
}
