import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Hero } from "@/components/Hero"
import { Dolor } from "@/components/Dolor"
import { Protocol } from "@/components/Protocol"
import { TwoPaths } from "@/components/TwoPaths"
// Versión vieja del listado de cursos (detalle completo en el landing).
// La dejamos importada como comentario para poder revertir rápido si
// el grid compacto no convence: comentar la línea de CoursesGrid abajo
// y descomentar el import + el render de CoursesSection.
// import { CoursesSection } from "@/components/CoursesSection"
import Certificates from "@/components/Certificates"
import { InnerCircle } from "@/components/InnerCircle"
import { JsonLd } from "@/components/JsonLd"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  buildCoursesItemListJsonLd,
  buildFaqJsonLd,
  HOME_FAQ_ITEMS,
} from "@/lib/seo/structured-data"

// Componentes cargados con dynamic() para sacarlos del bundle inicial de la
// home. SSR queda activado (default), asi que el HTML llega renderizado
// desde el servidor y el SEO no se toca; lo unico que se difiere es la
// hidratacion del JS. Esto desarma los chunks pesados que detecto Lighthouse
// (animaciones de framer-motion + OrbitalIcons multiplicados por card).
// Sin layout shift porque el HTML pintado es identico al de antes.
const CoursesGrid = dynamic(() =>
  import("@/components/CoursesGrid").then((m) => ({ default: m.CoursesGrid })),
)
const FilosofiaSneakPeek = dynamic(() =>
  import("@/components/FilosofiaSneakPeek").then((m) => ({ default: m.FilosofiaSneakPeek })),
)
const Mentors = dynamic(() =>
  import("@/components/Mentors").then((m) => ({ default: m.Mentors })),
)
const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((m) => ({ default: m.Testimonials })),
)
const FAQ = dynamic(() => import("@/components/FAQ").then((m) => ({ default: m.FAQ })))
const CTAFinal = dynamic(() =>
  import("@/components/CTAFinal").then((m) => ({ default: m.CTAFinal })),
)

// Metadata específica de la home. Override del default del layout para apuntar
// con más fuerza a las queries de descubrimiento ("cursos de trading", "cursos
// de inversión", "aprender a invertir desde cero").
export const metadata: Metadata = {
  title: "Cursos de Trading e Inversión Online | Flowdex",
  description:
    "Academia online de trading e inversión con clases en vivo, metodología propia y track record verificado en prop firms. Cinco programas para todos los niveles, desde Kickstart hasta Inner Circle.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cursos de Trading e Inversión Online | Flowdex",
    description:
      "Cinco programas con clases en vivo y mentoría real. Track record verificado en prop firms. Aprendé trading o inversión con criterio.",
    url: "https://flowdex.com.ar",
    // Override explicito para no heredar del layout: aunque hoy coincide, deja
    // documentado que la home apunta a la OG de marca (fondo negro, esfera +
    // wordmark) y permite cambiarla independiente en el futuro.
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
    images: ["/og/og-home.jpg"],
  },
}

export default async function Home() {
  let coursePrices: Record<string, number> = {}

  try {
    const supabase = await createSupabaseServerClient()
    if (supabase) {
      const { data } = await supabase.from("courses").select("slug, price")
      if (data) {
        coursePrices = Object.fromEntries(data.map((c) => [c.slug, Number(c.price)]))
      }
    }
  } catch {}

  const innerCirclePrice = coursePrices["inner-circle"]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Carrusel de cursos como ItemList: cuando Google detecta este schema en
          una home con varios Course schemas hijos, suele mostrar los cursos
          como rich result horizontal en la SERP. */}
      <JsonLd data={buildCoursesItemListJsonLd()} />
      {/* FAQPage schema: hace que las 6 preguntas frecuentes del bloque FAQ de
          mas abajo aparezcan como acordeon desplegable en la SERP de Google.
          Roba pantalla a competidores y sube CTR. */}
      <JsonLd data={buildFaqJsonLd(HOME_FAQ_ITEMS)} />

      {/* Glows ambientales. En mobile el blur grande (filtro GPU caro que se
          repinta en cada scroll) se reemplaza por un radial-gradient estático
          equivalente: mismo aspecto, costo de paint casi nulo. Desktop intacto. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-[#5BB8D4]/7 blur-[110px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(91,184,212,0.07),transparent_72%)]" />
        <div className="absolute right-[6%] top-[44%] h-72 w-72 rounded-full bg-[#7DD4C0]/7 blur-[120px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(125,212,192,0.07),transparent_72%)]" />
        <div className="absolute left-1/2 top-[73%] h-64 w-[34rem] -translate-x-1/2 rounded-full bg-[#D4B86A]/4 blur-[130px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(212,184,106,0.04),transparent_72%)]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <Dolor />
        <Protocol innerCirclePrice={innerCirclePrice} />
        <TwoPaths />
        {/* <CoursesSection coursePrices={coursePrices} /> */}
        <CoursesGrid coursePrices={coursePrices} showAITutorBanner />
        <InnerCircle price={innerCirclePrice} />
        <Certificates />
        <FilosofiaSneakPeek />
        <Testimonials />
        <Mentors />
        <FAQ />
        <CTAFinal />
      </div>
    </main>
  )
}
