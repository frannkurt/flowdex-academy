// Generadores centralizados de JSON-LD para Flowdex.
//
// Centralizado para que Organization y los Course schemas sean consistentes
// entre páginas y para tener un solo lugar donde tocar precios/descripciones.

import { FLOWDEX_COURSES } from "@/lib/courses/catalog"

const SITE_URL = "https://flowdex.com.ar"

const FLOWDEX_ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: "Flowdex",
  alternateName: "Flowdex Academia",
  url: SITE_URL,
  logo: `${SITE_URL}/3 LOGO PNG BLANCO.png`,
  email: "flowdexacademy@flowdex.com.ar",
  description:
    "Academia online de educación financiera con cursos de trading e inversión. Metodología propia, acompañamiento en vivo y track record verificado en prop firms.",
  // contactPoint enriquece el Knowledge Panel de Google. Cuando exista un
  // LinkedIn / Twitter de la marca se suman al sameAs de abajo.
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "flowdexacademy@flowdex.com.ar",
    availableLanguage: ["Spanish", "es-AR"],
    areaServed: "Latinoamérica",
  },
  sameAs: [
    "https://www.instagram.com/flowdexx_/",
    "https://www.linkedin.com/company/flowdexacademy/",
  ],
  // El founder lleva su propio sameAs con los perfiles personales del fundador.
  // Esto le dice a Google "estos perfiles representan a la persona, no a la
  // organizacion" — coherente y sin contaminar el Knowledge Panel de marca.
  founder: {
    "@type": "Person",
    name: "Franco Escudero",
    sameAs: [
      "https://www.facebook.com/escuderofran/",
      "https://www.instagram.com/frannkurt/",
      "https://x.com/frannkurt",
    ],
  },
  // Asesoras: credenciales reales que respaldan método y marca.
  // No son founders (no corresponde en schema.org); van como members del equipo.
  member: [
    {
      "@type": "Person",
      name: "Alicia Teresa Luján",
      jobTitle: "Asesora pedagógica",
      description:
        "Magíster en Ciencias de la Educación y Licenciada en Gestión Educativa, con más de cinco décadas dedicadas a la educación.",
    },
    {
      "@type": "Person",
      name: "Camila Tamara Fit",
      jobTitle: "Asesora de marca y contenido",
      description:
        "Licenciada en Marketing (Universidad Gastón Dachary), especializada en branding, identidad visual y contenido digital.",
    },
  ],
  areaServed: {
    "@type": "Place",
    name: "Latinoamérica",
  },
  knowsLanguage: ["es", "es-AR"],
}

/**
 * Schema Organization de Flowdex. Se inyecta una sola vez en el layout raíz.
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    ...FLOWDEX_ORGANIZATION,
  }
}

/**
 * Schema WebSite con SearchAction (le dice a Google que el sitio tiene búsqueda
 * interna). Mejora la chance de que aparezca un sitelinks searchbox en la SERP.
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Flowdex",
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "es-AR",
  }
}

type CourseDescriptor = {
  slug: string
  shortDescription: string
  duration?: string
}

// Descripciones SEO-friendly por curso. El nombre y precio salen del catalog
// para no duplicar la fuente de verdad.
const COURSE_DESCRIPTORS: Record<string, CourseDescriptor> = {
  "kickstart-investment": {
    slug: "kickstart-investment",
    shortDescription:
      "Curso online introductorio de inversión. Aprendé a construir tu primera cartera con criterio, evaluar activos y tomar decisiones financieras basadas en metodología, no en intuición.",
    duration: "P3M",
  },
  "expert-investment": {
    slug: "expert-investment",
    shortDescription:
      "Curso avanzado de inversión para llevar tu cartera al siguiente nivel. Asset allocation, análisis fundamental profundo y construcción de portfolios resilientes.",
    duration: "P6M",
  },
  "kickstart-trading": {
    slug: "kickstart-trading",
    shortDescription:
      "Curso online de trading desde cero. Aprendé estructura de mercado, gestión de riesgo y a leer gráficos con una metodología clara y replicable.",
    duration: "P3M",
  },
  "trading-lab": {
    slug: "trading-lab",
    shortDescription:
      "Curso avanzado de trading sobre futuros US. Setups, ejecución en vivo, refinamiento de plan operativo y preparación para prop firms.",
    duration: "P6M",
  },
  "inner-circle": {
    slug: "inner-circle",
    shortDescription:
      "Programa premium de mentoría en trading e inversión. Tres cursos avanzados, sesiones grupales semanales con Franco y Augusto, comunidad privada e indicadores propios en TradingView.",
    duration: "P12M",
  },
}

/**
 * Schema Course individual. Cuando se aplica en la landing de un curso, Google
 * lo muestra como rich result con precio, proveedor y descripción.
 */
