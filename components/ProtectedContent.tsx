"use client"

import { useEffect, useRef, useState, type ClipboardEvent, type MouseEvent, type ReactNode } from "react"

type Props = {
  children: ReactNode
  /**
   * Año mostrado en el toast. Si no se pasa, usa el año actual al renderizar.
   */
  year?: number
}

/**
 * Envuelve contenido sensible para disuadir copia casual:
 * - Bloquea el menu contextual (click derecho).
 * - Deshabilita seleccion de texto y drag de imagenes via CSS.
 * - Bloquea Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+P, Ctrl+U y Ctrl+Shift+S/I.
 * - Muestra un toast educativo "Contenido protegido por Ley 11.723".
 * - Activa CSS de print global que oculta todo y deja un aviso.
 *
 * Aclaracion: estas medidas son disuasivas, no impiden la extraccion
 * a alguien con dev tools. El objetivo es educar al alumno casual y
 * reforzar la postura legal frente a un eventual incumplimiento.
 */
export function ProtectedContent({ children, year }: Props) {
  const [toastVisible, setToastVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const renderedYear = year ?? new Date().getFullYear()

  const triggerToast = () => {
    setToastVisible(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setToastVisible(false), 2800)
  }

  useEffect(() => {
    document.body.classList.add("has-protected-content")

    const handleKeydown = (event: KeyboardEvent) => {
      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform.toLowerCase().includes("mac")
      const mod = isMac ? event.metaKey : event.ctrlKey

      if (!mod) return

      const key = event.key.toLowerCase()

      // Ctrl/Cmd + C/X/S/P/U
      if (["c", "x", "s", "p", "u"].includes(key)) {
        event.preventDefault()
        triggerToast()
        return
      }

      // Ctrl/Cmd + Shift + S/I (capturas y devtools en algunos browsers)
      if (event.shiftKey && ["s", "i"].includes(key)) {
        event.preventDefault()
        triggerToast()
      }
    }

    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.body.classList.remove("has-protected-content")
      document.removeEventListener("keydown", handleKeydown)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    triggerToast()
  }

  const handleCopy = (event: ClipboardEvent) => {
    event.preventDefault()
    triggerToast()
  }

  return (
    <>
      <div
        className="flowdex-protected"
        onContextMenu={handleContextMenu}
        onCopy={handleCopy}
        onCut={handleCopy}
        onDragStart={(event) => event.preventDefault()}
      >
        {children}
      </div>

      <div
        aria-live="polite"
        className={`pointer-events-none fixed right-4 top-24 z-[100] transition-all duration-300 ${
          toastVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-8 opacity-0"
        }`}
      >
        <div className="max-w-xs rounded-xl border border-[#D4B86A]/40 bg-[#1A1408]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-[#E6DAB6]">
            Contenido protegido por Ley 11.723
          </p>
          <p className="mt-0.5 text-[10px] text-[#D4B86A]">
            © Flowdex {renderedYear} — Todos los derechos reservados
          </p>
        </div>
      </div>
    </>
  )
}
