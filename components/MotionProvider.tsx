"use client"

// Provider de animación del sitio. Envuelve toda la app en LazyMotion para
// que framer-motion no cargue su engine completo (~34 KB+) en el bundle
// global de todas las rutas. En su lugar:
//   - Los componentes usan `m.div` (no `motion.div`): el componente `m` pesa
//     apenas ~5 KB.
//   - Las features de animación se cargan UNA vez vía `domAnimation` (~15 KB):
//     cubre animaciones, variants, exit (AnimatePresence) y gestos hover/tap/
//     focus. NO incluye drag ni layout animations, que el sitio no usa.
//
// Net: el framer global baja de ~70 KB de features sin usar a ~20 KB reales.
// Esto aliviana el critical path en TODAS las rutas (la home y /programa-
// fundador cargaban estos chunks aunque su contenido sea casi estático).
//
// NOTA: no usamos MotionConfig reducedMotion="user". El sitio anima siempre,
// igual que antes, sin atender prefers-reduced-motion (era un cambio que
// alteraba el desktop de quienes tienen "reducir movimiento" activado).

import { LazyMotion, domAnimation } from "framer-motion"

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
