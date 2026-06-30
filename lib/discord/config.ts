// Configuración de la integración con Discord.
// Mapea cada slug de curso a su role ID correspondiente en Discord.

export type DiscordCourseSlug =
  | "membresia"
  | "trading-lab"
  | "kickstart-trading"
  | "expert-investment"
  | "kickstart-investment"

export type DiscordCommunity = "inner-circle" | "trading" | "investment"

// Mapeo curso → comunidad (usado para agrupar la UI del dashboard).
// IMPORTANTE: "inner-circle" (slug del curso, 12 meses de contenido) NO da acceso
// directo a la comunidad Discord. El acceso lo da "membresia" (30 días, $50).
// Cuando alguien paga inner-circle, un trigger SQL le crea automáticamente la
// primera membresía gratis de 30 días.
export const COURSE_TO_COMMUNITY: Record<DiscordCourseSlug, DiscordCommunity> = {
  membresia: "inner-circle",
  "trading-lab": "trading",
  "kickstart-trading": "trading",
  "expert-investment": "investment",
  "kickstart-investment": "investment",
}

// Metadata de cada comunidad para mostrar en el dashboard
export const COMMUNITY_LABELS: Record<
  DiscordCommunity,
  { name: string; description: string; accent: string }
> = {
  "inner-circle": {
    name: "Inner Circle",
    description:
      "Acceso al canal premium del Inner Circle: lives, revisiones y la comunidad de operadores serios.",
    accent: "#D4B86A",
  },
  trading: {
    name: "Trading",
    description:
      "Canales de Trading Lab y Kickstart Trading: setups, análisis de casos reales y noticias clave del mercado.",
    accent: "#7DD4C0",
  },
  investment: {
    name: "Inversión",
    description:
      "Canales de Expert Investment y Kickstart Investment: análisis fundamental, FCI, balances.",
    accent: "#5BB8D4",
  },
}

// Mapeo curso → env var del role ID en Discord.
// "membresia" usa el mismo rol que era "Inner Circle" — representa membresía
// activa a la comunidad premium. Cuando expira la membresía, este rol se quita.
const COURSE_ROLE_ENV: Record<DiscordCourseSlug, string> = {
  membresia: "DISCORD_ROLE_INNER_CIRCLE",
  "trading-lab": "DISCORD_ROLE_TRADING_LAB",
  "kickstart-trading": "DISCORD_ROLE_KICKSTART_TRADING",
  "expert-investment": "DISCORD_ROLE_EXPERT_INVESTMENT",
  "kickstart-investment": "DISCORD_ROLE_KICKSTART_INVESTMENT",
}

// Obtiene el role ID directamente desde el slug del curso
export function getRoleIdForCourse(slug: DiscordCourseSlug): string | null {
  const envKey = COURSE_ROLE_ENV[slug]
  if (!envKey) return null
  return process.env[envKey] ?? null
}

// URL base de Discord API
export const DISCORD_API_BASE = "https://discord.com/api/v10"

// Scopes de OAuth que pedimos al usuario
export const DISCORD_OAUTH_SCOPES = ["identify", "guilds.join"] as const

// Cookie names
export const DISCORD_STATE_COOKIE = "flowdex_discord_state"
export const DISCORD_SLUG_COOKIE = "flowdex_discord_slug"

// Helper para construir la redirect URI según el environment
export function getRedirectUri(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://flowdex.com.ar"
      : "http://localhost:3000")
  return `${baseUrl}/api/discord/callback`
}