export function buildCourseJsonLd(slug: string) {
  const course = FLOWDEX_COURSES.find((c) => c.slug === slug)
  const descriptor = COURSE_DESCRIPTORS[slug]

  if (!course || !descriptor) return null

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}${slug === "inner-circle" ? "/inner-circle" : `/cursos/${slug}`}#course`,
    name: course.name,
    description: descriptor.shortDescription,
    provider: { "@id": `${SITE_URL}#organization` },
    inLanguage: "es-AR",
    educationalLevel: "Intermediate",
    courseMode: "Online",
    teaches: slug.includes("trading")
      ? "Trading de futuros, estructura de mercado, gestión de riesgo"
      : "Inversión, construcción de cartera, análisis fundamental",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: descriptor.duration,
      inLanguage: "es-AR",
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${slug === "inner-circle" ? "/inner-circle" : `/cursos/${slug}`}`,
    },
  }
}

/**
 * ItemList con los cursos del catálogo, para que Google los muestre como
 * carrusel en la SERP cuando se busca "cursos de trading", "cursos de
 * inversión", etc. Solo cursos públicos (excluye membresía).
 */
export function buildCoursesItemListJsonLd() {
  const slugs = [
    "kickstart-investment",
    "expert-investment",
    "kickstart-trading",
    "trading-lab",
    "inner-circle",
  ]

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cursos de Trading e Inversión — Flowdex",
    itemListElement: slugs.map((slug, index) => {
      const course = FLOWDEX_COURSES.find((c) => c.slug === slug)
      const descriptor = COURSE_DESCRIPTORS[slug]
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course?.name ?? slug,
          description: descriptor?.shortDescription ?? "",
          provider: { "@id": `${SITE_URL}#organization` },
          url: `${SITE_URL}${slug === "inner-circle" ? "/inner-circle" : `/cursos/${slug}`}`,
          offers: {
            "@type": "Offer",
            price: course?.price,
            priceCurrency: course?.currency,
          },
        },
      }
    }),
  }
}

type BreadcrumbItem = { name: string; url: string }

/**
 * BreadcrumbList para que Google muestre la jerarquía en la SERP en vez del
 * URL crudo. Se construye por página.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

type FaqItem = { question: string; answer: string }

/**
 * FAQ de la home en es-AR (idioma default del sitio). Hardcodeado aca para que
 * el schema lo lea el crawler sin ejecutar React (i18n del FAQ component vive
 * en client). Si se actualizan las preguntas en `lib/language-context.tsx`,
 * actualizar tambien aca para que SERP y UI no diverjan.
 */
export const HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Necesito experiencia previa para empezar?",
    answer:
      "No, nuestros cursos Kickstart están diseñados para principiantes absolutos. Te guiamos paso a paso desde los fundamentos.",
  },
  {
    question: "¿Cuál es la diferencia entre Inversión y Trading?",
    answer:
      "Inversión construye patrimonio a largo plazo con análisis fundamental y gestión de portafolios. Trading opera mercados en marcos temporales cortos con sistemas estructurados y gestión profesional de riesgo.",
  },
  {
    question: "¿Puedo hacer upgrade entre niveles?",
    answer:
      "Sí, si compraste Kickstart podés hacer upgrade al nivel avanzado pagando solo la diferencia ($200 USD).",
  },
  {
    question: "¿Cómo accedo al contenido después de pagar?",
    answer:
      "Recibís acceso inmediato al contenido completo en la plataforma. En Telegram vas a encontrar contenido adicional, novedades y extras para alumnos.",
  },
  {
    question: "¿Los precios están en USD? ¿Puedo pagar en pesos?",
    answer:
      "Sí, los precios están en USD. MercadoPago te muestra el equivalente en pesos al momento del pago. También aceptamos pagos en criptomonedas a través de NowPayments.",
  },
  {
    question: "¿Qué plataformas necesito para el curso de Trading?",
    answer:
      "Necesitás TradingView (versión gratuita funciona) y un broker. Te enseñamos a configurar todo en el curso.",
  },
]

/**
 * FAQPage para que las preguntas frecuentes aparezcan como acordeón
 * desplegable en la SERP. Buenísimo para CTR.
 */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
