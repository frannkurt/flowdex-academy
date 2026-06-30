import type { MetadataRoute } from "next"
import { getPublicCourseSlugs } from "@/lib/courses/landing-marketing"

const BASE_URL = "https://flowdex.com.ar"

// Páginas públicas que queremos indexar. NO incluir rutas privadas (dashboard,
// courses/[slug], checkout, journal, admin) porque requieren auth y solo
// generan rebote desde Search Console.
const PUBLIC_ROUTES: Array<{
  path: string
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly"
  priority: number
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/inner-circle", changeFrequency: "weekly", priority: 0.9 },
  // /filosofia se removió del sitemap: su layout declara robots noindex (es
  // página gated tras compra), así que listarla acá era señal contradictoria
  // para Search Console.
  { path: "/track-record", changeFrequency: "monthly", priority: 0.8 },
  { path: "/no-hacemos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/por-donde-empezar", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/reembolsos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/propiedad-intelectual", changeFrequency: "yearly", priority: 0.3 },
  // Landings individuales de cursos. Cada slug en /cursos/[slug] es una
  // página estática propia con su Course schema y metadata SEO específica.
  ...getPublicCourseSlugs().map((slug) => ({
    path: `/cursos/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
