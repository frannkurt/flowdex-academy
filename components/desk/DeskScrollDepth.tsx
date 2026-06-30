"use client"

import { useEffect } from "react"
import { track } from "./track"

// Profundidad de scroll de la landing (25/50/75/100), cada umbral una sola vez.
export function DeskScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>()
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (window.scrollY / total) * 100
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !fired.has(mark)) {
          fired.add(mark)
          track("desk_scroll_depth", { percent: mark })
        }
      }
      if (fired.size === 4) window.removeEventListener("scroll", onScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return null
}
