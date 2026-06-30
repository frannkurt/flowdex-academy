import { MessageCircle } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  COMMUNITY_LABELS,
  COURSE_TO_COMMUNITY,
  DiscordCommunity,
  DiscordCourseSlug,
} from "@/lib/discord/config"
import { hasEffectiveMembershipAccess, type CommunityAccessRow } from "@/lib/community-access"
import { TelegramInviteButton } from "./TelegramInviteButton"

type CommunityStatus = {
  community: DiscordCommunity
  connected: boolean
  triggerSlug: DiscordCourseSlug
}

type UserCourseSlugRow = {
  granted_at: string | null
  expires_at: string | null
  is_active: boolean | null
  courses:
    | { slug: string | null }
    | Array<{ slug: string | null }>
    | null
}

function pickFirstSlug(row: UserCourseSlugRow): string | null {
  if (!row.courses) return null
  if (Array.isArray(row.courses)) return row.courses[0]?.slug ?? null
  return row.courses.slug ?? null
}

export async function CommunitiesSection({
  userId,
  feedback,
}: {
  userId: string
  feedback?: { kind: string; slug?: string; message?: string }
}) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  // 1) Cursos activos del usuario
  const { data: userCoursesData } = await supabase
    .from("user_courses")
    .select("is_active, granted_at, expires_at, courses(slug)")
    .eq("user_id", userId)

  const ownedSlugs = new Set<DiscordCourseSlug>()
  const accessRows: CommunityAccessRow[] = []
  const now = new Date()

  for (const row of (userCoursesData ?? []) as UserCourseSlugRow[]) {
    const slug = pickFirstSlug(row)
    accessRows.push({
      slug,
      grantedAt: row.granted_at,
      expiresAt: row.expires_at,
      isActive: row.is_active,
    })

    const membershipStillValid =
      slug === "membresia" &&
      row.expires_at &&
      new Date(row.expires_at).getTime() <= now.getTime()

    if (
      row.is_active === true &&
      !membershipStillValid &&
      slug &&
      slug in COURSE_TO_COMMUNITY
    ) {
      ownedSlugs.add(slug as DiscordCourseSlug)
    }
  }

  if (hasEffectiveMembershipAccess(accessRows, now)) {
    ownedSlugs.add("membresia")
  }

  if (ownedSlugs.size === 0) return null

  // 2) Grants activos del usuario
  const { data: grantsData } = await supabase
    .from("discord_role_grants")
    .select("course_slug, granted_at, revoked_at")
    .eq("user_id", userId)
    .is("revoked_at", null)

  const grantedSlugs = new Set<string>(
    (grantsData ?? []).map((g: { course_slug: string }) => g.course_slug)
  )

  // 3) Armar el estado de cada comunidad que el usuario tenga derecho a entrar
  const order: DiscordCommunity[] = ["inner-circle", "trading", "investment"]
  const statuses: CommunityStatus[] = []

  for (const community of order) {
    const ownedInCommunity = Array.from(ownedSlugs).filter(
      (slug) => COURSE_TO_COMMUNITY[slug] === community
    )
    if (ownedInCommunity.length === 0) continue

    const connected = ownedInCommunity.some((slug) => grantedSlugs.has(slug))
    statuses.push({
      community,
      connected,
      triggerSlug: ownedInCommunity[0],
    })
  }

  if (statuses.length === 0) return null

  // 4) Resolver mensaje de feedback si viene de un callback reciente
  const feedbackBanner = resolveFeedback(feedback, statuses)

  return (
    <section className="mb-10">
      <div className="mb-2 flex items-center gap-3">
        <MessageCircle size={18} className="text-[#7DD4C0]" />
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-[#888888]">
          Acceso a Discord y Telegram
        </h2>
      </div>
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#7DD4C0]/25 bg-[#7DD4C0]/[0.05] px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#7DD4C0]" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" strokeLinecap="round" />
          <circle cx="12" cy="7.6" r="0.6" fill="currentColor" stroke="none" />
        </svg>
        <p className="text-[13px] leading-relaxed text-[#B6C7C2]">
          Al entrar se asigna tu rol automáticamente y quedás dentro del grupo privado de tu comunidad. Entrá a Discord y a Telegram para no perderte clases, análisis y los avisos del día a día.
        </p>
      </div>

      {feedbackBanner && (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
            feedbackBanner.tone === "success"
              ? "border-[#7DD4C0]/30 bg-[#7DD4C0]/10 text-[#A8E8D8]"
              : "border-[#D46A6A]/40 bg-[#D46A6A]/10 text-[#E8B8B8]"
          }`}
        >
          {feedbackBanner.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {statuses.map((status) => {
          const label = COMMUNITY_LABELS[status.community]
          const kindLabel =
            status.community === "inner-circle" ? "Comunidad" : "Canal"
          return (
            <div
              key={status.community}
              className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#0E0E0E] to-[#080808] p-5 transition-all hover:-translate-y-0.5"
              style={{ borderColor: `${label.accent}30` }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${label.accent}66, transparent)` }}
              />
              <div className="relative flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <OrbitalIcon size={34} animate={false} glowColor={label.accent} className="shrink-0" />
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                      style={{ color: label.accent }}
                    >
                      {kindLabel}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {label.name}
                    </h3>
                  </div>
                </div>
                {status.connected ? (
                  <span
                    className="inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      color: label.accent,
                      borderColor: `${label.accent}55`,
                      backgroundColor: `${label.accent}15`,
                    }}
                  >
                    Activo
                  </span>
                ) : null}
              </div>

              <p className="text-[13px] leading-relaxed text-[#AAAAAA]">
                {label.description}
              </p>

              <div className="mt-auto grid gap-2 pt-2">
                <a
                  href={`/api/discord/connect/${status.triggerSlug}`}
                  className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    color: "#0A0A0A",
                    backgroundColor: label.accent,
                    borderColor: label.accent,
                  }}
                >
                  Entrar a Discord
                </a>

                <TelegramInviteButton courseSlug={status.triggerSlug} accent={label.accent} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function resolveFeedback(
  feedback: { kind: string; slug?: string; message?: string } | undefined,
  statuses: CommunityStatus[]
): { tone: "success" | "error"; text: string } | null {
  if (!feedback) return null

  switch (feedback.kind) {
    case "connected": {
      const slug = feedback.slug as DiscordCourseSlug | undefined
      const community = slug && COURSE_TO_COMMUNITY[slug]
      const found = statuses.find((s) => s.community === community)
      const name = found ? COMMUNITY_LABELS[found.community].name : "el espacio"
      return {
        tone: "success",
        text: `Listo. Tu rol de ${name} fue asignado en Discord.`,
      }
    }
    case "cancelled":
      return {
        tone: "error",
        text: "Cancelaste la autorización con Discord. Podés intentarlo de nuevo cuando quieras.",
      }
    case "state-mismatch":
      return {
        tone: "error",
        text: "La verificación de seguridad falló. Volvé a iniciar el flujo desde el botón.",
      }
    case "invalid":
    case "invalid-course":
      return {
        tone: "error",
        text: "El enlace de autorización no es válido. Probá de nuevo.",
      }
    case "missing-role-config":
      return {
        tone: "error",
        text: "Falta configurar el rol de este espacio en el servidor. Avisanos.",
      }
    case "error":
      return {
        tone: "error",
        text: feedback.message
          ? `Algo falló al conectar Discord: ${feedback.message}`
          : "Algo falló al conectar Discord. Si persiste, escribinos.",
      }
    default:
      return null
  }
}
