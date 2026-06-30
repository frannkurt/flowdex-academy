import Link from "next/link"

export default function CoursesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0]">Flowdex Community</p>
        <h1 className="mt-4  text-4xl tracking-tight sm:text-5xl">Explora nuestros cursos</h1>
        <p className="mt-4 max-w-2xl text-sm text-[#888888] sm:text-base">
          Descubrí los programas de inversión y trading de Flowdex, compará niveles y elegí el camino que mejor se adapte a tu etapa actual.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#kickstart-investment"
            className="rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
          >
            Ver cursos de inversión
          </Link>
          <Link
            href="/#kickstart-trading"
            className="rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#7DD4C0]/60"
          >
            Ver cursos de trading
          </Link>
        </div>
      </section>
    </main>
  )
}
