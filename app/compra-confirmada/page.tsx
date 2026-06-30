import type { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"

export const metadata: Metadata = {
  title: "Pago recibido — Flowdex",
  robots: { index: false, follow: false },
}

/**
 * Landing post-pago del checkout exprés (compra sin sesión). El comprador no
 * tiene cookie de login, así que no lo mandamos al dashboard: le explicamos
 * que el acceso llega por email apenas el pago se acredita.
 */
export default function CompraConfirmadaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <OrbitalIcon size={520} animate />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
        <div className="glass-card w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#7DD4C0]/30 bg-[#7DD4C0]/10">
            <Mail className="h-7 w-7 text-[#7DD4C0]" />
          </div>

          <h1 className="type-display-md text-white">PAGO RECIBIDO</h1>

          <p className="mt-4 text-sm leading-relaxed text-[#BBBBBB]">
            Apenas se acredite, te llega un email con tu acceso al curso: ahí
            elegís tu contraseña y entrás al panel. Suele tardar menos de un
            minuto; con cripto puede demorar unos minutos más.
          </p>

          <p className="mt-4 text-xs leading-relaxed text-[#888888]">
            Si no lo ves, revisá la carpeta de spam. ¿No llegó? Escribinos
            respondiendo cualquier email de Flowdex o desde la comunidad — lo
            resolvemos al toque.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
