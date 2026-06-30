"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { loadCompletedModules, resolveProgressStorageKey } from "@/lib/course-progress"

interface Props {
  courseSlugs: string[]
}

const INNER_CIRCLE_MANIFESTO_STORAGE_KEY = "flowdex:inner-circle:manifesto-accepted:v1"

type BadgeTheme = {
  accent: string
  borderEarned: string
  borderPending: string
  borderLocked: string
  bgEarned: string
  textEarned: string
  badgeChip: string
  ctaSolid: string
  ctaSoft: string
  ctaLocked: string
  glow: string
  progressFrom: string
  progressTo: string
}

function getBadgeTheme(slug: string): BadgeTheme {
  const isInvestment = slug === "kickstart-investment" || slug === "expert-investment"
  const isTrading = slug === "kickstart-trading" || slug === "trading-lab"

  if (isInvestment) {
    return {
      accent: "#5BB8D4",
      borderEarned: "border-[#5BB8D4]/50",
      borderPending: "border-[#5BB8D4]/22",
      borderLocked: "border-[#1A1A1A]",
      bgEarned: "bg-[#5BB8D4]/[0.05]",
      textEarned: "text-[#5BB8D4]",
      badgeChip: "border border-[#5BB8D4]/40 bg-[#5BB8D4]/10 text-[#5BB8D4]",
      ctaSolid: "bg-[#5BB8D4] hover:bg-[#7DC8E0] text-[#0A1A20]",
      ctaSoft: "border border-[#5BB8D4]/45 bg-[#5BB8D4]/10 text-[#B9E2F0] hover:bg-[#5BB8D4]/20 hover:text-white",
      ctaLocked: "border border-[#222] text-[#5A5A5A] hover:border-[#5BB8D4]/40 hover:text-[#5BB8D4]",
      glow: "bg-[#5BB8D4]/20",
      progressFrom: "from-[#3D9CBE]",
      progressTo: "to-[#5BB8D4]",
    }
  }

  if (isTrading) {
    return {
      accent: "#7DD4C0",
      borderEarned: "border-[#7DD4C0]/50",
      borderPending: "border-[#7DD4C0]/22",
      borderLocked: "border-[#1A1A1A]",
      bgEarned: "bg-[#7DD4C0]/[0.05]",
      textEarned: "text-[#7DD4C0]",
      badgeChip: "border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#7DD4C0]",
      ctaSolid: "bg-[#7DD4C0] hover:bg-[#9FE0CF] text-[#0A1A18]",
      ctaSoft: "border border-[#7DD4C0]/45 bg-[#7DD4C0]/10 text-[#B7E8DC] hover:bg-[#7DD4C0]/20 hover:text-white",
      ctaLocked: "border border-[#222] text-[#5A5A5A] hover:border-[#7DD4C0]/40 hover:text-[#7DD4C0]",
      glow: "bg-[#7DD4C0]/20",
      progressFrom: "from-[#5BB8D4]",
      progressTo: "to-[#7DD4C0]",
    }
  }

  // Inner Circle (dorado)
  return {
    accent: "#D4B86A",
    borderEarned: "border-[#D4B86A]/55",
    borderPending: "border-[#D4B86A]/25",
    borderLocked: "border-[#1A1A1A]",
    bgEarned: "bg-[#D4B86A]/[0.06]",
    textEarned: "text-[#D4B86A]",
    badgeChip: "border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-[#D4B86A]",
    ctaSolid: "bg-[#D4B86A] hover:bg-[#E0C97A] text-[#1A1408]",
    ctaSoft: "border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-[#E8D7A0] hover:bg-[#D4B86A]/20 hover:text-white",
    ctaLocked: "border border-[#222] text-[#5A5A5A] hover:border-[#D4B86A]/40 hover:text-[#D4B86A]",
    glow: "bg-[#D4B86A]/22",
    progressFrom: "from-[#B89A4A]",
    progressTo: "to-[#D4B86A]",
  }
}

type BadgeMeta = {
  slug: string
  image: string
  downloadImage: string
  label: string
  storageKey: string
  totalModules: number
  courseHref: string
  checkoutHref: string
}

