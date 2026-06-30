import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { OrbitalIcon } from "@/components/OrbitalIcon"

export const metadata: Metadata = {
  title: "Asesores · Flowdex",
  description:
    "Quiénes respaldan a Flowdex. Asesoría pedagógica a cargo de Alicia Teresa Luján (Magíster en Ciencias de la Educación) y asesoría de marca y contenido a cargo de Camila Tamara Fit.",
  openGraph: {
    title: "Asesores · Flowdex",
    description: "El método y la marca de Flowdex, respaldados por profesionales con trayectoria real.",
    type: "article",
  },
}

type Advisor = {
  role: string
  name: string
  sub: string
  photo?: string
  initials: string
  bio: string[]
  aporte: string
  credLabel: string
  cred: { titulo: string; detalle: string }[]
  especialidades: string[]
  formacion: string[]
}

// Perfiles curados a partir de los CV (no es un volcado: se eligen las credenciales
// que sostienen cada rol). Sin datos personales.
const advisors: Advisor[] = [
  {
    role: "Asesoría pedagógica",
    name: "Alicia Teresa Luján",
    sub: "Magíster en Ciencias de la Educación · Licenciada en Gestión Educativa",
    photo: "/fotos/Aliciateresalujan.jpeg",
    initials: "AL",
    bio: [
      "Comenzó a enseñar en 1968 como Maestra Normal Nacional y ejerció de forma ininterrumpida hasta su jubilación en 2022: más de cinco décadas en el aula. En ese recorrido sumó un profesorado en Ciencias Naturales, una licenciatura en Gestión Educativa y una Maestría en Ciencias de la Educación, además de decenas de capacitaciones en evaluación, didáctica y conducción de los aprendizajes.",
      "Toda esa trayectoria se concentró en una sola pregunta: cómo aprende realmente una persona y cómo acompañar ese proceso sin atajos. Es, exactamente, la pregunta sobre la que se construye Flowdex.",
    ],
    aporte:
      "En Flowdex aporta la asesoría y revisión pedagógica del método: la mirada experta sobre cómo se enseña, se evalúa y se sostiene el aprendizaje en el tiempo. El diseño es nuestro; su asesoría nos ayuda a que esté a la altura.",
    credLabel: "Títulos",
    cred: [
      { titulo: "Máster en Ciencias de la Educación", detalle: "Universidad Tecnológica Intercontinental (Paraguay) · 2001" },
      { titulo: "Licenciada en Gestión Educativa", detalle: "Universidad Nacional de Formosa · 2008" },
      { titulo: "Profesora en Ciencias Naturales", detalle: "Instituto Superior del Profesorado A. Ruiz de Montoya · 1976" },
      { titulo: "Técnica en Educación de Adultos", detalle: "Ministerio de Cultura y Educación de la Nación · 1989" },
      { titulo: "Maestra Normal Nacional", detalle: "1968 — el comienzo de toda una vida en el aula" },
    ],
    especialidades: [
      "Evaluación educacional",
      "Teorías de enseñanza-aprendizaje",
      "Didáctica",
      "Gestión y conducción institucional",
      "Proyectos educativos institucionales",
      "Psicopedagogía",
      "Educación de adultos",
      "Tecnología educativa",
    ],
    formacion: [
      "Educar para el Futuro — Intel · Microsoft (2003)",
      "Docencia en la Educación Superior",
      "Conducción de los aprendizajes — Univ. Nacional de Misiones (1982)",
      "Profesor Orientador del Adolescente — Centro de Formación y Asistencia Psicopedagógica (1995)",
      "Psicopedagogía — Instituto de Psicología Aplicada (1984)",
      "Técnicas de evaluación — Instituto de Psicología Aplicada (1984)",
      "Informática para Docentes — Consejo General de Educación de Misiones (1995)",
    ],
  },
  {
    role: "Asesoría de marca y contenido",
    name: "Camila Tamara Fit",
    sub: "Licenciada en Marketing · Universidad Gastón Dachary",
    photo: "/fotos/camilafit.jpg",
    initials: "CF",
    bio: [
      "Marketing con foco en construcción de marca y contenido digital. Más de cinco años desarrollando identidad visual, estrategia 360°, contenido audiovisual y gestión de comunidades para marcas comerciales.",
      "Distinguida como Estudiante Destacada del Año 2024 por la Asociación Misionera de Marketing.",
    ],
    aporte:
      "En Flowdex desarrolló la identidad de marca: logo, sistema visual, diseño y contenido de las redes. Hoy sigue a cargo de toda la comunicación visual del proyecto.",
    credLabel: "Formación",
    cred: [
      { titulo: "Licenciada en Marketing", detalle: "Universidad Gastón Dachary · 2026" },
      { titulo: "Estudiante Destacada del Año 2024", detalle: "Asociación Misionera de Marketing (AMMK)" },
      { titulo: "Congreso Provincial de Marketing", detalle: "Asociación Misionera de Marketing · 2024" },
    ],
    especialidades: [
      "Branding e identidad visual",
      "Estrategia 360°",
      "Social media",
      "Diseño UX/UI",
      "Análisis de métricas",
      "Contenido audiovisual (Reels)",
      "Psicología del consumidor",
    ],
    formacion: [
      "Psicología del Consumidor — Platzi (2023)",
      "Fundamentos de Diseño UX/UI — Platzi (2023)",
      "Content Marketing para Redes Sociales — Crehana (2021)",
      "Marketing Digital para Negocios — Crehana (2021)",
    ],
  },
]

