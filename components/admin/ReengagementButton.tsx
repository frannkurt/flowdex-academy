"use client"

import { useState } from "react"
import { Send, Eye, CheckCircle2, AlertCircle } from "lucide-react"

type Recipient = { email: string; kind: "inactive" | "never_entered" | "community"; step: number }
type Summary = {
  ok: boolean
  dryRun: boolean
  inactiveSent: number
  neverEnteredSent: number
  communitySent: number
  recipients: Recipient[]
  error?: string
}

const KIND_LABEL: Record<Recipient["kind"], string> = {
  inactive: "Frenó",
  never_entered: "Nunca entró",
  community: "Sin comunidad",
}

// Botón admin para disparar la pasada de re-enganche por email. Dos acciones:
// "Previsualizar" (dry-run, no manda nada) y "Enviar ahora" (manda y registra).
export default function ReengagementButton() {
  const [loading, setLoading] = useState<"dry" | "send" | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(dryRun: boolean) {
    setLoading(dryRun ? "dry" : "send")
    setSummary(null)
    setError(null)

    try {
      const res = await fetch("/api/admin/reengagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      })
      const payload = (await res.json().catch(() => null)) as (Summary & { error?: string }) | null

      if (!res.ok || !payload?.ok) {
        setError(payload?.error ?? "No se pudo ejecutar el re-enganche.")
        return
      }
      setSummary(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-4">
      <h3 className=" text-xl tracking-tight text-white">Re-enganche por email</h3>
      <p className="mt-2 text-sm text-[#888888]">
        Mails para alumnos que entraron y frenaron (ciclo semanal de 4), los que nunca
        entraron (día 3 y 10) y los que tienen curso activo pero no están en ninguna
        comunidad (2 mails cada 3 días). El cron lo corre solo cada día; acá lo podés
        previsualizar o disparar a mano. No se repiten ni se mandan fuera de secuencia.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run(true)}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#151515] px-4 py-2 text-sm font-semibold text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Eye size={14} />
          {loading === "dry" ? "Calculando..." : "Previsualizar (no manda)"}
        </button>

        <button
          type="button"
          onClick={() => run(false)}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 px-4 py-2 text-sm font-semibold text-[#7DD4C0] transition-colors hover:border-[#7DD4C0]/70 hover:bg-[#7DD4C0]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={14} />
          {loading === "send" ? "Enviando..." : "Enviar ahora"}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {summary && (
        <div className="mt-3 rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 px-3 py-2.5 text-xs text-[#C3F4E8]">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">
              {summary.dryRun ? "Previsualización" : "Enviado"}:{" "}
              <span className="font-semibold">{summary.inactiveSent}</span> a los que frenaron,{" "}
              <span className="font-semibold">{summary.neverEnteredSent}</span> a los que nunca
              entraron, <span className="font-semibold">{summary.communitySent}</span> sin
              comunidad.
              {summary.recipients.length === 0 && " Nadie califica en este momento."}
            </span>
          </div>

          {summary.recipients.length > 0 && (
            <div className="mt-2.5 max-h-56 space-y-1 overflow-y-auto pr-1">
              {summary.recipients.map((r, i) => (
                <div
                  key={`${r.email}-${i}`}
                  className="flex items-center justify-between gap-3 rounded border border-[#2A2A2A] bg-[#0D0D0D] px-2.5 py-1.5"
                >
                  <span className="truncate text-[#CCCCCC]">{r.email}</span>
                  <span className="shrink-0 text-[#888888]">
                    {KIND_LABEL[r.kind]} · paso {r.step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
