import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import { hasEffectiveMembershipAccess, type CommunityAccessRow } from "@/lib/community-access"
import {
  COURSE_TO_TELEGRAM_COMMUNITY,
  TELEGRAM_INVITE_TTL_SECONDS,
  TelegramCourseSlug,
  getCandidateChatIdsForCourse,
} from "@/lib/telegram/config"
import { createOneTimeInvite, TelegramApiError } from "@/lib/telegram/api"

export const dynamic = "force-dynamic"

/**
 * POST /api/telegram/invite/[courseSlug]
 *
 * Genera un invite link único de Telegram para el usuario logueado, siempre
 * que tenga el curso indicado activo en user_courses.
 *
 * Devuelve { inviteLink, expiresAt } o un error.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseSlug: string }> }
) {
  const { courseSlug } = await context.params

  // 1) Slug válido
  if (!(courseSlug in COURSE_TO_TELEGRAM_COMMUNITY)) {
    return NextResponse.json(
      { error: "Curso no válido para integración con Telegram" },
      { status: 400 }
    )
  }
  const slug = courseSlug as TelegramCourseSlug

  // 2) Usuario autenticado
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  // 3) Curso existe y usuario tiene acceso activo (con expiración)
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 })
  }

  const nowIso = new Date().toISOString()
  const { data: userCourse } = await supabase
    .from("user_courses")
    .select("user_id, is_active, expires_at")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .maybeSingle()

  if (!userCourse) {
    if (slug !== "membresia") {
      return NextResponse.json({ error: "No tenés acceso a este curso" }, { status: 403 })
    }

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
      return NextResponse.json({ error: "No tenés acceso a este curso" }, { status: 403 })
    }
  }

  if (!userCourse) {
    // Seguimos con el fallback inferido desde inner-circle si no existe la fila
    // explícita de membresía todavía.
  } else if (userCourse.expires_at && userCourse.expires_at < nowIso) {
    return NextResponse.json({ error: "No tenés acceso a este curso" }, { status: 403 })
  }

  if (userCourse?.expires_at && userCourse.expires_at < nowIso) {
    return NextResponse.json(
      { error: "Tu acceso a este curso expiró" },
      { status: 403 }
    )
  }

  // 4) Chat configurado
  const candidateChatIds = getCandidateChatIdsForCourse(slug)
  if (candidateChatIds.length === 0) {
    return NextResponse.json(
      { error: "Canal de Telegram no configurado para este curso" },
      { status: 500 }
    )
  }

  // 5) Generar invite
  // Construimos un invite_name único por (user, community) que el webhook va a
  // usar para mapear back al user de Flowdex cuando alguien acepte el invite.
  // 22 chars de hex del UUID + 3 chars de comunidad = colisión negligible.
  const community = COURSE_TO_TELEGRAM_COMMUNITY[slug]
  const userIdHex = user.id.replace(/-/g, "").slice(0, 22)
  const communityCode = community.slice(0, 3) // 'inn', 'tra', 'inv'
  const inviteName = `fdx-${userIdHex}-${communityCode}`

  try {
    let invite = null
    let chosenChatId: string | null = null
    let lastError: unknown = null

    for (const chatId of candidateChatIds) {
      try {
        invite = await createOneTimeInvite({
          chatId,
          expiresInSeconds: TELEGRAM_INVITE_TTL_SECONDS,
          name: inviteName,
        })
        chosenChatId = chatId
        break
      } catch (err) {
        lastError = err

        const isChatNotFound =
          err instanceof TelegramApiError &&
          err.description.toLowerCase().includes("chat not found")

        if (isChatNotFound) {
          console.warn("[telegram/invite] chat_id inválido, probando fallback", {
            userId: user.id,
            slug,
            failedChatId: chatId,
          })
          continue
        }

        throw err
      }
    }

    if (!invite || !chosenChatId) {
      throw lastError instanceof Error
        ? lastError
        : new Error("No se pudo generar invite con ningún chat_id candidato")
    }

    // Guardar/actualizar el mapping pending — el webhook lo va a completar
    // cuando el usuario realmente entre al grupo via el invite.
    // No pisamos telegram_user_id/joined_at/kicked_at si ya existen (porque
    // significa que ya entró antes).
    const admin = createSupabaseAdminClient()
    if (admin) {
      const { error: upsertErr } = await admin.from("telegram_memberships").upsert(
        {
          user_id: user.id,
          community,
          chat_id: chosenChatId,
          invite_name: inviteName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,community" }
      )
      if (upsertErr) {
        console.error("[telegram/invite] error guardando pending membership", {
          userId: user.id,
          slug,
          err: upsertErr.message,
        })
        // No fallamos la request — el usuario igual puede entrar, solo perdemos tracking.
      }
    }

    console.log("[telegram/invite] invite generado", {
      userId: user.id,
      slug,
      chatId: chosenChatId,
      inviteName,
      link: invite.invite_link,
      memberLimit: invite.member_limit,
      isRevoked: invite.is_revoked,
    })

    return NextResponse.json({
      inviteLink: invite.invite_link,
    })
  } catch (err) {
    console.error("[telegram/invite] error generando invite", {
      userId: user.id,
      slug,
      err: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { error: "No se pudo generar el link de invitación. Probá de nuevo en unos minutos." },
      { status: 500 }
    )
  }
}
