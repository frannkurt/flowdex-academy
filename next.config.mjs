import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tree-shaking agresivo en build-time para librerías grandes que en runtime
  // arrastrarían todo su árbol. framer-motion y lucide-react son las más
  // pesadas en el bundle inicial de la home (auditoría PageSpeed mayo 2026:
  // ~140 KiB de JS no usado en chunks principales).
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "date-fns", "recharts"],
  },
  // Reverse proxy para PostHog. El cliente envía eventos a /ingest/* y Next
  // los rewriteea server-side a us.i.posthog.com. Esto sortea adblockers que
  // bloquean dominios de posthog.com y mantiene todo el tráfico dentro de
  // flowdex.com.ar (mejor para CSP, menos round-trips de DNS).
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // Flowdex Desk: proxy same-origin al backend Python (Cloud Run en prod, backend
      // local en dev). Rewrite a nivel config → streamea el SSE y no tiene el timeout
      // de las funciones de Vercel; la cookie de Supabase viaja sola (mismo origen).
      {
        source: "/desk-api/:path*",
        destination: `${process.env.DESK_API_URL || "http://127.0.0.1:8765"}/api/:path*`,
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ]
  },
  images: {
    // Optimización activada: Next/Image sirve WebP/AVIF y variantes responsive.
    // Si Vercel cobra por transformaciones (después del free tier mensual),
    // monitorear consumo en dashboard de Vercel.
    formats: ["image/avif", "image/webp"],
    // Next 16 requiere declarar las qualities permitidas. Listamos las que
    // realmente se usan en el repo (Mentors usa 80, badges 82, hero 95).
    // Si agregás un quality nuevo, sumalo acá o Next lo loguea como warning.
    qualities: [75, 80, 82, 95],
    remotePatterns: [
      // TradingView screenshots de indicadores (Inner Circle).
      { protocol: "https", hostname: "s3.tradingview.com" },
      { protocol: "https", hostname: "www.tradingview.com" },
      // Vercel Blob storage (assets subidos durante desarrollo).
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      // Cache largo para assets estáticos servidos desde /public.
      // Next.js ya sirve /_next/static/* como immutable porque cada archivo
      // tiene hash en el nombre. Pero los assets de /public (íconos, imágenes
      // de marca, fuentes locales) no llevan hash y por default se sirven sin
      // Cache-Control explícito. Lighthouse marca esto como "Use efficient
      // cache lifetimes" (~82 KiB en auditoría mayo 2026). Si alguna vez se
      // pisa un archivo de /public con el mismo nombre, hay que invalidar
      // CDN/Vercel cache manualmente — es el trade-off conocido.
      {
        source: "/:path*.(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Fuerza HTTPS en visitas futuras (anti-downgrade). Conservador: sin
            // includeSubDomains/preload para no comprometer subdominios que puedan
            // no estar 100% en HTTPS — ampliable cuando se confirme que todos lo están.
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.mercadopago.com.ar https://www.mercadopago.com https://sdk.mercadopago.com https://www.youtube.com https://s.ytimg.com https://www.cashbackforexusa.com https://www.cashbackforex.com https://s3.tradingview.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co https://api.mercadopago.com https://api.nowpayments.io https://discord.com https://www.youtube.com https://www.cashbackforexusa.com https://www.cashbackforex.com https://sslecal2.investing.com https://*.tradingview.com https://*.tradingview-widget.com wss://*.tradingview.com wss://*.tradingview-widget.com",
              "frame-src https://www.mercadopago.com.ar https://www.mercadopago.com https://challenges.cloudflare.com https://www.youtube.com https://sslecal2.investing.com https://www.investing.com https://www.cashbackforexusa.com https://www.cashbackforex.com https://*.tradingview.com https://*.tradingview-widget.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

// Sentry envuelve el config de Next preservando rewrites, headers e images.
// tunnelRoute "/monitoring" hace que las requests al ingest pasen por nuestro
// dominio (igual que /ingest para PostHog), evitando adblockers y no obligando
// a tocar el CSP.
// authToken se lee de SENTRY_AUTH_TOKEN; si no está seteado, el plugin de
// webpack loguea warning pero NO falla el build — los errores siguen llegando
// con stack trace minificado. Cuando querés source maps desminificadas, sumá
// SENTRY_AUTH_TOKEN en Vercel.
export default withSentryConfig(nextConfig, {
  org: "flowdex",
  project: "javascript-nextjs",

  // Silenciar logs del plugin de webpack en builds locales (solo verbose en CI).
  silent: !process.env.CI,

  // Pasar el ingest por nuestro propio dominio.
  tunnelRoute: "/monitoring",

  // Subir source maps de todo el bundle client, no solo de las páginas.
  widenClientFileUpload: true,

  // Opciones específicas del pipeline de webpack del SDK. En @sentry/nextjs v10+
  // las flags top-level (disableLogger, automaticVercelMonitors) quedaron deprecated
  // y se movieron acá. Si en algún build se usa Turbopack en lugar de webpack,
  // estas opciones simplemente no se aplican (Sentry no las soporta con Turbopack
  // todavía); no rompen nada.
  webpack: {
    // Apaga los console.log internos del SDK en builds productivos (ahorra KBs).
    treeshake: { removeDebugLogging: true },
  },
})
