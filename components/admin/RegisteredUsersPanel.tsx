"use client"

// Panel "Usuarios registrados" del tab Sistema.
// Reemplaza la tabla inline que estaba en app/admin/page.tsx con un panel
// más completo: orden por columna, buscador, eliminación con confirmación,
// y columnas extra (registrado, última actividad, cursos activos).
//
// Toda la lógica vive en client porque el sort/search es interactivo y no
// queremos hacer round-trip al server. Los datos llegan ya pre-procesados
// desde el Server Component padre.

import { useMemo, useState } from "react"
import { isSuperAdmin } from "@/lib/auth/super-admin"

export type RegisteredUserRow = {
  id: string
  email: string
  fullName: string | null
  role: "user" | "admin"
  createdAt: string | null
  lastSignInAt: string | null
  activeCoursesCount: number
}

interface RegisteredUsersPanelProps {
  users: RegisteredUserRow[]
  currentAdminId: string
  deleteUserAction: (formData: FormData) => Promise<void>
}

type SortKey = "createdAt" | "lastSignInAt" | "email" | "fullName" | "activeCoursesCount"
type SortDir = "asc" | "desc"

function formatDate(value: string | null) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

function daysSince(value: string | null) {
  if (!value) return null
  const diff = Date.now() - new Date(value).getTime()
  if (Number.isNaN(diff) || diff < 0) return null
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function RegisteredUsersPanel({
  users,
  currentAdminId,
  deleteUserAction,
}: RegisteredUsersPanelProps) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const matchesQuery = (u: RegisteredUserRow) => {
      if (!normalizedQuery) return true
      return (
        u.email.toLowerCase().includes(normalizedQuery) ||
        (u.fullName ?? "").toLowerCase().includes(normalizedQuery)
      )
    }

    const sorted = [...users].filter(matchesQuery).sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1

      // Helpers locales para comparar nulos: nulls siempre al final
      // independientemente de la dirección. Para fechas null significa
      // "nunca entró" o "no se registró con timestamp" y conviene que no
      // ensucien el orden por defecto.
      const cmpString = (x: string | null, y: string | null) => {
        if (x === null && y === null) return 0
        if (x === null) return 1
        if (y === null) return -1
        return x.localeCompare(y) * dir
      }
      const cmpDate = (x: string | null, y: string | null) => {
        if (x === null && y === null) return 0
        if (x === null) return 1
        if (y === null) return -1
        return (new Date(x).getTime() - new Date(y).getTime()) * dir
      }
      const cmpNumber = (x: number, y: number) => (x - y) * dir

      switch (sortKey) {
        case "createdAt":
          return cmpDate(a.createdAt, b.createdAt)
        case "lastSignInAt":
          return cmpDate(a.lastSignInAt, b.lastSignInAt)
        case "email":
          return cmpString(a.email, b.email)
        case "fullName":
          return cmpString(a.fullName, b.fullName)
        case "activeCoursesCount":
          return cmpNumber(a.activeCoursesCount, b.activeCoursesCount)
      }
    })

    return sorted
  }, [users, query, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      // Defaults razonables: para fechas y números, primero el más reciente
      // o el más alto. Para texto, alfabético ascendente.
      setSortDir(key === "email" || key === "fullName" ? "asc" : "desc")
    }
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ""
    return sortDir === "asc" ? " ↑" : " ↓"
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className=" text-3xl tracking-tight text-white">
            Usuarios registrados
          </h2>
          <p className="mt-2 text-sm text-[#888888]">
            {users.length} usuarios totales · {filteredSorted.length} visibles
          </p>
        </div>

        <div className="flex-1 max-w-md">
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7DD4C0]">
            Buscar
          </label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o email"
            className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => toggleSort("fullName")}
                  className="text-xs uppercase tracking-[0.15em] text-[#7DD4C0] transition-colors hover:text-white"
                >
                  Nombre{sortIndicator("fullName")}
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => toggleSort("email")}
                  className="text-xs uppercase tracking-[0.15em] text-[#7DD4C0] transition-colors hover:text-white"
                >
                  Email{sortIndicator("email")}
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => toggleSort("createdAt")}
                  className="text-xs uppercase tracking-[0.15em] text-[#7DD4C0] transition-colors hover:text-white"
                >
                  Registrado{sortIndicator("createdAt")}
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => toggleSort("lastSignInAt")}
                  className="text-xs uppercase tracking-[0.15em] text-[#7DD4C0] transition-colors hover:text-white"
                >
                  Última actividad{sortIndicator("lastSignInAt")}
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => toggleSort("activeCoursesCount")}
                  className="text-xs uppercase tracking-[0.15em] text-[#7DD4C0] transition-colors hover:text-white"
                >
                  Cursos activos{sortIndicator("activeCoursesCount")}
                </button>
              </th>
              <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">
                Rol
              </th>
              <th className="px-3 py-2 text-right text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-[#888888]">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredSorted.map((u) => {
                const daysAgo = daysSince(u.lastSignInAt)
                const isSelf = u.id === currentAdminId
                const isConfirming = confirmingDeleteId === u.id

                return (
                  <tr
                    key={u.id}
                    className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70"
                  >
                    <td className="px-3 py-3 text-sm text-[#CCCCCC]">
                      {u.fullName || <span className="text-[#666666]">—</span>}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#AAAAAA]">{u.email}</td>
                    <td className="px-3 py-3 text-sm text-[#888888]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#888888]">
                      {u.lastSignInAt ? (
                        <span>
                          {formatDate(u.lastSignInAt)}
                          {daysAgo !== null && (
                            <span className="ml-2 text-xs text-[#666666]">
                              hace {daysAgo}d
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#666666]">nunca</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span
                        className={
                          u.activeCoursesCount > 0
                            ? "font-semibold text-[#7DD4C0]"
                            : "text-[#666666]"
                        }
                      >
                        {u.activeCoursesCount}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          u.role === "admin"
                            ? "bg-[#D4B86A]/15 text-[#D4B86A]"
                            : "bg-[#2A2A2A] text-[#AAAAAA]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {isSuperAdmin(u.email) ? (
                        <span className="rounded-full bg-[#D4B86A]/15 px-2 py-0.5 text-xs text-[#D4B86A]">
                          super admin
                        </span>
                      ) : isSelf ? (
                        <span className="text-xs text-[#666666]">tu cuenta</span>
                      ) : isConfirming ? (
                        <div className="inline-flex items-center gap-2">
                          {/* Form-action directo (no en closure ni con catch).
                              El server action hace redirect() que tira NEXT_REDIRECT
                              y Next lo intercepta para navegar. Si lo cazamos
                              con .catch() o le envolvemos en startTransition,
                              el redirect se traga y el browser no refresca. */}
                          <form action={deleteUserAction} className="inline">
                            <input type="hidden" name="targetUserId" value={u.id} />
                            <input type="hidden" name="returnTab" value="sistema" />
                            <button
                              type="submit"
                              className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-1.5 text-xs font-semibold text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                            >
                              Confirmar
                            </button>
                          </form>
                          <button
                            type="button"
                            onClick={() => setConfirmingDeleteId(null)}
                            className="rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-xs text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(u.id)}
                          className="rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-xs font-semibold text-[#888888] transition-colors hover:border-[#7A2A2A]/60 hover:bg-[#1A0E0E] hover:text-[#F2B3B3]"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
