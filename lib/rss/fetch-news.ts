// Server-side fetcher de noticias financieras para /herramientas/noticias.
// Consume varias fuentes RSS, mezcla por fecha, y devuelve los headlines
// más recientes. Cache vía Next fetch con revalidate (30 min) — no
// martillamos los servidores de las fuentes y la página siempre tiene
// contenido fresco sin necesidad de revalidar al cliente.
//
// Las fuentes pueden cambiar — están centralizadas acá para que sumar o
// reemplazar una sea editar este array, no la página.

import Parser from "rss-parser"

export type NewsRegion = "Argentina" | "LATAM" | "Internacional" | "USA"

export type NewsSource = {
  id: string
  name: string
  url: string
  lang: "es" | "en"
  accent: string
  region: NewsRegion
}

export type NewsItem = {
  id: string
  title: string
  link: string
  snippet: string | null
  imageUrl: string | null
  pubDate: Date
  source: NewsSource
}

// Opción C ampliada (2026-05-26): 5 fuentes serias con buena distribución
// geográfica y editorial. Salió Investing.com porque devolvía items sin
// snippet ni imagen — quedaban cards visualmente pobres. Los accents de
// cada fuente toman inspiración de la marca real (champagne para Ámbito,
// terracota para La Nación, azul Bloomberg, naranja Expansión, teal
// Yahoo) sin caer en logos literales.
export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "ambito",
    name: "Ámbito Financiero",
    url: "https://www.ambito.com/rss/economia.xml",
    lang: "es",
    region: "Argentina",
    accent: "#C8A872",
  },
  {
    id: "la-nacion",
    name: "La Nación",
    // La URL vieja (servicios.lanacion.com.ar/herramientas/rss/categoria_id=3)
    // devuelve 404 desde el rediseño de 2024 — La Nación migró a Arc Outbound
    // Feeds (formato estándar de los sitios construidos sobre Arc Publishing).
    url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/economia/?outputType=xml",
    lang: "es",
    region: "Argentina",
    accent: "#C97A4D",
  },
  {
    id: "bloomberg-linea",
    name: "Bloomberg Línea",
    url: "https://www.bloomberglinea.com/arc/outboundfeeds/rss/?outputType=xml",
    lang: "es",
    region: "LATAM",
    accent: "#2D7DD2",
  },
  {
    id: "expansion",
    name: "Expansión",
    url: "https://e00-expansion.uecdn.es/rss/mercados.xml",
    lang: "es",
    region: "Internacional",
    accent: "#E89F30",
  },
  {
    id: "yahoo-finance",
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    lang: "en",
    region: "USA",
    accent: "#7DD4C0",
  },
]

// Mapa region -> color del chip. Distinto del accent de fuente para que
// los dos chips de cada card se diferencien visualmente. Argentina queda
// con un azul claro asociable a celeste sin caer en el cliché bandera.
// LATAM verde menta para separarse claro de Argentina (azul) y de
// Internacional (gris).
export const REGION_COLORS: Record<NewsRegion, string> = {
  Argentina: "#74A9D7",
  LATAM: "#9CCFB9",
  Internacional: "#A8B4CB",
  USA: "#D4B86A",
}

// rss-parser permite declarar customFields para extraer nodos XML que
// no están en el set por default. Los feeds modernos suelen exponer
// imágenes en media:content, media:thumbnail o enclosure — necesitamos
// pedirlos explícitamente para que aparezcan en cada item.
type ParserItem = {
  enclosure?: { url?: string; type?: string }
  "media:content"?: { $?: { url?: string; medium?: string } } | Array<{ $?: { url?: string; medium?: string } }>
  "media:thumbnail"?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>
  "content:encoded"?: string
}

const parser: Parser<unknown, ParserItem> = new Parser({
  timeout: 6000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; FlowdexNews/1.0)",
  },
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail", { keepArray: false }],
      ["content:encoded", "content:encoded"],
    ],
  },
})

function stripHtml(input: string | undefined | null): string | null {
  if (!input) return null
  const cleaned = input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
  if (!cleaned) return null
  return cleaned.length > 220 ? cleaned.slice(0, 217).trim() + "..." : cleaned
}

// Buscar imagen del item en orden de calidad/confiabilidad:
//   1. enclosure (estándar RSS 2.0, suele venir en items con podcast/news)
//   2. media:content (Media RSS, lo usa Yahoo Finance, Investing, etc)
//   3. media:thumbnail (variante reducida de media:content)
//   4. primer <img src> dentro del content:encoded / content / description
// Si nada matchea, devolvemos null y el card cae al layout sin imagen.
function extractImage(item: Parser.Item & ParserItem): string | null {
  // 1. enclosure
  if (item.enclosure?.url) {
    const type = item.enclosure.type ?? ""
    if (type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(item.enclosure.url)) {
      return item.enclosure.url
    }
  }

  // 2. media:content (puede ser objeto único o array, según el feed)
  const mediaContent = item["media:content"]
  if (mediaContent) {
    const arr = Array.isArray(mediaContent) ? mediaContent : [mediaContent]
    for (const m of arr) {
      const url = m?.$?.url
      if (url && (m?.$?.medium === "image" || /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url))) {
        return url
      }
    }
  }

  // 3. media:thumbnail
  const mediaThumb = item["media:thumbnail"]
  if (mediaThumb) {
    const arr = Array.isArray(mediaThumb) ? mediaThumb : [mediaThumb]
    for (const m of arr) {
      const url = m?.$?.url
      if (url) return url
    }
  }

  // 4. Primer <img src> dentro del content. Usamos los campos en orden
  // de probabilidad de contener HTML rico: content:encoded > content >
  // contentSnippet (este último ya viene plano, raramente con img).
  const html =
    item["content:encoded"] ??
    (typeof item.content === "string" ? item.content : null) ??
    null
  if (html) {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (match?.[1]) return match[1]
  }

  return null
}

async function fetchSource(source: NewsSource): Promise<NewsItem[]> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 1800 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlowdexNews/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    })

    if (!response.ok) {
      console.error(`[news] ${source.id} respondió ${response.status}`)
      return []
    }

    const xml = await response.text()
    const feed = await parser.parseString(xml)

    return (feed.items ?? [])
      .slice(0, 6) // tope por fuente; con 5 fuentes × 6 da 30 items pre-mezcla
      .map((item, idx): NewsItem | null => {
        const title = item.title?.trim()
        const link = item.link?.trim()
        if (!title || !link) return null

        const dateRaw = item.pubDate ?? item.isoDate ?? null
        const pubDate = dateRaw ? new Date(dateRaw) : new Date()
        if (Number.isNaN(pubDate.getTime())) return null

        return {
          id: `${source.id}-${idx}-${pubDate.getTime()}`,
          title,
          link,
          snippet: stripHtml(item.contentSnippet ?? item.summary ?? item.content ?? null),
          imageUrl: extractImage(item),
          pubDate,
          source,
        }
      })
      .filter((x): x is NewsItem => x !== null)
  } catch (err) {
    console.error(`[news] error fetcheando ${source.id}:`, err)
    return []
  }
}

export async function fetchAllNews(limit = 18): Promise<NewsItem[]> {
  const buckets = await Promise.all(NEWS_SOURCES.map(fetchSource))
  const merged = buckets.flat()

  merged.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return merged.slice(0, limit)
}
