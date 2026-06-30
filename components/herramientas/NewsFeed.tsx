// Componente server-side que renderiza el feed de noticias.
// La data viene pre-fetcheada (en el server component padre) para que
// podamos sumar Suspense en el futuro si lo necesitamos sin re-arquitectar.
//
// Las imágenes vienen del RSS (media:content / media:thumbnail / enclosure
// / inline img) — pueden estar o no. Cuando están, el card usa layout
// con thumbnail; cuando no, layout más compacto sin imagen. El componente
// es client-side mínimo solo para manejar el onError de las <img> que
// fallen al cargar.

"use client"

import { useState } from "react"
import type { NewsItem } from "@/lib/rss/fetch-news"
import { REGION_COLORS } from "@/lib/rss/fetch-news"

type NewsFeedProps = {
  items: NewsItem[]
}

function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return "Ahora"
  if (diffMin < 60) return `hace ${diffMin} min`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `hace ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "ayer"
  if (diffDays < 7) return `hace ${diffDays} días`

  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })
}

function NewsThumbnail({ src, alt }: { src: string; alt: string }) {
  // imageError local: si el src falla (404, hotlink protection, etc),
  // el card se renderiza sin imagen como fallback en lugar de mostrar
  // el ícono roto del browser.
  const [imageError, setImageError] = useState(false)

  if (imageError) return null

  return (
    <div className="relative shrink-0 overflow-hidden bg-[#0A0D14] sm:w-56">
      {/* aspect-ratio fija para evitar layout shift mientras carga.
          En mobile la imagen ocupa todo el ancho con ratio 16:9; en
          desktop pasa a thumbnail vertical con ratio más cuadrado. */}
      <div className="aspect-[16/9] w-full sm:aspect-[4/3] sm:h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setImageError(true)}
        />
        {/* Velo sutil que oscurece el borde, ayuda a integrar la
            imagen al fondo del card sin verse como una postal pegada. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,13,20,0.6)_100%)] sm:bg-[linear-gradient(90deg,transparent_60%,rgba(10,13,20,0.55)_100%)]" />
      </div>
    </div>
  )
}

export function NewsFeed({ items }: NewsFeedProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#0A0D14] p-10 text-center">
        <p className="text-sm text-[#9AA3B5]">
          No pudimos cargar noticias en este momento. Probá refrescar en un par de minutos.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {items.map((item) => {
        const regionColor = REGION_COLORS[item.source.region]

        return (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#0F1117_0%,#0B0D14_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all hover:border-[#3A3A3A] sm:flex-row"
          >
            {/* Acento lateral vertical con color de fuente: aparece en hover */}
            <div
              className="absolute inset-y-0 left-0 z-10 w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
              style={{ background: item.source.accent }}
            />

            {item.imageUrl && <NewsThumbnail src={item.imageUrl} alt={item.title} />}

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
                {/* Chip de FUENTE: color del accent de la fuente */}
                <span
                  className="rounded-full border bg-black/30 px-2.5 py-1"
                  style={{
                    borderColor: `${item.source.accent}40`,
                    color: item.source.accent,
                  }}
                >
                  {item.source.name}
                </span>

                {/* Chip de REGIÓN: color independiente por región para que
                    los dos chips se diferencien visualmente en cada card. */}
                <span
                  className="rounded-full border bg-black/30 px-2.5 py-1"
                  style={{
                    borderColor: `${regionColor}40`,
                    color: regionColor,
                  }}
                >
                  {item.source.region}
                </span>

                <span className="ml-auto text-[#5C6273]">{formatRelativeDate(item.pubDate)}</span>
              </div>

              <h3 className="mt-3 text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#E5F4F0] sm:text-lg">
                {item.title}
              </h3>

              {item.snippet && (
                <p className="mt-2 text-sm leading-relaxed text-[#9AA3B5]">{item.snippet}</p>
              )}

              <p className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] uppercase tracking-[0.18em] text-[#5C6273] transition-colors group-hover:text-[#9AA3B5]">
                Leer en {item.source.name}
                <span aria-hidden="true">→</span>
              </p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
