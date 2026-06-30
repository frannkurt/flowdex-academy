import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import {
  COURSE_TO_COMMUNITY,
  DISCORD_SLUG_COOKIE,
  DISCORD_STATE_COOKIE,
  DiscordCourseSlug,
  getRoleIdForCourse,
} from "@/lib/discord/config"
import {
  addMemberWithRole,
  exchangeCodeForToken,
  getDiscordUser,
} from "@/lib/discord/api"

export const dynamic = "force-dynamic"

/**
 * GET /api/discord/callback?code=...&state=...
 *
 * Recibe el callback de Discord después de que el usuario autoriza.
 * Pasos:
 * 1. Validar state contra la cookie
 * 2. Recuperar el slug del curso desde la cookie
 * 3. Intercambiar el code por un access_token
 * 4. Obtener la info del usuario de Discord
 * 5. Guardar la conexión en discord_connections
 * 6. Agregar al usuario al server con el rol correcto
 * 7. Registrar el grant en discord_role_grants
 * 8. Redirigir de vuelta al dashboard con feedback
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const errorParam = searchParams.get("error")

  const dashboardUrl = new URL("/dashboard", request.url)

  // El usuario canceló la autorización en Discord
  if (errorParam) {
    dashboardUrl.searchParams.set("discord", "cancelled")
    return NextResponse.redirect(dashboardUrl)
  }

  if (!code || !state) {
    dashboardUrl.searchParams.set("discord", "invalid")
    return NextResponse.redirect(dashboardUrl)
  }

  // 1) Validar state vs cookie
  const cookieState = request.cookies.get(DISCORD_STATE_COOKIE)?.value
  const cookieSlug = request.cookies.get(DISCORD_SLUG_COOKIE)?.value

  if (!cookieState || cookieState !== state) {
    dashboardUrl.searchParams.set("discord", "state-mismatch")
    return NextResponse.redirect(dashboardUrl)
  }

  if (!cookieSlug || !(cookieSlug in COURSE_TO_COMMUNITY)) {
    dashboardUrl.searchParams.set("discord", "invalid-course")
    return NextResponse.redirect(dashboardUrl)
  }
  const slug = cookieSlug as DiscordCourseSlug

  // 2) Verificar autenticación del usuario en Flowdex
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    dashboardUrl.searchParams.set("discord", "auth-error")
    return NextResponse.redirect(dashboardUrl)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/dashboard", request.url))
  }

  // 3) Verificar role ID configurado
  const roleId = getRoleIdForCourse(slug)
  if (!roleId) {
    dashboardUrl.searchParams.set("discord", "missing-role-config")
    return NextResponse.redirect(dashboardUrl)
  }

  try {
    // 4) Intercambiar code por access_token
    const token = await exchangeCodeForToken(code)

    // 5) Obtener info del usuario de Discord
    const discordUser = await getDiscordUser(token.access_token)

    // 6) Guardar/actualizar la conexión Flowdex ↔ Discord
    const admin = createSupabaseAdminClient()
    if (!admin) {
      throw new Error("Supabase admin client no disponible")
    }

    await admin.from("discord_connections").upsert(
      {
        user_id: user.id,
        discord_user_id: discordUser.id,
        discord_username: discordUser.username,
        discord_global_name: discordUser.global_name ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    // 7) Agregar al server con el rol (o solo asignar rol si ya está adentro)
    await addMemberWithRole({
      discordUserId: discordUser.id,
      accessToken: token.access_token,
      roleId,
    })

    // 8) Registrar el grant en la base
    await admin.from("discord_role_grants").upsert(
      {
        user_id: user.id,
        course_slug: slug,
        role_id: roleId,
        granted_at: new Date().toISOString(),
        revoked_at: null,
      },
      { onConflict: "user_id,course_slug" }
    )

    // 9) Limpiar cookies y redirigir con éxito
    const response = NextResponse.redirect(
      new URL(`/dashboard?discord=connected&slug=${slug}`, request.url)
    )
    response.cookies.delete(DISCORD_STATE_COOKIE)
    response.cookies.delete(DISCORD_SLUG_COOKIE)
    return response
  } catch (err) {
    console.error("[discord/callback] error:", err)
    dashboardUrl.searchParams.set("discord", "error")
    dashboardUrl.searchParams.set(
      "discord_msg",
      err instanceof Error ? err.message.slice(0, 200) : "unknown"
    )
    return NextResponse.redirect(dashboardUrl)
  }
}
