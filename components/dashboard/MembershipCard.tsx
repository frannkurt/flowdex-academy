import Link from "next/link"
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import type { MembershipStatus } from "@/lib/membership/status"

type Props = {
  status: MembershipStatus
}

// Formatea fecha como "12 de junio de 2026"
function formatFecha(date: Date) {
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function MembershipCard({ status }: Props) {
  if (!status) {
    return (
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-gradient-to-br from-[#121212] via-[#101010] to-[#0A0A0A]">
        <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#888888]">
              Membresía
            </p>
            <h3 className=" text-2xl tracking-tight text-white sm:text-3xl">
              No tenés una membresía activa
            </h3>
            <p className="text-sm text-[#AAAAAA] leading-relaxed max-w-xl">
              Activá tu membresía mensual para acceder a la comunidad privada de
              Discord y Telegram del Inner Circle.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Link
              href="/checkout/membresia"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#7DD4C0] bg-[#7DD4C0]/10 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7DD4C0] transition-colors hover:bg-[#7DD4C0] hover:text-black"
            >
              Activar membresía
            </Link>
            <p className="text-[11px] text-[#888888]">$50 USD por 30 días</p>
          </div>
        </div>
      </div>
    )
  }

  if (status.state === "active") {
    return (
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#7DD4C0]/25 bg-gradient-to-br from-[#0F1A18] via-[#0F1414] to-[#0A0A0A]">
        <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#7DD4C0]" />
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0]">
                Membresía activa
              </p>
            </div>
            <h3 className=" text-2xl tracking-tight text-white sm:text-3xl">
              Inner Circle Community
            </h3>
            <p className="text-sm text-[#AAAAAA] leading-relaxed max-w-xl">
              Tu acceso a Discord y Telegram del Inner Circle está activo. Vence el{" "}
              <span className="text-white font-medium">{formatFecha(status.expiresAt)}</span>.
              Te quedan {status.daysRemaining} días.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] px-3 py-2">
              <Calendar size={14} className="text-[#7DD4C0]" />
              <span className="text-xs text-[#CCCCCC]">
                Próxima renovación: {formatFecha(status.expiresAt)}
              </span>
            </div>
            <p className="text-[11px] text-[#666666]">
              $50 USD/mes. Renovación manual desde el botón antes del vencimiento.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // status.state === "expiring_soon"
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-[#D4B86A]/40 bg-gradient-to-br from-[#1A1610] via-[#141210] to-[#0A0A0A]">
      <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-[#D4B86A]" />
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4B86A]">
              Tu membresía vence pronto
            </p>
          </div>
          <h3 className=" text-2xl tracking-tight text-white sm:text-3xl">
            {status.daysRemaining === 1
              ? "Vence mañana"
              : `Te quedan ${status.daysRemaining} días`}
          </h3>
          <p className="text-sm text-[#CCCCCC] leading-relaxed max-w-xl">
            Vence el <span className="text-white font-medium">{formatFecha(status.expiresAt)}</span>.
            Renová para no perder el acceso a Discord y Telegram del Inner Circle.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Link
            href="/checkout/membresia"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#D4B86A] bg-[#D4B86A]/10 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4B86A] transition-colors hover:bg-[#D4B86A] hover:text-black"
          >
            Renovar membresía
          </Link>
          <p className="text-[11px] text-[#888888]">$50 USD por 30 días más</p>
        </div>
      </div>
    </div>
  )
}
