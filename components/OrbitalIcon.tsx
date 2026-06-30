import Image from "next/image"

interface OrbitalIconProps {
  className?: string
  size?: number
  animate?: boolean
  priority?: boolean
  /** Color de acento para el glow. Si se omite, usa el gradiente teal por defecto. */
  glowColor?: string
}

export function OrbitalIcon({
  className = "",
  size = 80,
  animate = true,
  priority = false,
  glowColor,
}: OrbitalIconProps) {
  const glowBackground = glowColor
    ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
    : "linear-gradient(135deg, #5BB8D4 0%, #7DD4C0 100%)"
  const dropShadow = glowColor
    ? `drop-shadow(0 0 12px ${glowColor}99)`
    : "drop-shadow(0 0 15px rgba(91, 184, 212, 0.6))"

  return (
    <div
      className={`relative ${animate ? "orbital-spin" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow effect behind the logo */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60"
        style={{
          background: glowBackground,
          transform: "scale(0.8)",
        }}
      />
      {/* Logo SVG vectorial - reemplazó al PNG en mayo 2026.
          Ventajas: ~5KB vs 200KB+ del PNG, escala perfecto a cualquier tamaño,
          drop-shadow más limpio. El SVG tiene fill="white" hardcoded para el
          fondo oscuro; si en algún momento se usa sobre fondo claro, cambiar
          a fill="currentColor" y colorear desde CSS. */}
      <Image
        src="/logo-orbital.svg"
        alt="FLOWDEX Logo"
        fill
        sizes={`${size}px`}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="relative z-10 object-contain"
        style={{
          filter: dropShadow,
        }}
      />
    </div>
  )
}
