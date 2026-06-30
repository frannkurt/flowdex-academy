"use client"

// Selector de usuario con BUSCADOR, para no cargar una barra con todos los
// usuarios. Escribís y muestra hasta 3 coincidencias por email; al elegir, el
// id queda en un input hidden con el `name` que le pases (lo lee la server action).

import { useMemo, useState } from "react"

export type SearchUser = { id: string; email: string }

export default function UserSearchSelect({
  users,
  name,
  placeholder = "Buscá por email…",
  accent = "#7DD4C0",
}: {
  users: SearchUser[]
  name: string
  placeholder?: string
  accent?: string
}) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<SearchUser | null>(null)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return users.filter((u) => (u.email || "").toLowerCase().includes(q)).slice(0, 3)
  }, [query, users])

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected?.id ?? ""} />
      {selected ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]"
          style={{ borderColor: accent }}>
          <span className="truncate">{selected.email}</span>
          <button type="button" onClick={() => { setSelected(null); setQuery("") }}
            className="shrink-0 text-[11px] uppercase tracking-wider text-[#888888] hover:text-white">
            cambiar
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC] outline-none focus:border-[#3a3a3a]"
          />
          {matches.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] shadow-xl">
              {matches.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelected(u)}
                  className="block w-full truncate px-3 py-2 text-left text-sm text-[#CCCCCC] hover:bg-[#1A1A1A]"
                >
                  {u.email}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
