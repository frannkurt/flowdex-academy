/**
 * Sistema de motion propio de Flowdex (mayo 2026).
 *
 * Reemplaza las combinaciones ad-hoc de `initial={{...}} animate={...}
 * transition={...}` que se acumulaban en cada componente (cada uno con
 * su duration: 0.6 o 0.8, su y: 20 o 30, delays distintos). Estos
 * presets unifican el lenguaje de movimiento del sitio entero.
 *
 * Tokens base centralizados acá. Si en el futuro querés tunear el
 * "feel" del sitio (más rápido, más lento, más suave), tocás los
 * valores DURATION_* / EASE_* / DISTANCE_* y se propaga a todos los
 * componentes que usan los presets — sin auditar archivos.
 *
 * Las CSS variables equivalentes están en app/globals.css (--motion-*),
 * útiles para componentes CSS-only que no usan framer-motion.
 *
 * Uso:
 *   import { fadeUpProps, viewport } from "@/lib/motion"
 *   <motion.div {...fadeUpProps}>...</motion.div>
 *
 *   o con variants para staggers:
 *   import { staggerParent, fadeUp } from "@/lib/motion"
 *   <motion.ul variants={staggerParent} initial="hidden" whileInView="visible" viewport={viewport}>
 *     <motion.li variants={fadeUp}>...</motion.li>
 *   </motion.ul>
 */

// ===== Tokens base =====

// Easings como cubic-bezier arrays (formato que entiende framer-motion).
// EASE_OUT: curva apple-like, salida suave. La más usada — sensación
// "elegante deslizando hacia adentro".
// EASE_IN_OUT: simétrica, para movimientos bidireccionales (hover, etc).
const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

// Duraciones en segundos (framer-motion usa segundos, no ms).
const DURATION_FAST = 0.3
const DURATION_BASE = 0.5
const DURATION_SLOW = 0.7

// Distancias de translate en pixels.
const DISTANCE_SM = 16
const DISTANCE_MD = 24
const DISTANCE_LG = 32

// ===== Viewport default para whileInView =====

// Trigger una sola vez, con margen negativo para anticipar la entrada
// antes de que el elemento esté 100% visible. Mismo patrón que ya
// usaban todos los componentes ad-hoc del sitio.
export const viewport = { once: true, margin: "-80px" } as const

// ===== Variants reutilizables (para staggers o casos complejos) =====

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_BASE, ease: EASE_OUT },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: DISTANCE_MD },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_BASE, ease: EASE_OUT },
  },
}

export const fadeUpSubtle = {
  hidden: { opacity: 0, y: DISTANCE_SM },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_FAST, ease: EASE_OUT },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -DISTANCE_LG },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_BASE, ease: EASE_OUT },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: DISTANCE_LG },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_BASE, ease: EASE_OUT },
  },
}

// Contenedor para animar hijos en cascada. Los hijos deben usar
// `variants={fadeUp}` (o cualquiera de los presets de variants).
// `staggerChildren`: delay entre cada hijo. `delayChildren`: delay
// antes de empezar la cascada.
export const staggerParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// ===== Props shorthand (formato más cómodo para casos simples) =====

// Aplicación típica: <motion.div {...fadeUpProps}>...</motion.div>
// Encapsula initial + whileInView + viewport + transition en un solo
// spread. Para casos donde no necesitás controlar variants.

export const fadeUpProps = {
  initial: { opacity: 0, y: DISTANCE_MD },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: DURATION_BASE, ease: EASE_OUT },
}

export const fadeUpSubtleProps = {
  initial: { opacity: 0, y: DISTANCE_SM },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: DURATION_FAST, ease: EASE_OUT },
}

export const fadeInProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport,
  transition: { duration: DURATION_BASE, ease: EASE_OUT },
}

export const slideInLeftProps = {
  initial: { opacity: 0, x: -DISTANCE_LG },
  whileInView: { opacity: 1, x: 0 },
  viewport,
  transition: { duration: DURATION_BASE, ease: EASE_OUT },
}

export const slideInRightProps = {
  initial: { opacity: 0, x: DISTANCE_LG },
  whileInView: { opacity: 1, x: 0 },
  viewport,
  transition: { duration: DURATION_BASE, ease: EASE_OUT },
}

// Variante de entrada inmediata (no whileInView, animate directo).
// Para el Hero u otros elementos above-the-fold que cargan ya visibles.
export const fadeUpOnLoad = {
  initial: { opacity: 0, y: DISTANCE_MD },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION_SLOW, ease: EASE_OUT },
}

// Helper para generar un fadeUp con delay específico (útil para
// elementos sub-secuencia tipo "stats grid del Hero" donde queremos
// que entren después del title).
export function fadeUpPropsWithDelay(delaySec: number) {
  return {
    initial: { opacity: 0, y: DISTANCE_MD },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration: DURATION_BASE, ease: EASE_OUT, delay: delaySec },
  }
}

// Versión load (animate, no whileInView) con delay. Para elementos
// above-the-fold sub-secuencia (ej. stats del Hero que entran
// después del title).
export function fadeUpOnLoadWithDelay(delaySec: number) {
  return {
    initial: { opacity: 0, y: DISTANCE_MD },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION_SLOW, ease: EASE_OUT, delay: delaySec },
  }
}
