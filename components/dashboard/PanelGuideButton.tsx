"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Compass } from "lucide-react"

// Acceso a la guía del panel (/guia). Vive en la fila de stats del header del
// dashboard. Es un pill teal que resalta por contraste en una fila a propósito
// apagada (no por tamaño). La primera vez que el alumno entra, un puntito teal
// late al lado para invitarlo a abrirla; al hacer clic se marca como visto en
// localStorage y el puntito no vuelve a aparecer.
const SEEN_STORAGE_KEY = "flowdex:panel-guide:seen:v1"

export function PanelGuideButton() {
  // Arranca en false para que SSR y el primer render del cliente coincidan
  // (sin puntito). Recién después de hidratar leemos localStorage y, si nunca
  // la vio, lo mostramos.
  const [showDot, setShowDot] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SEEN_STORAGE_KEY) !== "true") {
        setShowDot(true)
      }
    } catch {
      // Si localStorage no está disponible, simplemente no mostramos el puntito.
    }
  }, [])

  function markSeen() {
    setShowDot(false)
    try {
      window.localStorage.setItem(SEEN_STORAGE_KEY, "true")
    } catch {
      // Sin localStorage el clic igual navega; solo no persiste el "visto".
    }
  }

  return (
    <Link
      href="/guia"
      onClick={markSeen}
      className="group inline-flex items-center gap-2 rounded-full border border-[#7DD4C0]/35 bg-[#7DD4C0]/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#7DD4C0] transition-all hover:border-[#7DD4C0]/65 hover:bg-[#7DD4C0]/20 hover:text-[#A8E8D8]"
    >
      <Compass size={13} className="shrink-0" />
      Cómo usar el panel
      {showDot && (
        <span className="relative ml-0.5 flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7DD4C0] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7DD4C0]" />
        </span>
      )}
    </Link>
  )
}
