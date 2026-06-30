"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isForcedReset, setIsForcedReset] = useState(false)

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("forced") === "1"
    setIsForcedReset(forced)
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!supabase) {
      setErrorMessage("Falta configurar Supabase en variables NEXT_PUBLIC. Revisa el entorno.")
      return
    }

    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage("La contraseña debe tener al menos una letra y un número.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { error } = await supabase.auth.updateUser({
      password,
      data: {
        must_change_password: false,
      },
    })

    setLoading(false)

    if (error) {
      setErrorMessage(getAuthErrorMessage(error.message))
      return
    }

    setSuccessMessage("Contraseña actualizada correctamente.")

    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 900)
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
              NUEVA CONTRASEÑA
            </h1>
            <p className="text-sm text-[#888888]">
              Define una nueva contraseña para volver a ingresar a tu cuenta.
            </p>
            {isForcedReset && (
              <p className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-2 text-xs text-[#F2B3B3]">
                Por seguridad debes actualizar tu contraseña para continuar.
              </p>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="password">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Mínimo 8 caracteres, una letra y un número"
              />
              <p className="mt-2 text-xs text-[#666666]">
                Al menos 8 caracteres, con una letra y un número.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Repite tu contraseña"
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
              disabled={loading}
              className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
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
