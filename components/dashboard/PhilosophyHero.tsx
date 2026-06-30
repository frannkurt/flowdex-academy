import Link from "next/link"
import { OrbitalIcon } from "@/components/OrbitalIcon"

export function PhilosophyHero() {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#D4B86A]/20 bg-[#070707]">
      {/* Acento dorado contenido — sin lavar el panel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,184,106,0.10),_transparent_50%)]" />
      <div className="pointer-events-none absolute -bottom-28 -right-32 opacity-[0.05]">
        <OrbitalIcon size={520} animate={false} />
      </div>

      <div className="relative grid gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4B86A]">Documento exclusivo</p>
          <h1 className="mt-3 text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
            Filosofía Flowdex
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-[#B0B0B0]">
            La carta fundacional y los principios que definen nuestro método.
            Recomendado leerla antes de profundizar en los módulos.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/filosofia"
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#E2CB82] via-[#D4B86A] to-[#B8964A] px-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1408] transition-all hover:from-[#E8D391] hover:to-[#C2A052] hover:shadow-[0_8px_24px_-6px_rgba(212,184,106,0.45)]"
            >
              Leer Filosofía Flowdex
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#7A6E50]">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              12 min de lectura · sólo para alumnos
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-2">
          {[
            { k: "Método sobre motivación", v: "Sistemas que sostienen, no consignas que se gastan." },
            { k: "Lo aburrido es rentable", v: "Journal, repetición, gestión del 2 %." },
            { k: "El alumno como protagonista", v: "Vos te transformás aplicando." },
          ].map((p) => (
            <div
              key={p.k}
              className="rounded-lg border border-[#D4B86A]/12 bg-[#0A0A0A]/60 px-3.5 py-2"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B86A]/80">{p.k}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[#9A8E72]">{p.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
