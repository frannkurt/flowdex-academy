"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle } from "lucide-react"

type Result = { ok: boolean; message: string } | null

// Botón admin para disparar la notificación de prueba a Telegram. El endpoint
// /api/admin/test-telegram-notification ahora exige POST (antes aceptaba GET
// pero tenía side effects — podía ejecutarse por accidente desde un prefetch
// del browser o preview de link).
export default function TestTelegramNotificationButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)

  async function handleClick() {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/test-telegram-notification", {
        method: "POST",
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string }
        | null

      if (!response.ok || !payload?.ok) {
        setResult({
          ok: false,
          message: payload?.error ?? "No se pudo enviar la notificación de prueba.",
        })
        return
      }

      setResult({
        ok: true,
        message:
          payload.message ??
          "Notificación enviada. Si no la recibís, asegurate de haber iniciado conversación con el bot (/start).",
      })
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-4">
      <h3 className=" text-xl tracking-tight text-white">
        Probar notificación Telegram
      </h3>
      <p className="mt-2 text-sm text-[#888888]">
        Envía un mensaje de prueba a los chat IDs configurados en
        <code className="mx-1 rounded bg-[#1A1A1A] px-1.5 py-0.5 text-[12px] text-[#7DD4C0]">
          TELEGRAM_ADMIN_CHAT_IDS
        </code>
        simulando una venta del curso Trading Lab. No toca la base de datos.
      </p>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 px-4 py-2 text-sm font-semibold text-[#7DD4C0] transition-colors hover:border-[#7DD4C0]/70 hover:bg-[#7DD4C0]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={14} />
        {loading ? "Enviando..." : "Enviar notificación de prueba"}
      </button>

      {result && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
            result.ok
              ? "border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#C3F4E8]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          )}
          <span className="leading-relaxed">{result.message}</span>
        </div>
      )}
    </div>
  )
}
