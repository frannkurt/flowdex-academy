"use client"

import React, { useState } from "react"

// Orden por frecuencia operativa real: arriba lo que Franco abre a diario
// (Métricas para mirar números, Postulaciones para aceptar nuevos, Usuarios
// para gestionar alumnos). Más abajo lo recurrente pero menos frecuente
// (Auditoría de vencimientos, Órdenes). Al final lo de setup ocasional
// (Cursos, Promos, Sistema).
const TABS = [
  { id: "metricas", label: "Métricas" },
  { id: "postulaciones", label: "Postulaciones" },
  { id: "usuarios", label: "Usuarios" },
  { id: "journals", label: "Journals" },
  { id: "desk", label: "Desk" },
  { id: "afiliados", label: "Afiliados" },
  { id: "auditoria", label: "Auditoria" },
  { id: "ordenes", label: "Órdenes" },
  { id: "cursos", label: "Cursos" },
  { id: "promos", label: "Promos" },
  { id: "sistema", label: "Sistema" },
] as const

type TabId = (typeof TABS)[number]["id"]

interface AdminTabsProps {
  initialTab?: TabId
  tabMetricas: React.ReactNode
  tabUsuarios: React.ReactNode
  tabJournals: React.ReactNode
  tabPostulaciones: React.ReactNode
  tabDesk: React.ReactNode
  tabAfiliados: React.ReactNode
  tabAuditoria: React.ReactNode
  tabCursos: React.ReactNode
  tabOrdenes: React.ReactNode
  tabPromos: React.ReactNode
  tabSistema: React.ReactNode
}

export default function AdminTabs({
  initialTab = "metricas",
  tabMetricas,
  tabUsuarios,
  tabJournals,
  tabPostulaciones,
  tabDesk,
  tabAfiliados,
  tabAuditoria,
  tabCursos,
  tabOrdenes,
  tabPromos,
  tabSistema,
}: AdminTabsProps) {
  const [active, setActive] = useState<TabId>(initialTab)

  const content: Record<TabId, React.ReactNode> = {
    metricas: tabMetricas,
    usuarios: tabUsuarios,
    journals: tabJournals,
    postulaciones: tabPostulaciones,
    desk: tabDesk,
    afiliados: tabAfiliados,
    auditoria: tabAuditoria,
    cursos: tabCursos,
    ordenes: tabOrdenes,
    promos: tabPromos,
    sistema: tabSistema,
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex-shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
              active === tab.id
                ? "bg-[#1E1E1E] text-[#7DD4C0] shadow-sm"
                : "text-[#888888] hover:text-[#CCCCCC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{content[active]}</div>
    </div>
  )
}