const ALL_BADGES: BadgeMeta[] = [
  {
    slug: "kickstart-investment",
    image: "/Kickstart-investment-thumb.jpg",
    downloadImage: "/Kickstart investment.jpeg",
    label: "Kickstart Investment",
    storageKey: "flowdex:kickstart-investment:completed-modules:v2",
    totalModules: 4,
    courseHref: "/courses/kickstart-investment",
    checkoutHref: "/checkout/kickstart-investment",
  },
  {
    slug: "expert-investment",
    image: "/Expert-investment-thumb.jpg",
    downloadImage: "/ExpertInvest.jpeg",
    label: "Expert Investment",
    storageKey: "flowdex:expert-investment:completed-modules:v1",
    totalModules: 4,
    courseHref: "/courses/expert-investment",
    checkoutHref: "/checkout/expert-investment",
  },
  {
    slug: "kickstart-trading",
    image: "/Kickstart-trading-thumb.jpg",
    downloadImage: "/Kickstart Trading.jpeg",
    label: "Kickstart Trading",
    storageKey: "flowdex:kickstart-trading:completed-modules:v2",
    totalModules: 4,
    courseHref: "/courses/kickstart-trading",
    checkoutHref: "/checkout/kickstart-trading",
  },
  {
    slug: "trading-lab",
    image: "/Trading-lab-thumb.jpg",
    downloadImage: "/TradingLab.jpeg",
    label: "Trading Lab",
    storageKey: "flowdex:trading-lab:completed-modules:v1",
    totalModules: 4,
    courseHref: "/courses/trading-lab",
    checkoutHref: "/checkout/trading-lab",
  },
  {
    slug: "inner-circle",
    image: "/Inner-circle-thumb.jpg",
    downloadImage: "/Innercircle.jpeg",
    label: "Inner Circle",
    storageKey: "flowdex:inner-circle:completed-modules:v1",
    totalModules: 10,
    courseHref: "/courses/inner-circle",
    checkoutHref: "/checkout/inner-circle",
  },
]

type BadgeState = "earned" | "pending" | "locked"
type BadgeStateInfo = {
  state: BadgeState
  completedModules: number
}

const LockIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
  </svg>
)

const CheckIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

