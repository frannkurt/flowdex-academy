import type { Metadata, Viewport } from "next"
import { DM_Sans, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { MotionProvider } from "@/components/MotionProvider"
import { LanguageProvider } from "@/lib/language-context"
import { Navbar } from "@/components/Navbar"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Footer } from "@/components/Footer"
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider"
import { PostHogProvider } from "@/components/PostHogProvider"
import { JsonLd } from "@/components/JsonLd"
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/structured-data"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

// Bebas Neue se removió (mayo 2026): la clase `font-[var(--font-display)]`
// nunca compilaba en Tailwind v4, así que los displays siempre cayeron
// en DM Sans. Ver app/globals.css → SISTEMA TIPOGRÁFICO para los tokens
// vigentes (type-display-*, type-headline, etc.).
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
})


export const metadata: Metadata = {
  metadataBase: new URL("https://flowdex.com.ar"),
  title: {
    // Title default: incluye las dos queries principales (trading + inversión)
    // explícitamente. Google rankea por palabras presentes en <title>, y
    // "Flowdex" es marca que todavía no se busca con volumen propio, asi que
    // arranca con las queries y termina con la marca.
    default: "Cursos de Trading e Inversión Online | Flowdex",
    template: "%s | Flowdex",
  },
  description:
    "Cursos online de trading e inversión con metodología propia, clases en vivo y track record verificado en prop firms. Aprendé desde cero o profundizá con el Inner Circle.",
  // Nota: meta keywords se removio porque Google lo ignora desde 2009 (Matt
  // Cutts lo confirmo publicamente). No aporta ranking y solo agrega bytes.
  authors: [{ name: "Flowdex" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cursos de Trading e Inversión Online | Flowdex",
    description:
      "Metodología propia, clases en vivo y track record verificado. Cursos online de trading e inversión para todo Latinoamérica.",
    type: "website",
    locale: "es_AR",
    siteName: "Flowdex",
    url: "https://flowdex.com.ar",
    // OG image en fondo negro coherente con el dark mode del sitio. URL nueva
    // (antes era /logolinks.jpeg) para forzar a WhatsApp/FB a re-scrapear y
    // saltar el cache que estaba mostrando el preview vacio.
    images: [
      {
        url: "/og/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Flowdex — Cursos de Trading e Inversión Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading e Inversión Online | Flowdex",
    description:
      "Cursos online de trading e inversión con metodología propia y track record verificado en prop firms.",
    images: ["/og/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    // Estrategia favicon: el .ico vive en la raiz del dominio (/favicon.ico)
    // porque Google lo pide explicitamente ahi antes que cualquier declaracion
    // del HTML. El apple-touch-icon esta en /apple-icon.png para "Add to home
    // screen" en iOS — sin esto, iOS captura el screenshot de la pagina con
    // recorte cuadrado raro.
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Resolvemos el usuario server-side para hidratar el Navbar con el estado
  // correcto desde el primer paint. Sin esto, el Navbar arranca con user=null
  // y muestra "Ingresar" hasta que el cliente termina de hacer auth.getUser(),
  // generando un flash visible al entrar logueado (mayo 2026).
  const supabaseServer = await createSupabaseServerClient()
  const initialUser = supabaseServer
    ? (await supabaseServer.auth.getUser()).data.user
    : null

  return (
    <html
      lang="es-AR"
      className={`${dmSans.variable} ${spaceMono.variable} bg-[#0A0A0A]`}
    >
      <body className="font-sans antialiased bg-[#0A0A0A] text-white">
        {/* Structured data global: Organization + WebSite. Google los usa para
            sitelinks, knowledge panel y para mostrar el sitio como entidad. */}
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
        <PostHogProvider>
          <LanguageProvider>
            <MotionProvider>
              <SmoothScrollProvider />
              <Navbar initialUser={initialUser} />
              {children}
              <Footer />
            </MotionProvider>
          </LanguageProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
