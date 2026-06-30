import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { hasEffectiveMembershipAccess, type CommunityAccessRow } from "@/lib/community-access"
import {
  COURSE_TO_COMMUNITY,
  DISCORD_OAUTH_SCOPES,
  DISCORD_SLUG_COOKIE,
  DISCORD_STATE_COOKIE,
  DiscordCourseSlug,
  getRedirectUri,
} from "@/lib/discord/config"

export const dynamic = "force-dynamic"

/**
 * GET /api/discord/connect/[courseSlug]
 *
 * Inicia el flow de OAuth de Discord para conectar la cuenta del alumno y
 * asignarle el rol del curso indicado.
 *
 * Pasos:
 * 1. Verificar que el usuario está logueado en Flowdex
 * 2. Verificar que el slug es válido y el alumno posee el curso
 * 3. Generar un state token (CSRF protection), guardarlo en cookie
 * 4. Guardar también el slug en cookie para recuperarlo en el callback
 * 5. Redirigir al usuario a la pantalla de autorización de Discord
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseSlug: string }> }
) {
  const { courseSlug } = await context.params

  // 1) Validar slug
  if (!(courseSlug in COURSE_TO_COMMUNITY)) {
    return NextResponse.json(
      { error: "Curso no válido para integración con Discord" },
      { status: 400 }
    )
  }
  const slug = courseSlug as DiscordCourseSlug

  // 2) Verificar autenticación del usuario en Flowdex
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase no configurado" },
      { status: 500 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/dashboard", request.url))
  }

  // 3) Verificar que el usuario tiene acceso al curso
  // Busca el course_id desde el slug y verifica que existe un user_courses activo
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (!course) {
    return NextResponse.json(
      { error: "Curso no encontrado en el catálogo" },
      { status: 404 }
    )
  }

  const { data: userCourse } = await supabase
    .from("user_courses")
    .select("user_id, is_active, expires_at")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .maybeSingle()

  const nowIso = new Date().toISOString()

  if (!userCourse && slug !== "membresia") {
    return NextResponse.json(
      { error: "No tenés acceso a este curso" },
      { status: 403 }
    )
  }

  if (!userCourse && slug === "membresia") {
    const { data: membershipRows } = await supabase
      .from("user_courses")
      .select("is_active, granted_at, expires_at, courses(slug)")
      .eq("user_id", user.id)

    const accessRows = ((membershipRows ?? []) as Array<{
      is_active: boolean | null
      granted_at: string | null
      expires_at: string | null
      courses:
        | { slug: string | null }
        | Array<{ slug: string | null }>
        | null
    }>).map((row) => ({
      slug: Array.isArray(row.courses) ? (row.courses[0]?.slug ?? null) : (row.courses?.slug ?? null),
      grantedAt: row.granted_at,
      expiresAt: row.expires_at,
      isActive: row.is_active,
    })) satisfies CommunityAccessRow[]

    if (!hasEffectiveMembershipAccess(accessRows)) {
      return NextResponse.json(
        { error: "No tenés acceso a este curso" },
        { status: 403 }
      )
    }
  }

  if (slug === "membresia" && userCourse?.expires_at && userCourse.expires_at < nowIso) {
    return NextResponse.json(
      { error: "Tu acceso a este curso expiró" },
      { status: 403 }
    )
  }

  // 4) Verificar configuración de Discord
  const clientId = process.env.DISCORD_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: "DISCORD_CLIENT_ID no configurado en env vars" },
      { status: 500 }
    )
  }

  // 5) Generar state token y armar la URL de OAuth de Discord
  const state = randomBytes(24).toString("hex")
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: DISCORD_OAUTH_SCOPES.join(" "),
    state,
    prompt: "consent",
  })
  const discordOAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`

  // 6) Setear cookies (state + slug) y redirigir
  const response = NextResponse.redirect(discordOAuthUrl)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10, // 10 minutos
  }
  response.cookies.set(DISCORD_STATE_COOKIE, state, cookieOptions)
  response.cookies.set(DISCORD_SLUG_COOKIE, slug, cookieOptions)
  return response
}
