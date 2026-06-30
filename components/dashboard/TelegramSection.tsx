import { Send } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  COURSE_TO_TELEGRAM_COMMUNITY,
  TELEGRAM_COMMUNITY_LABELS,
  TelegramCommunity,
  TelegramCourseSlug,
} from "@/lib/telegram/config"
import { TelegramInviteButton } from "./TelegramInviteButton"

type CommunityRow = {
  community: TelegramCommunity
  triggerSlug: TelegramCourseSlug
}

type UserCourseSlugRow = {
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

export async function TelegramSection({ userId }: { userId: string }) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  // Cursos activos del usuario (no expirados)
  const nowIso = new Date().toISOString()
  const { data: userCoursesData } = await supabase
    .from("user_courses")
    .select("courses(slug), expires_at")
    .eq("user_id", userId)
    .eq("is_active", true)

  const ownedSlugs = new Set<TelegramCourseSlug>()
  for (const row of (userCoursesData ?? []) as (UserCourseSlugRow & {
    expires_at: string | null
  })[]) {
    // Filtrar los expirados
    if (row.expires_at && row.expires_at < nowIso) continue

    const slug = pickFirstSlug(row)
    if (slug && slug in COURSE_TO_TELEGRAM_COMMUNITY) {
      ownedSlugs.add(slug as TelegramCourseSlug)
    }
  }

  if (ownedSlugs.size === 0) return null

  // Armar las cards de cada comunidad accesible
  const order: TelegramCommunity[] = ["inner-circle", "trading", "investment"]
  const communities: CommunityRow[] = []

  for (const community of order) {
    const ownedInCommunity = Array.from(ownedSlugs).filter(
      (slug) => COURSE_TO_TELEGRAM_COMMUNITY[slug] === community
    )
    if (ownedInCommunity.length === 0) continue

    communities.push({
      community,
      triggerSlug: ownedInCommunity[0],
    })
  }

  if (communities.length === 0) return null

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-3">
        <Send size={18} className="text-[#5BB8D4]" />
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-[#888888]">
          Acceso a Telegram
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {communities.map(({ community, triggerSlug }) => {
          const label = TELEGRAM_COMMUNITY_LABELS[community]
          const kindLabel = community === "inner-circle" ? "Canal premium" : "Canal"
          return (
            <div
              key={community}
              className="flex flex-col gap-3 rounded-2xl border border-[#1E1E1E] bg-[#0F0F0F] p-5"
              style={{ borderColor: `${label.accent}30` }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: label.accent }}
                >
                  {kindLabel}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{label.name}</h3>
              </div>

              <p className="text-[13px] leading-relaxed text-[#AAAAAA]">
                {label.description}
              </p>

              <div className="mt-1">
                <TelegramInviteButton courseSlug={triggerSlug} accent={label.accent} />
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[11px] text-[#666666]">
        Los enlaces son de un solo uso y vencen en 1 hora. Si no los usaste a
        tiempo, podés generar uno nuevo.
      </p>
    </section>
  )
}