export function CourseBadges({ courseSlugs }: Props) {
  const [info, setInfo] = useState<Record<string, BadgeStateInfo>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function hydrateBadgeStates() {
      const result: Record<string, BadgeStateInfo> = {}
      const innerCircleManifestoStorageKey = await resolveProgressStorageKey(INNER_CIRCLE_MANIFESTO_STORAGE_KEY)
      const innerCircleManifestoAccepted =
        window.localStorage.getItem(innerCircleManifestoStorageKey) === "true" ||
        window.localStorage.getItem(INNER_CIRCLE_MANIFESTO_STORAGE_KEY) === "true"

      for (const badge of ALL_BADGES) {
        const owns = courseSlugs.includes(badge.slug)
        if (!owns) {
          result[badge.slug] = { state: "locked", completedModules: 0 }
          continue
        }

        const { modules } = await loadCompletedModules(badge.storageKey, badge.totalModules, badge.slug)
        const completed = modules.length

        if (badge.slug === "inner-circle") {
          result[badge.slug] = {
            state: completed >= badge.totalModules && innerCircleManifestoAccepted ? "earned" : "pending",
            completedModules: completed,
          }
          continue
        }

        result[badge.slug] = {
          state: completed >= badge.totalModules ? "earned" : "pending",
          completedModules: completed,
        }
      }

      if (!isMounted) return
      setInfo(result)
      setHydrated(true)
    }

    void hydrateBadgeStates()
    return () => {
      isMounted = false
    }
  }, [courseSlugs])

  const featured = useMemo(() => {
    if (!hydrated) return null

    // Mejor opción: el badge "pending" con MAYOR % de avance (más cercano a desbloquear).
    const pendingCandidates = ALL_BADGES
      .map((badge) => ({ badge, ...info[badge.slug] }))
      .filter((entry) => entry.state === "pending")
      .sort((a, b) => {
        const aPct = a.completedModules / a.badge.totalModules
        const bPct = b.completedModules / b.badge.totalModules
        return bPct - aPct
      })

    if (pendingCandidates.length > 0) {
      return { ...pendingCandidates[0], variant: "pending" as const }
    }

    // Si no hay pending pero hay locked: el primer curso del path como "tu próxima credencial".
    const lockedCandidates = ALL_BADGES.filter((badge) => info[badge.slug]?.state === "locked")
    if (lockedCandidates.length > 0) {
      const firstLocked = lockedCandidates[0]
      return {
        badge: firstLocked,
        state: "locked" as BadgeState,
        completedModules: 0,
        variant: "locked" as const,
      }
    }

    // Todo earned: celebración.
    return {
      badge: ALL_BADGES[ALL_BADGES.length - 1],
      state: "earned" as BadgeState,
      completedModules: ALL_BADGES[ALL_BADGES.length - 1].totalModules,
      variant: "earned" as const,
    }
  }, [hydrated, info])

  // Próxima medalla del path para mostrar al lado (balance visual)
  const nextInPath = useMemo(() => {
    if (!featured) return null
    const pathMap: Record<string, string> = {
      "kickstart-investment": "expert-investment",
      "expert-investment": "inner-circle",
      "kickstart-trading": "trading-lab",
      "trading-lab": "inner-circle",
    }
    const nextSlug = pathMap[featured.badge.slug]
    if (!nextSlug) return null
    const nextBadge = ALL_BADGES.find((b) => b.slug === nextSlug)
    if (!nextBadge) return null
    const nextInfo = info[nextBadge.slug]
    return { badge: nextBadge, state: nextInfo?.state ?? "locked", completedModules: nextInfo?.completedModules ?? 0 }
  }, [featured, info])

  if (!hydrated || !featured) return null

  const earnedCount = ALL_BADGES.filter((b) => info[b.slug]?.state === "earned").length
  const featuredTheme = getBadgeTheme(featured.badge.slug)
  const featuredPct =
    featured.badge.totalModules > 0
      ? Math.min(100, Math.round((featured.completedModules / featured.badge.totalModules) * 100))
      : 0
  const featuredRemaining = Math.max(0, featured.badge.totalModules - featured.completedModules)
  const otherBadges = ALL_BADGES.filter(
    (b) => b.slug !== featured.badge.slug && b.slug !== nextInPath?.badge.slug
  )

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD4C0]">Credenciales digitales</p>
          <h2 className="mt-2 text-2xl tracking-tight text-white sm:text-3xl">Tus medallas</h2>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#222] bg-[#0C0C0C]/70 px-4 py-2.5">
          <div className="flex h-2 w-24 overflow-hidden rounded-full bg-[#1A1A1A]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0]"
              style={{ width: `${(earnedCount / ALL_BADGES.length) * 100}%` }}
            />
          </div>
          <p className="text-xs font-medium tabular-nums text-white">
            {earnedCount}<span className="text-[#555]">/{ALL_BADGES.length}</span>
          </p>
        </div>
      </div>

      {/* MEDALLAS PROTAGONISTAS — grid de cards idénticas en formato */}
      <div className={`grid gap-5 ${nextInPath ? "lg:grid-cols-2" : ""}`}>
        {[
          {
            badge: featured.badge,
            variant: featured.variant,
            state: featured.state,
            completedModules: featured.completedModules,
            isFeatured: true,
          },
          ...(nextInPath
            ? [{
                badge: nextInPath.badge,
                variant: nextInPath.state === "earned"
                  ? "earned" as const
                  : nextInPath.state === "pending"
                    ? "pending" as const
                    : "locked" as const,
                state: nextInPath.state,
                completedModules: nextInPath.completedModules,
                isFeatured: false,
              }]
            : []),
        ].map((item) => {
          const theme = getBadgeTheme(item.badge.slug)
          const pct = item.badge.totalModules > 0
            ? Math.min(100, Math.round((item.completedModules / item.badge.totalModules) * 100))
            : 0
          const remaining = Math.max(0, item.badge.totalModules - item.completedModules)
          const isEarned = item.variant === "earned"
          const isPending = item.variant === "pending"
          const isLocked = item.variant === "locked"

          const chipLabel = isEarned ? "DESBLOQUEADA" : isPending ? "EN PROGRESO" : "DESBLOQUEAR"
          const eyebrow = item.isFeatured
            ? (isEarned ? "Medalla desbloqueada" : isPending ? "Tu próxima medalla" : "Tu primera medalla")
            : "Después viene"

          const ctaHref = isLocked
            ? item.badge.checkoutHref
            : isPending
              ? item.badge.courseHref
              : item.badge.downloadImage
          const ctaLabel = isLocked ? "Desbloquear curso" : isPending ? "Continuar curso" : "Descargar medalla"
          const ctaIsDownload = isEarned

          const description = isEarned
            ? "Compartila en LinkedIn donde te conviertas en referencia."
            : isPending
              ? `Te ${remaining === 1 ? "queda" : "quedan"} ${remaining} ${remaining === 1 ? "módulo" : "módulos"} para desbloquearla. Ya completaste ${item.completedModules} de ${item.badge.totalModules}.`
              : `Esta credencial verifica que dominás los fundamentos de ${item.badge.slug.includes("trading") ? "trading" : "inversión"}.`

          return (
            <article
              key={item.badge.slug}
              className={`relative overflow-hidden rounded-2xl border ${
                isEarned ? theme.borderEarned : isPending ? theme.borderPending : "border-[#1F1F1F]"
              } ${isEarned ? theme.bgEarned : "bg-[#0A0A0A]/80"} p-5 sm:p-6`}
            >
              <div className={`pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full ${theme.glow} blur-3xl opacity-60`} />
              <div className={`pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full ${theme.glow} blur-3xl opacity-35`} />

              <div className="relative grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
                {/* Medallón */}
                <div className="relative mx-auto sm:mx-0">
                  <div className={`absolute -inset-2.5 rounded-full ${theme.glow} blur-xl opacity-80`} />
                  <div className={`relative h-[170px] w-[170px] overflow-hidden rounded-full border ${theme.borderEarned}`}>
                    <Image
                      src={item.badge.image}
                      alt={item.badge.label}
                      fill
                      sizes="170px"
                      quality={92}
                      priority={item.isFeatured}
                      className="object-cover scale-[1.18]"
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                      <div className={`inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] ${theme.textEarned}`}>
                        {isLocked && <LockIcon className="h-2.5 w-2.5" />}
                        {chipLabel}
                      </div>
                    </div>
                  </div>
                  {/* Anillo de progreso solo si está en progreso */}
                  {isPending && pct > 0 && (
                    <svg className="absolute -inset-1.5 h-[182px] w-[182px] -rotate-90" viewBox="0 0 186 186" aria-hidden>
                      <circle cx="93" cy="93" r="90" fill="none" stroke="currentColor" strokeWidth="3" className={theme.textEarned} strokeOpacity="0.18" />
                      <circle cx="93" cy="93" r="90" fill="none" stroke="currentColor" strokeWidth="3" className={theme.textEarned} strokeLinecap="round" strokeDasharray={`${(pct / 100) * 565} 565`} />
                    </svg>
                  )}
                </div>

                {/* Contenido */}
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-[0.26em] ${theme.textEarned}`}>{eyebrow}</p>
                  <h3 className="mt-1.5 text-xl tracking-tight text-white sm:text-2xl">{item.badge.label}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#B8B8B8]">{description}</p>

                  {(() => {
                    const barPct = isEarned ? 100 : isLocked ? 0 : pct
                    return (
                      <div className="mt-3">
                        <div className="mb-1 flex items-baseline justify-between">
                          <span className="text-[9px] uppercase tracking-[0.22em] text-[#7A7A7A]">Progreso</span>
                          <span className="text-xs font-semibold tabular-nums text-white">{barPct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                          <div
                            className={`h-full rounded-full ${isLocked ? "bg-[#222]" : `bg-gradient-to-r ${theme.progressFrom} ${theme.progressTo}`}`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })()}

                  <div className="mt-4">
                    {ctaIsDownload ? (
                      <a
                        href={ctaHref}
                        download
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all ${theme.ctaSolid} hover:shadow-lg`}
                      >
                        {ctaLabel}
                        <span aria-hidden>→</span>
                      </a>
                    ) : (
                      <Link
                        href={ctaHref}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all ${theme.ctaSolid} hover:shadow-lg`}
                      >
                        {ctaLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Tira chica de las otras credenciales */}
      <div className="mt-5 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]/60 p-3.5 sm:p-4">
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#666]">Otras credenciales</p>
        <div className={`grid grid-cols-2 gap-2.5 ${otherBadges.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
          {otherBadges.map((badge) => {
            const stateInfo = info[badge.slug]
            const state: BadgeState = stateInfo?.state ?? "locked"
            const theme = getBadgeTheme(badge.slug)
            const isEarned = state === "earned"
            const isPending = state === "pending"

            const content = (
              <div className="flex items-center gap-3">
                <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border ${isEarned ? theme.borderEarned : "border-[#1F1F1F]"}`}>
                  <Image
                    src={badge.image}
                    alt={badge.label}
                    fill
                    sizes="48px"
                    quality={80}
                    className={`object-cover scale-[1.18] ${
                      isEarned ? "" : isPending ? "brightness-[0.55] saturate-[0.7]" : "brightness-[0.28] saturate-0"
                    }`}
                  />
                  {isEarned && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/0`}>
                      <span className={`${theme.textEarned} drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]`}>
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    </div>
                  )}
                  {!isEarned && !isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LockIcon className="h-3 w-3 text-[#3A3A3A]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-[12px] font-medium tracking-tight ${isEarned ? "text-white" : "text-[#7A7A7A]"}`}>
                    {badge.label}
                  </p>
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${isEarned ? theme.textEarned : isPending ? "text-[#666]" : "text-[#3A3A3A]"}`}>
                    {isEarned ? "Desbloqueada" : isPending ? `${stateInfo.completedModules}/${badge.totalModules}` : "Bloqueada"}
                  </p>
                </div>
              </div>
            )

            if (isEarned) {
              return (
                <a
                  key={badge.slug}
                  href={badge.downloadImage}
                  download
                  className={`group rounded-lg border ${theme.borderEarned} ${theme.bgEarned} p-2.5 transition-colors hover:bg-[#0F0F0F]`}
                >
                  {content}
                </a>
              )
            }

            return (
              <Link
                key={badge.slug}
                href={isPending ? badge.courseHref : badge.checkoutHref}
                className="group rounded-lg border border-[#181818] bg-[#0A0A0A]/60 p-2.5 transition-colors hover:border-[#2A2A2A]"
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
