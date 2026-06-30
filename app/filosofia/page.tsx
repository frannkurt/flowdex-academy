import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { filosofiaFlowdex } from "@/lib/content/filosofia-flowdex"

export const metadata: Metadata = {
  title: "Filosofía Flowdex",
  description:
    "La carta fundacional de Flowdex. Lo que prometemos, cómo decidimos, qué no hacemos. Documento exclusivo de método y principios para alumnos y curiosos.",
  openGraph: {
    title: "Filosofía Flowdex",
    description:
      "La carta fundacional. Método sobre motivación, lo aburrido es rentable, el alumno como protagonista.",
    type: "article",
  },
}

const topSections = filosofiaFlowdex.secciones.slice(0, 2)
const middleSections = filosofiaFlowdex.secciones.slice(2, 5)
const bottomSections = filosofiaFlowdex.secciones.slice(5)

type NarrativeSection = (typeof filosofiaFlowdex.secciones)[number]

function sectionTitleClass(title: string) {
  const premiumTitles = new Set(["Lo que si prometemos", "Cómo decidimos", "Cierre"])
  return premiumTitles.has(title) ? "text-[#D4B86A]" : "text-[#7DD4C0]"
}

function NarrativeBlock({ section }: { section: NarrativeSection }) {
  return (
    <section className="border-t border-[#1F1F1F] pt-8">
      <h2 className={`type-display-sm ${sectionTitleClass(section.titulo)}`}>
        {section.titulo}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
        {section.parrafos.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

export default function FilosofiaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#7DD4C0]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-[#5BB8D4]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-8">
        <article id="filosofia-top" className="mx-auto max-w-5xl space-y-6">
          <header className="relative overflow-hidden rounded-2xl border border-[#3B3324]/45 bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(10,10,10,0.98))] p-6 sm:p-9">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
              <OrbitalIcon size={420} animate={false} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,184,106,0.06),transparent_60%)]" />

            <div className="relative z-10 flex flex-wrap items-center gap-3 border-b border-[#1F1F1F] pb-5">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
              >
                Volver al dashboard
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
              >
                Ver cursos
              </Link>
              <div className="ml-auto hidden items-center gap-2.5 rounded-xl border border-[#2F4D50] bg-gradient-to-r from-[#11181A] to-[#0F1416] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7DD4C0] shadow-[0_0_20px_rgba(91,184,212,0.12)] sm:inline-flex">
                <OrbitalIcon size={24} animate={false} className="opacity-85" />
                Flowdex
              </div>
            </div>

            <div className="relative z-10 mt-6 max-w-4xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D4B86A]">
                {filosofiaFlowdex.carta.etiqueta}
              </p>
              <h1 className="mt-3 type-display-lg text-white">
                {filosofiaFlowdex.carta.titulo}
              </h1>
              <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#D4B86A] to-[#7DD4C0]" />

              <div className="mt-7 space-y-5 text-[16px] leading-8 text-[#CFCFCF]">
                {filosofiaFlowdex.carta.parrafos.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-7 flex flex-col items-center gap-3 border-t border-[#1F1F1F] pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <p className="text-base text-white">{filosofiaFlowdex.carta.firma.nombre}</p>
                <p className="mt-1 text-xs text-[#888888]">Fundador de Flowdex</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A5A]">Documento interno</span>
            </div>
          </header>

          <section className="relative overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E]/85 px-6 py-7 text-center sm:px-8">
            <div className="pointer-events-none absolute -top-6 -right-6 opacity-15">
              <OrbitalIcon size={96} animate={false} />
            </div>
            <p className="text-xs font-medium tracking-[0.24em] text-[#D4B86A]">{filosofiaFlowdex.marca.kicker}</p>
            <h2 className="mt-2 type-display-md text-white">
              {filosofiaFlowdex.marca.titulo}
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-base italic text-[#AAAAAA] sm:text-lg">
              {filosofiaFlowdex.marca.bajada}
            </p>
          </section>

          {topSections.map((section) => (
            <NarrativeBlock key={section.id} section={section} />
          ))}

          <section className="border-t border-[#1F1F1F] pt-8">
            <h2 className="type-display-sm text-[#7DD4C0]">Cómo trabajamos</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {filosofiaFlowdex.comoTrabajamos.map((item) => (
                <div key={item.titulo} className="rounded-xl border border-[#252525] bg-[#121212] p-4">
                  <h3 className="text-base font-semibold text-white">{item.titulo}</h3>
                  <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-[#CCCCCC]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {middleSections.map((section) => (
            <NarrativeBlock key={section.id} section={section} />
          ))}

          {/* Asesoría pedagógica: credencial real que respalda el claim de "método".
              Bloque sobrio con acento dorado (credibilidad, sin ostentación). */}
          <section className="relative overflow-hidden rounded-2xl border border-[#D4B86A]/30 bg-gradient-to-b from-[#101010] to-[#0A0A0A] p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-6 -right-6 opacity-10">
              <OrbitalIcon size={96} animate={false} />
            </div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 sm:gap-5">
                <Image
                  src="/fotos/Aliciateresalujan.jpeg"
                  alt="Alicia Teresa Luján"
                  width={192}
                  height={192}
                  quality={95}
                  sizes="96px"
                  className="h-20 w-20 flex-shrink-0 rounded-xl object-cover grayscale ring-1 ring-[#D4B86A]/25 sm:h-24 sm:w-24"
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#D4B86A]">
                    Asesoría pedagógica
                  </p>
                  <h2 className="mt-2 type-display-sm text-white">Alicia Teresa Luján</h2>
                  <p className="mt-1 text-sm text-[#888888]">
                    Magíster en Ciencias de la Educación · Licenciada en Gestión Educativa (Universidad Nacional de Formosa)
                  </p>
                </div>
              </div>
              <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#D4B86A] to-[#7DD4C0]" />
              <div className="mt-5 max-w-3xl space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  El método de Flowdex lo diseñamos nosotros, con su asesoría y revisión pedagógica: más
                  de cinco décadas en el aula (1968–2022), con especialidad en teorías del aprendizaje,
                  evaluación y didáctica.
                </p>
                <p className="text-[#E0E0E0]">
                  Por eso el método se sostiene sobre pedagogía real, no sobre entusiasmo.
                </p>
              </div>
              <Link
                href="/asesores"
                className="mt-5 inline-flex items-center gap-1 text-sm text-[#D4B86A] underline underline-offset-2 transition-colors hover:text-[#E4CE8A]"
              >
                Ver su trayectoria completa →
              </Link>
            </div>
          </section>

          <section className="border-t border-[#1F1F1F] pt-8">
            <h2 className="type-display-sm text-[#7DD4C0]">
              Lo que no hacemos, y por qué
            </h2>
            <div className="mt-5 space-y-3">
              {filosofiaFlowdex.loQueNoHacemos.map((item) => (
                <div key={item.titulo} className="rounded-xl border border-[#252525] bg-[#121212] p-4">
                  <h3 className="text-base font-semibold text-white">{item.titulo}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-[#CCCCCC]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#1F1F1F] pt-8">
            <h2 className="type-display-sm text-[#7DD4C0]">El tiempo como filtro</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
              <p>La formación seria toma tiempo. Eso es un hecho, no una opinión.</p>
              <p>Un alumno honesto que arranca hoy:</p>
            </div>
            <ol className="mt-5 space-y-2.5">
              {filosofiaFlowdex.tiempo.map((milestone) => (
                <li
                  key={milestone.label}
                  className="grid grid-cols-[96px_1fr] items-baseline gap-4 rounded-lg border border-[#1B1B1B] bg-[#0D0D0D]/60 px-3 py-2.5"
                >
                  <span className="text-lg font-semibold tabular-nums text-[#D4B86A]">{milestone.label}</span>
                  <span className="text-[15px] leading-7 text-[#CCCCCC]">{milestone.text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[15px] leading-7 text-[#CCCCCC]">
              Ese cronograma no se acorta. Quien diga lo contrario, miente o no entiende lo que enseña.
              Nuestra propuesta es honrar ese tiempo, no falsificarlo.
            </p>
          </section>

          {bottomSections.map((section) => (
            <NarrativeBlock key={section.id} section={section} />
          ))}

          <section className="border-t border-[#1F1F1F] pt-8">
            <h2 className={`type-display-sm ${sectionTitleClass("Cómo decidimos")}`}>Cómo decidimos</h2>
            <p className="mt-3 text-[15px] leading-7 text-[#CCCCCC]">
              Cada decisión de producto en Flowdex pasa por siete preguntas. Las hacemos nosotros, no el alumno.
              Pero te las compartimos para que entiendas en qué cabeza fue construido todo lo que vas a usar.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#5BB8D4]">Tienen que responderse NO</p>
                <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                  {filosofiaFlowdex.comoDecidimos.no.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#5A5A5A]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7DD4C0]">Tienen que responderse SI</p>
                <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                  {filosofiaFlowdex.comoDecidimos.si.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#5A5A5A]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-7 text-center text-[15px] italic leading-7 text-[#AAAAAA]">
              {filosofiaFlowdex.comoDecidimos.cierre}
            </p>
            <p className="text-center type-headline text-[#D4B86A]">
              {filosofiaFlowdex.comoDecidimos.lema}
            </p>
          </section>

          <section className="border-t border-[#1F1F1F] pt-8">
            <h2 className={`type-display-sm ${sectionTitleClass(filosofiaFlowdex.cierre.titulo)}`}>
              {filosofiaFlowdex.cierre.titulo}
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
              {filosofiaFlowdex.cierre.parrafos.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-[#D4B86A]/30 bg-gradient-to-b from-[#101010] to-[#0A0A0A] p-7 sm:p-10">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
              <OrbitalIcon size={520} animate={false} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[#0A0A0A]/45" />

            <div className="relative z-10">
              <h2 className="type-display-sm text-[#D4B86A]">
                {filosofiaFlowdex.paraVos.titulo}
              </h2>
              <div className="mt-5 max-w-3xl space-y-2 text-[16px] leading-7 text-[#D0D0D0]">
                {filosofiaFlowdex.paraVos.parrafos.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-4 max-w-3xl space-y-1 text-[16px] leading-7 text-[#E0E0E0]">
                {filosofiaFlowdex.paraVos.gracias.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-8 border-t border-[#2A2A2A] pt-7 text-center">
                <p className="type-subheadline text-white">{filosofiaFlowdex.paraVos.firma.nombre}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#888888]">
                  {filosofiaFlowdex.paraVos.firma.rol}
                </p>
              </div>
            </div>
          </section>

          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <footer className="text-[11px] tracking-wide text-[#5A5A5A] sm:max-w-[60%]">
              Documento confidencial · Acceso exclusivo para alumnos de Flowdex · No redistribuir
              </footer>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
                >
                  Volver al dashboard
                </Link>
                <Link
                  href="#filosofia-top"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
                >
                  Volver arriba
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
