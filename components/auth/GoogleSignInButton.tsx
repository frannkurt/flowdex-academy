"use client"

// Botón "Continuar con Google" para login y register.
//
// Implementa OAuth de Google vía Supabase Auth. El flujo es:
//   1. Click → supabase.auth.signInWithOAuth({ provider: 'google' })
//   2. Browser redirige a Google → usuario autoriza
//   3. Google redirige a <origin>/auth/callback?code=...
//   4. Route handler en app/auth/callback/route.ts hace exchangeCodeForSession
//      y redirige a /dashboard.
//
// Branding del botón: el logo y la disposición siguen las guidelines oficiales
// de Google (https://developers.google.com/identity/branding-guidelines). NO
// recolorear el logo. NO modificar el SVG. El botón debe decir "Continuar con
// Google" (o "Sign in with Google" en inglés), con el logo a la izquierda.
//
// Si Google detecta que no cumplimos sus guidelines, pueden rechazarnos la
// pantalla de OAuth en producción al pasar a "Published" — por eso la
// estética conservadora con fondo blanco y texto oscuro.

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface GoogleSignInButtonProps {
  /** Texto del botón. Default: "Continuar con Google" */
  label?: string
  /** Path al que redirigir después del login exitoso. Default: "/dashboard"
   *  (manejado por el route handler de callback). */
  redirectPath?: string
  /** Callback para reportar errores al componente padre. */
  onError?: (message: string) => void
}

export function GoogleSignInButton({
  label = "Continuar con Google",
  redirectPath,
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      onError?.("Supabase no está configurado.")
      return
    }

    setLoading(true)

    // El redirectTo tiene que matchear EXACTAMENTE con uno de los URIs
    // autorizados en Google Cloud Console + Supabase dashboard. Usamos
    // window.location.origin para que funcione en localhost y producción
    // sin tocar el código (cada entorno tiene su propio URI registrado).
    const redirectTo = `${window.location.origin}/auth/callback${
      redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ""
    }`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        // queryParams: forzamos consent + selección de cuenta cada vez para
        // evitar que Google use silenciosamente la última cuenta loggeada
        // sin que el usuario lo note. Importante en compus compartidas.
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    })

    if (error) {
      onError?.(error.message || "Error al iniciar sesión con Google.")
      setLoading(false)
    }
    // Si no hubo error, Supabase nos redirige a Google y nunca llegamos
    // al setLoading(false). Es esperado — el componente se desmonta cuando
    // el browser navega.
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#2A2A2A] bg-white px-4 py-3 text-sm font-medium text-[#1F1F1F] transition-all hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <GoogleLogo />
      <span>{loading ? "Conectando..." : label}</span>
    </button>
  )
}

// Logo oficial de Google (4 colores). Tomado de Google Identity branding kit.
// NO modificar colores ni proporciones — es requerido por las guidelines.
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.71H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}
