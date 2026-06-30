"use client"

import { useWatchlist, type WatchItem } from "@/lib/terminal-store"
import { ORO } from "./ui"

// Botón de estrella para agregar/quitar un activo de la watchlist.
export function StarButton({ item }: { item: WatchItem }) {
  const { has, toggle } = useWatchlist()
  const active = has(item.id)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle(item)
      }}
      aria-label={active ? "Quitar de watchlist" : "Agregar a watchlist"}
      title={active ? "Quitar de watchlist" : "Agregar a watchlist"}
      className="inline-grid h-6 w-6 place-items-center rounded-md transition-colors hover:bg-white/5"
      style={{ color: active ? ORO : "#4A5468" }}
    >
      <svg viewBox="0 0 24 24" width={15} height={15} fill={active ? ORO : "none"} stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.9l-5.8 3 1.1-6.45-4.7-4.6 6.5-.95L12 2.5z" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
