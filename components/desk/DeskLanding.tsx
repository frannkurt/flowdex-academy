// Landing de venta de Flowdex Desk — se muestra en /desk a visitantes sin
// sesión (los logueados entran directo a la app). El clima visual es el del
// Terminal real (mono, paneles, statusbar): ya estás parado en la puerta de
// la plataforma, no en otra página de la Academy.
import { JsonLd } from "@/components/JsonLd"
import { deskLanding } from "@/lib/content/desk-landing"
import { DeskHero } from "./DeskHero"
import { DeskProblem } from "./DeskProblem"
import { DeskSolution } from "./DeskSolution"
import { DeskFeatures } from "./DeskFeatures"
import { DeskSocialProof } from "./DeskSocialProof"
import { DeskPricing } from "./DeskPricing"
import { DeskFAQ } from "./DeskFAQ"
import { DeskCTA } from "./DeskCTA"
import { DeskScrollDepth } from "./DeskScrollDepth"

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

export function DeskLanding() {
  return (
    <main className="relative bg-[#0A0A0A]">
      <JsonLd data={SOFTWARE_JSONLD} />
      <DeskScrollDepth />

      {/* Retícula sutil de fondo, clima de terminal en toda la página */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
        }}
      />

      {/* Statusbar de invitado: ya estás conectado a la plataforma */}
      <div className="relative z-10 border-b border-[#262626] bg-black/80 px-4 py-2 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6e6e6e] sm:text-[10.5px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#33b157]" />
          <span className="text-[#33b157]">conectado</span>
          <span className="hidden sm:inline">· flowdex desk · acceso de invitado</span>
          <span className="flex-1" />
          <span className="text-[#5BB8D4]">3 análisis gratis/mes</span>
        </div>
      </div>

      <div className="relative z-10">
        <DeskHero />
        <DeskProblem />
        <DeskSolution />
        <DeskFeatures />
        <DeskSocialProof />
        <DeskPricing />
        <DeskFAQ />
        <DeskCTA />
      </div>
    </main>
  )
}
