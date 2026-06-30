"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

function isExcludedPath(pathname: string): boolean {
  return pathname === "/la-dama" || pathname.startsWith("/la-dama/")
}

export function SmoothScrollProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (isExcludedPath(pathname)) return

    // Solo en dispositivos táctiles reales NO arrancamos Lenis: con syncTouch
    // secuestraba el scroll táctil nativo (cada gesto pasaba por JS), metiendo
    // latencia en INP y corriendo un RAF infinito que comía batería. El scroll
    // nativo de iOS/Android ya es suave. En desktop (puntero fino/mouse) Lenis
    // sigue funcionando igual que siempre — NO gateamos por ancho de ventana ni
    // por prefers-reduced-motion para no alterar el desktop.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    if (coarsePointer) return

    const lenis = new Lenis({
      duration: 0.96,
      smoothWheel: true,
      wheelMultiplier: 1.08,
      touchMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    let frameId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(raf)
    }

    frameId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [pathname])

  return null
}