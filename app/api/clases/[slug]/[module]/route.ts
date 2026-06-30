import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { resolveProgressCourseConfig } from "@/lib/courses/progress-course-config"
import { getClassMilestone } from "@/lib/courses/class-scheduling"

export const dynamic = "force-dynamic"

// GET /api/clases/[slug]/[module]
//
// Gate server-side del agendado de clases. Valida que el alumno tenga acceso
// activo al curso y que su progreso en la base incluya los módulos requeridos
// por ese milestone. Recién ahí redirige a la URL real de Cal.com (que vive
// server-only en lib/courses/class-scheduling). Si no cumple, vuelve al curso.

function normalizeCompletedModules(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1)
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; module: string }> }
) {
  const { slug, module: moduleParam } = await context.params
  const normalizedSlug = slug.trim().toLowerCase()
  const moduleNumber = Number.parseInt(moduleParam, 10)

  const courseUrl = new URL(`/courses/${normalizedSlug}`, request.url)

  // 1) Milestone válido para ese curso + módulo
  const milestone = Number.isInteger(moduleNumber)
    ? getClassMilestone(normalizedSlug, moduleNumber)
    : null
  if (!milestone) {
    return NextResponse.redirect(courseUrl)
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.redirect(courseUrl)
  }

  // 2) Sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?returnTo=/courses/${normalizedSlug}`, request.url)
    )
  }

  // 3) Resolver course_id de progreso y de acceso (mismo patrón que /api/progress)
  const config = resolveProgressCourseConfig(normalizedSlug)
  const requestedSlugs = Array.from(new Set([config.progressSlug, config.accessSlug]))
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug")
    .in("slug", requestedSlugs)

  const bySlug = new Map((courses ?? []).map((c) => [c.slug as string, c.id as string]))
  const progressCourseId = bySlug.get(config.progressSlug)
  const accessCourseId = bySlug.get(config.accessSlug)
  if (!progressCourseId || !accessCourseId) {
    return NextResponse.redirect(courseUrl)
  }

  // 4) Acceso activo al curso
  const nowIso = new Date().toISOString()
  const { data: userCourse } = await supabase
    .from("user_courses")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("course_id", accessCourseId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .limit(1)
    .maybeSingle()
  if (!userCourse) {
    return NextResponse.redirect(new URL("/dashboard?error=acceso_vencido", request.url))
  }

  // 5) Progreso: ¿completó los módulos requeridos?
  const { data: progress } = await supabase
    .from("course_progress")
    .select("completed_modules")
    .eq("user_id", user.id)
    .eq("course_id", progressCourseId)
    .maybeSingle()

  const completed = normalizeCompletedModules(progress?.completed_modules ?? [])
  const eligible = milestone.requiredModules.every((m) => completed.includes(m))

  if (!eligible) {
    return NextResponse.redirect(
      new URL(`/courses/${normalizedSlug}?m=${moduleNumber}&clase=incompleta`, request.url)
    )
  }

  // 6) OK: redirigimos al link real de Cal.com
  return NextResponse.redirect(milestone.url)
}
