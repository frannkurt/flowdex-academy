"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// Supabase impone un intervalo mínimo entre emails de reset para el mismo
// address. Si el usuario reenvía antes, choca con "esperá unos segundos" y se
// confunde. Bloqueamos el botón con una cuenta regresiva propia para que no
// llegue siquiera a gatillar ese límite.
const RESEND_COOLDOWN_SECONDS = 60

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [sentOnce, setSentOnce] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }
    const timer = window.setInterval(() => {
      setCooldown((previous) => (previous <= 1 ? 0 : previous - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!supabase) {
      setErrorMessage("Falta configurar Supabase en variables NEXT_PUBLIC. Revisa el entorno.")
      return
    }

    if (cooldown > 0) {
      return
    }

    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const redirectTo = `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(getAuthErrorMessage(error.message))
      return
    }

    setSentOnce(true)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    setSuccessMessage(
      "Listo. Si ese email tiene una cuenta, te llega un enlace para crear una contraseña nueva. Revisá la bandeja de entrada y la carpeta de spam — puede tardar un par de minutos."
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <OrbitalIcon size={520} animate />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        {/* Entrada resuelta en CSS (.auth-card-enter), no en framer: con
            motion.div el form viajaba con opacity:0 inline y quedaba
            invisible hasta hidratar — pantalla negra en celulares lentos. */}
        <div className="auth-card-enter glass-card w-full max-w-md rounded-2xl p-6 sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <OrbitalIcon size={56} animate={false} />
            <h1 className="type-display-md text-white">
              RECUPERAR ACCESO
            </h1>
            <p className="text-sm text-[#888888]">
              Ingresa tu email y te enviamos un enlace para crear una nueva contraseña.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="tu@email.com"
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="rounded-lg border border-[#2D5A4A] bg-[#12201B] px-3 py-2 text-sm text-[#B9E7D8]">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
            >
              {loading
                ? "Enviando..."
                : cooldown > 0
                  ? `Podés reenviar en ${cooldown}s`
                  : sentOnce
                    ? "Reenviar enlace"
                    : "Enviar enlace"}
            </button>

            {sentOnce && (
              <p className="text-center text-xs text-[#888888]">
                ¿No te llegó? Revisá spam antes de reenviar. Si seguís sin recibirlo,
                escribinos y te damos una mano.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[#888888]">
            <Link href="/login" className="font-medium text-[#7DD4C0] hover:text-[#5BB8D4]">
              Volver a iniciar sesion
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
