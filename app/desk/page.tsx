import { JsonLd } from "@/components/JsonLd"
import { DeskLandingTerminal } from "@/components/desk/DeskLandingTerminal"
import { deskLanding } from "@/lib/content/desk-landing"

// /desk es la página de VENTA del Desk, para todos (logueado o no): así cualquiera
// puede ver los planes, comprar y compartir el link. La app del Desk vive en su
// propio servicio (Python, desk.flowdex.com.ar), a la que se entra por "Ingresar".
// El intento de Desk nativo en Next se descartó (2026-06-10).

// JSON-LD del producto (vive acá porque la landing default es client component).
const SOFTWARE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Flowdex Desk",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Research desk con IA: analiza fundamentals, técnico, macro y noticias de más de 200 activos y entrega una lectura auditable con el método Flowdex.",
  url: "https://flowdex.com.ar/desk",
  offers: deskLanding.pricing.plans.map((p) => ({
    "@type": "Offer",
    name: `Flowdex Desk — ${p.name}`,
    price: p.price.replace("USD ", ""),
    priceCurrency: "USD",
  })),
  publisher: { "@type": "Organization", name: "Flowdex Academy", url: "https://flowdex.com.ar" },
}

export const metadata = {
  title: "Flowdex Desk — Tu mesa de research personal",
  description:
    "La lectura completa de un activo en minutos: 15 agentes de IA analizan fundamentals, técnico, macro y noticias y entregan un tablero auditable. 2 análisis gratis.",
  alternates: { canonical: "https://flowdex.com.ar/desk" },
  openGraph: {
    title: "Flowdex Desk — Tu mesa de research personal",
    description:
      "Un equipo de analistas de IA examina cualquier activo — argentino o global — y te entrega una lectura auditable con el método Flowdex. Sin señales, sin suscripción.",
    url: "https://flowdex.com.ar/desk",
    type: "website",
  },
}

// Página de venta del Desk (híbrido terminal). Las CTAs llevan a la auth del Desk
// (desk.flowdex.com.ar) y al checkout de packs (/desk/checkout, sin login).
function Landing() {
  return (
    <>
      <JsonLd data={SOFTWARE_JSONLD} />
      <DeskLandingTerminal />
    </>
  )
}

export default function DeskPage() {
  return <Landing />
}
