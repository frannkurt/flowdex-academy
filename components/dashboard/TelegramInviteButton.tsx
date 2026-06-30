"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"

type TelegramInviteButtonProps = {
  courseSlug: string
  accent: string
}

type InviteState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }

function normalizeInviteLinkForWeb(inviteLink: string) {
  // Some Telegram Web clients are more reliable with the legacy joinchat path.
  const match = inviteLink.match(/^https?:\/\/t\.me\/\+([A-Za-z0-9_-]+)$/i)
  if (!match) return inviteLink
  return `https://t.me/joinchat/${match[1]}`
}

export function TelegramInviteButton({ courseSlug, accent }: TelegramInviteButtonProps) {
  const [state, setState] = useState<InviteState>({ kind: "idle" })

  async function generateInvite() {
    setState({ kind: "loading" })
    try {
      const res = await fetch(`/api/telegram/invite/${courseSlug}`, {
        method: "POST",
      })
      const data = (await res.json().catch(() => null)) as
        | { inviteLink?: string; expiresAt?: number; error?: string }
        | null

      if (!res.ok || !data?.inviteLink) {
        setState({
          kind: "error",
          message: data?.error ?? "No se pudo generar el link. Probá de nuevo.",
        })
        return
      }

      const inviteUrl = normalizeInviteLinkForWeb(data.inviteLink)
      // En mobile el popup async suele ser bloqueado: si window.open falla,
      // navegamos en la misma pestaña (t.me abre la app de Telegram igual).
      const popup = window.open(inviteUrl, "_blank", "noopener,noreferrer")
      if (!popup) {
        window.location.href = inviteUrl
      }

      setState({ kind: "idle" })
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Error inesperado",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={generateInvite}
        disabled={state.kind === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          color: "#0A0A0A",
          backgroundColor: accent,
          borderColor: accent,
        }}
      >
        {state.kind === "loading" ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            <Send size={14} />
            Entrar a Telegram
          </>
        )}
      </button>
      {state.kind === "error" && (
        <p className="text-center text-[11px] text-[#E8B8B8]">{state.message}</p>
      )}
    </div>
  )
}
