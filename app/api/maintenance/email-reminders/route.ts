import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendMembershipExpiringSoon, sendCourseExpiringSoon } from "@/lib/emails/send"

// Aseguramos que Vercel Cron no cachee la respuesta y siempre ejecute la lógica real.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Cron diario que envía recordatorios de vencimiento.
 *
 * - Membresía (slug = "membresia") que vence en 3 días → email "tu membresía vence en 3 días".
 * - Otros cursos que vencen en 7 días → email "te quedan 7 días".
 *
 * Idempotencia: como el cron corre 1 vez al día, la ventana de búsqueda es
 * de 24 hs exactas para cada evento. Si el cron falla un día, el usuario no
 * recibe el aviso para esa fecha, pero no hay duplicados.
 */

const MEMBERSHIP_SLUG = "membresia"
const MEMBERSHIP_WINDOW_DAYS = 3
const COURSE_WINDOW_DAYS = 7

const UPGRADE_PATHS: Record<string, { slug: string; name: string }> = {
  "kickstart-investment": { slug: "expert-investment", name: "Expert Investment" },
  "kickstart-trading": { slug: "trading-lab", name: "Trading Lab" },
  "expert-investment": { slug: "inner-circle", name: "Inner Circle" },
  "trading-lab": { slug: "inner-circle", name: "Inner Circle" },
}

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  const authHeader = request.headers.get("authorization") ?? ""
  return authHeader === `Bearer ${cronSecret}`
}

type ExpiringRow = {
  user_id: string
  expires_at: string
  courses: { slug: string } | { slug: string }[] | null
}

function pickSlug(row: ExpiringRow): string | null {
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
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Ventana de búsqueda: vencen entre [hoy + N días, hoy + N días + 1 día).
  // Eso asegura que cada user_course se procese 1 sola vez en su vida útil.
  const now = new Date()

  const windowStart = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + days)
    d.setHours(0, 0, 0, 0)
    return d
  }
  const windowEnd = (days: number) => {
    const d = windowStart(days)
    d.setDate(d.getDate() + 1)
    return d
  }

  // Helper para buscar rows que expiran en una ventana
  async function fetchExpiringRows(days: number): Promise<ExpiringRow[]> {
    const from = windowStart(days).toISOString()
    const to = windowEnd(days).toISOString()

    const { data, error } = await adminClient
      .from("user_courses")
      .select("user_id, expires_at, courses(slug)")
      .eq("is_active", true)
      .gte("expires_at", from)
      .lt("expires_at", to)

    if (error) {
      console.error("[email-reminders] error fetching expiring rows", { days, error })
      return []
    }

    return (data ?? []) as ExpiringRow[]
  }

  const [membershipRows, courseRows] = await Promise.all([
    fetchExpiringRows(MEMBERSHIP_WINDOW_DAYS),
    fetchExpiringRows(COURSE_WINDOW_DAYS),
  ])

  // Filtrar: membresía solo los de slug "membresia"; cursos solo los OTROS.
  const membershipToNotify = membershipRows.filter((row) => pickSlug(row) === MEMBERSHIP_SLUG)
  const coursesToNotify = courseRows.filter((row) => {
    const slug = pickSlug(row)
    return slug !== null && slug !== MEMBERSHIP_SLUG
  })

  // Cargar perfiles en un solo query
  const allUserIds = Array.from(
    new Set([...membershipToNotify, ...coursesToNotify].map((row) => row.user_id))
  )
  const profileByUserId = new Map<string, { email: string | null; full_name: string | null }>()
  if (allUserIds.length > 0) {
    const { data: profilesData } = await adminClient
      .from("profiles")
      .select("id, email, full_name")
      .in("id", allUserIds)

    const profiles = (profilesData ?? []) as Array<{
      id: string
      email: string | null
      full_name: string | null
    }>
    for (const profile of profiles) {
      profileByUserId.set(profile.id, { email: profile.email, full_name: profile.full_name })
    }
  }

  let membershipSent = 0
  let coursesSent = 0

  for (const row of membershipToNotify) {
    const profile = profileByUserId.get(row.user_id)
    if (!profile?.email) continue

    const ok = await sendMembershipExpiringSoon({
      to: profile.email,
      firstName: profile.full_name?.split(" ")[0] ?? null,
      expiresAt: row.expires_at,
    })
    if (ok) membershipSent += 1
  }

  for (const row of coursesToNotify) {
    const slug = pickSlug(row)
    if (!slug) continue
    const profile = profileByUserId.get(row.user_id)
    if (!profile?.email) continue

    const upgrade = UPGRADE_PATHS[slug] ?? null

    const ok = await sendCourseExpiringSoon({
      to: profile.email,
      firstName: profile.full_name?.split(" ")[0] ?? null,
      courseSlug: slug,
      expiresAt: row.expires_at,
      upgradeSlug: upgrade?.slug ?? null,
      upgradeName: upgrade?.name ?? null,
    })
    if (ok) coursesSent += 1
  }

  console.log("[email-reminders] ejecutado", {
    membershipFound: membershipToNotify.length,
    membershipSent,
    coursesFound: coursesToNotify.length,
    coursesSent,
    executedAt: now.toISOString(),
  })

  return NextResponse.json({
    ok: true,
    membershipFound: membershipToNotify.length,
    membershipSent,
    coursesFound: coursesToNotify.length,
    coursesSent,
    executedAt: now.toISOString(),
  })
}
