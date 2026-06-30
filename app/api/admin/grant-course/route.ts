import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"

type GrantCourseBody = {
  targetUserId?: string
  courseSlug?: string
}

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

  let body: GrantCourseBody

  try {
    body = (await request.json()) as GrantCourseBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const targetUserId = body.targetUserId?.trim()
  const courseSlug = body.courseSlug?.trim().toLowerCase()

  if (!targetUserId || !courseSlug) {
    return NextResponse.json({ error: "targetUserId y courseSlug son obligatorios." }, { status: 400 })
  }

  if (isInternalProgressOnlyCourseSlug(courseSlug)) {
    return NextResponse.json({ error: "Curso no disponible para asignacion manual." }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Falta SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: course, error: courseError } = await adminClient
    .from("courses")
    .select("id, name, slug")
    .eq("slug", courseSlug)
    .maybeSingle()

  if (courseError) {
    return NextResponse.json({ error: courseError.message }, { status: 400 })
  }

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 })
  }

  const { error: grantError } = await adminClient.from("user_courses").upsert(
    {
      user_id: targetUserId,
      course_id: course.id,
      is_active: true,
      granted_at: new Date().toISOString(),
      expires_at: getCourseAccessExpiryDate(course.slug).toISOString(),
    },
    {
      onConflict: "user_id,course_id",
    }
  )

  if (grantError) {
    return NextResponse.json({ error: grantError.message }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    grantedBy: user.email,
    course: {
      id: course.id,
      name: course.name,
      slug: course.slug,
    },
  })
}
