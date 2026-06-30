"use client"

import { useMemo, useState } from "react"
import type {
  acceptApplicationAction,
  deleteApplicationAction,
  rejectApplicationAction,
  setApplicationStatusAction,
  updateApplicationNotesAction,
} from "@/app/admin/founder-applications-actions"

export type FounderApplicationRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  age: number | null
  country: string | null
  city: string | null
  occupation: string | null
  program_choice: "kickstart-investment" | "kickstart-trading" | "either"
  experience_level: "zero" | "some" | "intermediate" | "advanced"
  motivation: string
  goals_6m: string
  weekly_hours: number | null
  referral_source: string | null
  chat_platforms: string[]
  accepts_feedback: boolean
  accepts_participation: boolean
  additional_notes: string | null
  status: "pending" | "shortlisted" | "accepted" | "rejected" | "archived"
  admin_notes: string | null
  decision_at: string | null
  granted_user_id: string | null
}

type Props = {
  applications: FounderApplicationRow[]
  initialFocusId: string | null
  setStatusAction: typeof setApplicationStatusAction
  updateNotesAction: typeof updateApplicationNotesAction
  rejectAction: typeof rejectApplicationAction
  acceptAction: typeof acceptApplicationAction
  deleteAction: typeof deleteApplicationAction
}

const PROGRAM_LABELS: Record<FounderApplicationRow["program_choice"], string> = {
  "kickstart-investment": "KI · Inversión",
  "kickstart-trading": "KT · Trading",
  either: "Cualquiera",
}

const EXPERIENCE_LABELS: Record<FounderApplicationRow["experience_level"], string> = {
  zero: "Cero",
  some: "Algo",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

const STATUS_LABELS: Record<FounderApplicationRow["status"], string> = {
  pending: "Pendiente",
  shortlisted: "Preseleccionado",
  accepted: "Aceptado",
  rejected: "Rechazado",
  archived: "Archivado",
}

const STATUS_STYLES: Record<FounderApplicationRow["status"], string> = {
  pending: "bg-[#2A2A2A] text-[#CCCCCC]",
  shortlisted: "bg-[#D4B86A]/15 text-[#D4B86A]",
  accepted: "bg-[#7DD4C0]/15 text-[#7DD4C0]",
  rejected: "bg-[#7A2A2A]/30 text-[#F2B3B3]",
  archived: "bg-[#1A1A1A] text-[#666666]",
}

const STATUS_FILTERS = ["all", "pending", "shortlisted", "accepted", "rejected", "archived"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const PROGRAM_FILTERS = ["all", "kickstart-investment", "kickstart-trading", "either"] as const
type ProgramFilter = (typeof PROGRAM_FILTERS)[number]

function formatDate(value: string | null): string {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return value
  }
}

function truncate(text: string, max = 80): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + "…"
}

