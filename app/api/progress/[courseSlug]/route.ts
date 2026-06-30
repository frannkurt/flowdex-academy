import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { resolveProgressCourseConfig } from "@/lib/courses/progress-course-config"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import { getTotalModulesBySlug } from "@/lib/courses/module-counts"
import { sendCourseCompleted } from "@/lib/emails/send"

// Cursos que disparan el mail de felicitación al completarse al 100%. Los
// sub-cursos internos del IC quedan afuera (el IC se celebra distinto).
const COMPLETION_EMAIL_SLUGS = new Set([
  "kickstart-investment",
  "kickstart-trading",
  "expert-investment",
  "trading-lab",
])

type ProgressPayload = {
  completedModules?: unknown
}

function normalizeCompletedModules(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 1)
    )
  ).sort((a, b) => a - b)
}

async function resolveCourseIds(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  slug: string
) {
  const config = resolveProgressCourseConfig(slug)
  const requestedSlugs = Array.from(new Set([config.progressSlug, config.accessSlug]))

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug")
    .in("slug", requestedSlugs)

  if (error || !courses || courses.length === 0) {
    return null
  }

  const bySlug = new Map(
    courses.map((course) => [course.slug as string, course.id as string])
  )

  const progressCourseId = bySlug.get(config.progressSlug)
  const accessCourseId = bySlug.get(config.accessSlug)

  if (!progressCourseId || !accessCourseId) {
    return null
  }

  return {
    progressCourseId,
    accessCourseId,
  }
}

export async function GET(_: Request, context: { params: Promise<{ courseSlug: string }> }) {
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

  const { courseSlug } = await context.params
  const normalizedSlug = courseSlug.trim().toLowerCase()
  const courseIds = await resolveCourseIds(supabase, normalizedSlug)

  if (!courseIds) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("course_progress")
    .select("completed_modules")
    .eq("user_id", user.id)
    .eq("course_id", courseIds.progressCourseId)
    .maybeSingle()

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({ completedModules: [], source: "local-fallback" })
    }

    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    completedModules: normalizeCompletedModules(data?.completed_modules ?? []),
    source: "database",
  })
}

export async function PUT(request: Request, context: { params: Promise<{ courseSlug: string }> }) {
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

  const { courseSlug } = await context.params
  const normalizedSlug = courseSlug.trim().toLowerCase()
  const courseIds = await resolveCourseIds(supabase, normalizedSlug)

  if (!courseIds) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 })
  }

  let payload: ProgressPayload

  try {
    payload = (await request.json()) as ProgressPayload
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const completedModules = normalizeCompletedModules(payload.completedModules)

  const nowIso = new Date().toISOString()
  const { data: userCourse } = await supabase
    .from("user_courses")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("course_id", courseIds.accessCourseId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .limit(1)
    .maybeSingle()

  if (!userCourse) {
    return NextResponse.json({ error: "No tienes acceso activo a este curso." }, { status: 403 })
  }

  const { error } = await supabase.from("course_progress").upsert(
    {
      user_id: user.id,
      course_id: courseIds.progressCourseId,
      completed_modules: completedModules,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" }
  )

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({ ok: true, source: "local-fallback" })
    }

    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Si con esta actualización el alumno completó el 100% del curso, mandamos
  // el mail de felicitación (medalla + aviso de certificado). Una sola vez por
  // usuario+curso: queda registrado en engagement_emails y además hay unique
  // index en la DB, así que desmarcar/re-marcar módulos no lo duplica.
  // Cualquier falla acá NO rompe el guardado de progreso.
  try {
    const config = resolveProgressCourseConfig(normalizedSlug)
    const totalModules = getTotalModulesBySlug(config.progressSlug)
    const completedCount = completedModules.filter((m) => m <= totalModules).length

    if (
      totalModules > 0 &&
      completedCount >= totalModules &&
      COMPLETION_EMAIL_SLUGS.has(config.progressSlug) &&
      user.email
    ) {
      const adminClient = createSupabaseAdminClient()
      if (adminClient) {
        const { data: already, error: checkError } = await adminClient
          .from("engagement_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("kind", "course_completed")
          .eq("course_slug", config.progressSlug)
          .limit(1)
          .maybeSingle()

        // Si la tabla no existe todavía (migración pendiente), no mandamos:
        // sin registro no hay idempotencia y se duplicaría en cada toggle.
        if (!checkError && !already) {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle()

          const ok = await sendCourseCompleted({
            to: user.email,
            firstName:
              (profile as { full_name: string | null } | null)?.full_name?.trim().split(" ")[0] ||
              null,
            courseSlug: config.progressSlug,
          })

          if (ok) {
            await adminClient.from("engagement_emails").insert({
              user_id: user.id,
              kind: "course_completed",
              step: 1,
              course_slug: config.progressSlug,
            })
          }
        }
      }
    }
  } catch {
    // Silencioso a propósito: el mail es un extra, el progreso ya se guardó.
  }

  return NextResponse.json({ ok: true, source: "database" })
}
