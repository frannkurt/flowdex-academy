"use client"

import { useState, useMemo } from "react"

type User = {
  id: string
  email: string | null
  full_name: string | null
}

type UserSelectProps = {
  users: User[]
  name: string
  id?: string
  required?: boolean
  placeholder?: string
}

export function UserSelect({
  users,
  name,
  id,
  required = false,
  placeholder = "Seleccionar usuario",
}: UserSelectProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users
    }

    const query = searchQuery.toLowerCase()
    return users.filter((user) => {
      const email = (user.email || "").toLowerCase()
      const fullName = (user.full_name || "").toLowerCase()
      return email.includes(query) || fullName.includes(query)
    })
  }, [users, searchQuery])

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Buscar por email o nombre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
      />
      <select
        id={id}
        name={name}
        required={required}
        className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors focus:border-[#7DD4C0]"
      >
        <option value="">{placeholder}</option>
        {filteredUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {(user.full_name || "Sin nombre") + " · " + (user.email || user.id)}
          </option>
        ))}
      </select>
      {searchQuery && filteredUsers.length === 0 && (
        <p className="text-xs text-[#888888]">No se encontraron usuarios</p>
      )}
    </div>
  )
}
