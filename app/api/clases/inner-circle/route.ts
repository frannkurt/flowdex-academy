import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { INNER_CIRCLE_CLASS_URL } from "@/lib/courses/class-scheduling"

export const dynamic = "force-dynamic"

// GET /api/clases/inner-circle
//
// Gate server-side del link de sesiones semanales del Inner Circle. No valida
// progreso de módulos (las sesiones son recurrentes para miembros), sino acceso
// activo al IC. Recién ahí redirige al link real, que vive server-only en
// lib/courses/class-scheduling.

export async function GET(request: Request) {
  const dashboardUrl = new URL("/dashboard", request.url)

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.redirect(dashboardUrl)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL("/login?returnTo=/dashboard", request.url))
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", "inner-circle")
    .maybeSingle()
  if (!course) {
    return NextResponse.redirect(dashboardUrl)
  }

  const nowIso = new Date().toISOString()
  const { data: userCourse } = await supabase
    .from("user_courses")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .limit(1)
    .maybeSingle()
  if (!userCourse) {
    return NextResponse.redirect(new URL("/dashboard?clase=sin-acceso-ic", request.url))
  }

  return NextResponse.redirect(INNER_CIRCLE_CLASS_URL)
}
