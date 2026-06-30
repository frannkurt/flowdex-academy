// Pills numeradas clickeables para saltar directo a cualquier módulo. Estado por
// pill: actual (relleno con color de la tríada), completado (borde tenue del
// color), pendiente (borde gris). Escala bien con muchos módulos.

type ModuleItem = { number: number; title: string }

type Props = {
  modules: ModuleItem[]
  currentNumber: number
  completed: number[]
  onSelect: (moduleNumber: number) => void
  accentActiveClassName: string
  accentDoneClassName: string
  // Rótulo del módulo 0: "AP" (Apertura) en los cursos de escalera,
  // "00" en la Obra Maestra del IC (Onboarding y Manifiesto).
  zeroLabel?: string
}

export function ModulePills({
  modules,
  currentNumber,
  completed,
  onSelect,
  accentActiveClassName,
  accentDoneClassName,
  zeroLabel = "AP",
}: Props) {
  // Incluimos el módulo 0 (Apertura) para que tenga su pill, marcado "AP".
  // Los cursos sin módulo 0 simplemente no lo traen en `modules`.
  const realModules = modules.filter((m) => m.number >= 0)
  if (realModules.length === 0) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
      {realModules.map((m) => {
        const isCurrent = m.number === currentNumber
        const isDone = completed.includes(m.number)
        const isOpening = m.number === 0
        return (
          <button
            key={m.number}
            type="button"
            onClick={() => onSelect(m.number)}
            title={m.title}
            aria-label={isOpening ? `Ir a la ${m.title}` : `Ir al módulo ${m.number}`}
            aria-current={isCurrent ? "true" : undefined}
            className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
              isCurrent
                ? accentActiveClassName
                : isDone
                  ? accentDoneClassName
                  : "border-[#2A2A2A] text-[#888888] hover:border-[#3A3A3A] hover:text-white"
            }`}
          >
            {isOpening ? zeroLabel : m.number}
          </button>
        )
      })}
    </div>
  )
}