export default function FounderApplicationsPanel({
  applications,
  initialFocusId,
  setStatusAction,
  updateNotesAction,
  rejectAction,
  acceptAction,
  deleteAction,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(initialFocusId ?? applications[0]?.id ?? null)

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false
      if (programFilter !== "all" && app.program_choice !== programFilter) return false
      return true
    })
  }, [applications, statusFilter, programFilter])

  const selected = applications.find((app) => app.id === selectedId) ?? filtered[0] ?? null

  const counts = useMemo(() => {
    const map: Record<FounderApplicationRow["status"], number> = {
      pending: 0,
      shortlisted: 0,
      accepted: 0,
      rejected: 0,
      archived: 0,
    }
    for (const app of applications) {
      map[app.status] = (map[app.status] ?? 0) + 1
    }
    return map
  }, [applications])

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className=" text-2xl tracking-tight text-white sm:text-3xl">Postulaciones · Programa Fundador</h2>
          <p className="mt-1.5 text-sm text-[#888888]">
            26 cuentas a asignar (Kickstart Investment + Kickstart Trading).
          </p>
        </div>

        {/* Resumen de status */}
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em]">
          <span className="rounded-full bg-[#2A2A2A] px-2.5 py-1 text-[#CCCCCC]">{counts.pending} pendientes</span>
          <span className="rounded-full bg-[#D4B86A]/15 px-2.5 py-1 text-[#D4B86A]">{counts.shortlisted} preseleccionados</span>
          <span className="rounded-full bg-[#7DD4C0]/15 px-2.5 py-1 text-[#7DD4C0]">{counts.accepted} aceptados</span>
          <span className="rounded-full bg-[#7A2A2A]/30 px-2.5 py-1 text-[#F2B3B3]">{counts.rejected} rechazados</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-5 flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                statusFilter === f ? "bg-[#1E1E1E] text-[#7DD4C0]" : "text-[#888] hover:text-white"
              }`}
            >
              {f === "all" ? "Todos" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] p-1">
          {PROGRAM_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setProgramFilter(f)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                programFilter === f ? "bg-[#1E1E1E] text-[#7DD4C0]" : "text-[#888] hover:text-white"
              }`}
            >
              {f === "all" ? "Todos" : f === "either" ? "Cualquiera" : PROGRAM_LABELS[f as FounderApplicationRow["program_choice"]]}
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="mt-6 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-6 text-sm text-[#888]">
          Todavía no hay postulaciones. Cuando alguien se postule por <code className="rounded bg-[#0E0E0E] px-1.5 py-0.5 text-xs text-[#CCC]">/programa-fundador</code> va a aparecer acá.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* ── Lista ── */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-[#2A2A2A] bg-[#111111]/70 p-4 text-xs text-[#888]">
                No hay postulaciones que coincidan con los filtros.
              </div>
            ) : (
              filtered.map((app) => {
                const isSelected = selected?.id === app.id
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedId(app.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-[#7DD4C0]/60 bg-[#7DD4C0]/8"
                        : "border-[#2A2A2A] bg-[#111111]/70 hover:border-[#444]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{app.full_name}</p>
                        <p className="truncate text-[11px] text-[#888]">{app.email}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${STATUS_STYLES[app.status]}`}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-[#777]">
                      <span className="text-[#A8B4BA]">{PROGRAM_LABELS[app.program_choice]}</span>
                      <span>·</span>
                      <span>{EXPERIENCE_LABELS[app.experience_level]}</span>
                      <span>·</span>
                      <span>{formatDate(app.created_at)}</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#999]">
                      {truncate(app.motivation, 110)}
                    </p>
                  </button>
                )
              })
            )}
          </div>

          {/* ── Detalle ── */}
          {selected && (
            <article className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-5 sm:p-6 lg:sticky lg:top-6 lg:self-start">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1F1F1F] pb-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4B86A]">{PROGRAM_LABELS[selected.program_choice]}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{selected.full_name}</h3>
                  <p className="text-xs text-[#888]">{selected.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${STATUS_STYLES[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Edad</p>
                  <p className="mt-0.5 text-sm text-white">{selected.age ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Ubicación</p>
                  <p className="mt-0.5 text-sm text-white">
                    {[selected.city, selected.country].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Experiencia</p>
                  <p className="mt-0.5 text-sm text-white">{EXPERIENCE_LABELS[selected.experience_level]}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Hs/sem</p>
                  <p className="mt-0.5 text-sm text-white">{selected.weekly_hours ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Postuló</p>
                  <p className="mt-0.5 text-sm text-white">{formatDate(selected.created_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Chat</p>
                  <p className="mt-0.5 text-sm text-white">
                    {selected.chat_platforms.length > 0 ? selected.chat_platforms.join(" + ") : "—"}
                  </p>
                </div>
              </div>

              {selected.occupation && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Ocupación</p>
                  <p className="mt-0.5 text-sm text-[#DDD]">{selected.occupation}</p>
                </div>
              )}

              {selected.referral_source && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">Cómo llegó</p>
                  <p className="mt-0.5 text-sm text-[#DDD]">{selected.referral_source}</p>
                </div>
              )}

              {/* Bloques de texto */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#7DD4C0]">Por qué Flowdex</p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#E0E0E0]">{selected.motivation}</p>
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#7DD4C0]">Metas a 6 meses</p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#E0E0E0]">{selected.goals_6m}</p>
              </div>

              {selected.additional_notes && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#7DD4C0]">Notas adicionales del postulante</p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#E0E0E0]">{selected.additional_notes}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.14em]">
                <span className={selected.accepts_feedback ? "text-[#7DD4C0]" : "text-[#7A2A2A]"}>
                  {selected.accepts_feedback ? "✓" : "✗"} Acepta feedback
                </span>
                <span className={selected.accepts_participation ? "text-[#7DD4C0]" : "text-[#7A2A2A]"}>
                  {selected.accepts_participation ? "✓" : "✗"} Acepta participación
                </span>
              </div>

              {/* Notas admin */}
              <form action={updateNotesAction} className="mt-6 space-y-2 border-t border-[#1F1F1F] pt-5">
                <input type="hidden" name="applicationId" value={selected.id} />
                <input type="hidden" name="focusId" value={selected.id} />
                <label className="text-[10px] uppercase tracking-[0.14em] text-[#D4B86A]">
                  Notas internas (admin)
                </label>
                <textarea
                  name="adminNotes"
                  rows={3}
                  defaultValue={selected.admin_notes ?? ""}
                  placeholder="Comentarios privados sobre este postulante"
                  className="w-full resize-y rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-xs text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#7DD4C0]"
                />
                <button
                  type="submit"
                  className="rounded-md border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                >
                  Guardar notas
                </button>
              </form>

              {/* Acciones */}
              <div className="mt-6 space-y-3 border-t border-[#1F1F1F] pt-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#D4B86A]">Decisión</p>

                {selected.status !== "accepted" && (
                  <form action={acceptAction} className="space-y-2 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/5 p-3.5">
                    <input type="hidden" name="applicationId" value={selected.id} />
                    <input type="hidden" name="focusId" value={selected.id} />
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7DD4C0]">Aceptar</p>
                    <p className="text-xs text-[#A8B4BA]">
                      Crea la cuenta del alumno (si no existe), le asigna el curso por 4 meses, y manda email de bienvenida con la contraseña temporal.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        name="finalCourseSlug"
                        required
                        defaultValue={selected.program_choice === "either" ? "" : selected.program_choice}
                        className="flex-1 rounded-md border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-xs text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      >
                        <option value="" disabled>Elegir curso final</option>
                        <option value="kickstart-investment">Kickstart Investment</option>
                        <option value="kickstart-trading">Kickstart Trading</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-md px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors"
                        style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
                      >
                        Aceptar y notificar
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex flex-wrap gap-2">
                  {selected.status !== "shortlisted" && (
                    <form action={setStatusAction}>
                      <input type="hidden" name="applicationId" value={selected.id} />
                      <input type="hidden" name="newStatus" value="shortlisted" />
                      <input type="hidden" name="focusId" value={selected.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-[#D4B86A]/40 bg-[#D4B86A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D4B86A] transition-colors hover:bg-[#D4B86A]/20"
                      >
                        Preseleccionar
                      </button>
                    </form>
                  )}

                  {selected.status !== "pending" && selected.status !== "accepted" && selected.status !== "rejected" && (
                    <form action={setStatusAction}>
                      <input type="hidden" name="applicationId" value={selected.id} />
                      <input type="hidden" name="newStatus" value="pending" />
                      <input type="hidden" name="focusId" value={selected.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#CCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                      >
                        Volver a pendiente
                      </button>
                    </form>
                  )}

                  {selected.status !== "rejected" && selected.status !== "accepted" && (
                    <form action={rejectAction}>
                      <input type="hidden" name="applicationId" value={selected.id} />
                      <input type="hidden" name="focusId" value={selected.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-[#7A2A2A] bg-[#2A1111] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                      >
                        Rechazar y notificar
                      </button>
                    </form>
                  )}

                  {selected.status !== "archived" && selected.status !== "accepted" && (
                    <form action={setStatusAction}>
                      <input type="hidden" name="applicationId" value={selected.id} />
                      <input type="hidden" name="newStatus" value="archived" />
                      <input type="hidden" name="focusId" value={selected.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-[#2A2A2A] bg-[#0E0E0E] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#888] transition-colors hover:text-[#CCC]"
                      >
                        Archivar
                      </button>
                    </form>
                  )}

                  {/* Eliminar (hard delete): siempre disponible, con confirm.
                      Borra el registro y libera el unique(email) para que la
                      persona pueda volver a postularse si quiere. */}
                  <form
                    action={deleteAction}
                    onSubmit={(e) => {
                      if (
                        !window.confirm(
                          `¿Eliminar la postulación de ${selected.full_name}?\n\nSe borra de la base. La persona va a poder volver a postularse con el mismo email. Esta acción no se puede deshacer.`
                        )
                      ) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <input type="hidden" name="applicationId" value={selected.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-[#7A2A2A] bg-[#3A0F0F] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F2B3B3] transition-colors hover:bg-[#4A1414]"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>

                {selected.status === "accepted" && selected.decision_at && (
                  <p className="text-[11px] text-[#7DD4C0]">
                    Aceptado el {formatDate(selected.decision_at)}. Cuenta creada y curso asignado.
                  </p>
                )}
                {selected.status === "rejected" && selected.decision_at && (
                  <p className="text-[11px] text-[#F2B3B3]">
                    Rechazado el {formatDate(selected.decision_at)}.
                  </p>
                )}
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  )
}