function AdvisorCard({ advisor }: { advisor: Advisor }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#D4B86A]/25 bg-gradient-to-b from-[#101010] to-[#0A0A0A]">
      <div className="relative grid gap-8 p-6 sm:p-9 md:grid-cols-[200px_1fr]">
        <div className="pointer-events-none absolute -top-8 -right-8 opacity-[0.06]">
          <OrbitalIcon size={200} animate={false} />
        </div>

        <div className="relative z-10">
          {advisor.photo ? (
            <Image
              src={advisor.photo}
              alt={advisor.name}
              width={400}
              height={400}
              quality={95}
              sizes="(max-width: 768px) 160px, 200px"
              className="h-40 w-40 rounded-2xl object-cover grayscale ring-1 ring-[#D4B86A]/30 sm:h-48 sm:w-48 md:h-[200px] md:w-[200px]"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] ring-1 ring-[#D4B86A]/30 sm:h-48 sm:w-48 md:h-[200px] md:w-[200px]">
              <span className="type-display-md text-[#D4B86A]/80">{advisor.initials}</span>
            </div>
          )}
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#D4B86A]">{advisor.role}</p>
          <h2 className="mt-2 type-display-md text-white">{advisor.name}</h2>
          <p className="mt-2 text-sm text-[#888888]">{advisor.sub}</p>

          <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
            {advisor.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-[#E0E0E0]">{advisor.aporte}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-[#1A1A1A] md:grid-cols-3">
        <div className="bg-[#0C0C0C] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#7DD4C0]">{advisor.credLabel}</p>
          <ul className="mt-4 space-y-4">
            {advisor.cred.map((c) => (
              <li key={c.titulo}>
                <p className="text-[15px] font-semibold text-white">{c.titulo}</p>
                <p className="mt-0.5 text-[13px] text-[#888888]">{c.detalle}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0C0C0C] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#7DD4C0]">Áreas de especialidad</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {advisor.especialidades.map((e) => (
              <span
                key={e}
                className="rounded-full border border-[#2A2A2A] bg-[#121212] px-3 py-1.5 text-[13px] text-[#CCCCCC]"
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0C0C0C] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#7DD4C0]">Formación destacada</p>
          <ul className="mt-4 space-y-2.5">
            {advisor.formacion.map((f) => (
              <li key={f} className="flex gap-2 text-[14px] leading-6 text-[#CCCCCC]">
                <span className="text-[#5A5A5A]">—</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default function AsesoresPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#D4B86A]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-[#7DD4C0]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href="/filosofia"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
          >
            ← Filosofía
          </Link>
          <Link
            href="/courses"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
          >
            Ver cursos
          </Link>
        </div>

        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D4B86A]">Asesores</p>
          <h1 className="mt-3 type-display-lg text-white">Quiénes respaldan a Flowdex</h1>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#D4B86A] to-[#7DD4C0]" />
          <p className="mt-6 text-[16px] leading-8 text-[#CFCFCF]">
            En Flowdex el método lo diseñamos nosotros, pero no lo hacemos solos. Nos rodeamos de
            profesionales que dedicaron su carrera a aquello que tomamos en serio —cómo se enseña, cómo
            se construye una marca— para que cada parte del proyecto esté a la altura.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {advisors.map((advisor) => (
            <AdvisorCard key={advisor.name} advisor={advisor} />
          ))}
        </div>

        <p className="mt-8 text-center text-[14px] text-[#888888]">
          <Link
            href="/filosofia"
            className="text-[#7DD4C0] underline underline-offset-2 hover:text-[#AEEBDB]"
          >
            Cómo se traduce esto en el método de Flowdex →
          </Link>
        </p>
      </section>
    </main>
  )
}
