import type { Metadata } from "next"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import TerminalClient from "@/components/lab/TerminalClient"

// Página oculta / experimental. NO se linkea en navbar ni en ningún lado.
// noindex + nofollow para que no la crawlee ningún buscador: existe solo
// para quien tenga el link directo.
export const metadata: Metadata = {
  title: "Terminal · Flowdex Lab",
  robots: { index: false, follow: false },
}

export default function TerminalLabPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070D] pt-24 pb-20 text-white">
      {/* Ambient OrbitalIcon + glows, mismo lenguaje visual que /herramientas */}
      <div className="pointer-events-none absolute right-0 top-12 opacity-[0.06] sm:right-10 sm:opacity-[0.08]">
        <OrbitalIcon size={420} animate />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#5BB8D4]/12 blur-3xl" />
        <div className="absolute bottom-40 right-[-120px] h-80 w-80 rounded-full bg-[#7DD4C0]/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#2A7E96]/10 blur-3xl" />
      </div>

      <TerminalClient />
    </main>
  )
}
