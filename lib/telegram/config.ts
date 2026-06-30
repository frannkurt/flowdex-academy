// Configuración de la integración con Telegram.
// Mapea cada slug de curso a su chat ID correspondiente en Telegram.
// Misma estructura que Discord: 5 cursos → 3 comunidades.

export type TelegramCourseSlug =
  | "membresia"
  | "trading-lab"
  | "kickstart-trading"
  | "expert-investment"
  | "kickstart-investment"

export type TelegramCommunity = "inner-circle" | "trading" | "investment"

// IDs verificados en producción. Se usan como fallback si una env var quedó vieja.
// Los IDs de trading e investment se actualizaron en mayo 2026 cuando se crearon
// los supergrupos nuevos (antes eran canales unidireccionales).
const TELEGRAM_KNOWN_CHAT_IDS: Record<TelegramCommunity, string> = {
  "inner-circle": "-1003847679931",
  trading: "-1003935525047",
  investment: "-1003879259472",
}

// Mapeo curso → comunidad de Telegram.
// IMPORTANTE: "inner-circle" (curso, 12 meses contenido) NO da acceso directo
// al grupo de Telegram. El acceso lo da "membresia" (30 días, $50). Al comprar
// inner-circle, el trigger SQL crea la primera membresía gratis automáticamente.
export const COURSE_TO_TELEGRAM_COMMUNITY: Record<TelegramCourseSlug, TelegramCommunity> = {
  membresia: "inner-circle",
  "trading-lab": "trading",
  "kickstart-trading": "trading",
  "expert-investment": "investment",
  "kickstart-investment": "investment",
}

// Metadata visual para mostrar en el dashboard
export const TELEGRAM_COMMUNITY_LABELS: Record<
  TelegramCommunity,
  { name: string; description: string; accent: string }
> = {
  "inner-circle": {
    name: "Inner Circle",
    description:
      "Canal privado del Inner Circle donde Franco hace las revisiones de operaciones.",
    accent: "#D4B86A",
  },
  trading: {
    name: "Trading",
    description:
      "Canal privado de Trading Lab y Kickstart Trading: setups, casos reales y debate.",
    accent: "#7DD4C0",
  },
  investment: {
    name: "Inversión",
    description:
      "Canal privado de Expert Investment y Kickstart Investment: análisis y carteras.",
    accent: "#5BB8D4",
  },
}

// Obtiene el chat ID según la comunidad
export function getChatIdForCommunity(community: TelegramCommunity): string | null {
  switch (community) {
    case "inner-circle":
      return process.env.TELEGRAM_CHAT_INNER_CIRCLE ?? TELEGRAM_KNOWN_CHAT_IDS[community]
    case "trading":
      return process.env.TELEGRAM_CHAT_TRADING ?? TELEGRAM_KNOWN_CHAT_IDS[community]
    case "investment":
      return process.env.TELEGRAM_CHAT_INVESTMENT ?? TELEGRAM_KNOWN_CHAT_IDS[community]
    default:
      return null
  }
}

// Devuelve candidatos en orden de prioridad: env var primero, fallback verificado después.
export function getCandidateChatIdsForCommunity(community: TelegramCommunity): string[] {
  let envChatId: string | null = null

  switch (community) {
    case "inner-circle":
      envChatId = process.env.TELEGRAM_CHAT_INNER_CIRCLE ?? null
      break
    case "trading":
      envChatId = process.env.TELEGRAM_CHAT_TRADING ?? null
      break
    case "investment":
      envChatId = process.env.TELEGRAM_CHAT_INVESTMENT ?? null
      break
    default:
      envChatId = null
  }

  const fallbackChatId = TELEGRAM_KNOWN_CHAT_IDS[community]
  return Array.from(new Set([envChatId, fallbackChatId].filter(Boolean) as string[]))
}

// Obtiene el chat ID directamente desde el slug del curso
export function getChatIdForCourse(slug: TelegramCourseSlug): string | null {
  const community = COURSE_TO_TELEGRAM_COMMUNITY[slug]
  if (!community) return null
  return getChatIdForCommunity(community)
}

export function getCandidateChatIdsForCourse(slug: TelegramCourseSlug): string[] {
  const community = COURSE_TO_TELEGRAM_COMMUNITY[slug]
  if (!community) return []
  return getCandidateChatIdsForCommunity(community)
}

// URL base de la Bot API de Telegram
export const TELEGRAM_API_BASE = "https://api.telegram.org"

// Duración por defecto del invite link (1 hora)
// Se combina con member_limit=1 para minimizar compartidos.
export const TELEGRAM_INVITE_TTL_SECONDS = 60 * 60
