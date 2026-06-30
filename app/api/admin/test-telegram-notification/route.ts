import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"

// Endpoint de prueba para verificar que las notificaciones de Telegram a los
// admins funcionan. Solo accesible para usuarios con rol "admin".
//
// Uso: estando logueado como admin, dispará un POST desde el panel admin (botón
// "Probar notificación Telegram") o vía curl/fetch con la sesión activa.
//
// Es POST y no GET porque tiene side effects (manda mensaje real a Telegram).
// Un GET podía dispararse por accident (prefetch del navegador, preview de link).
//
// Manda un mensaje fake de "venta" a los dos chat IDs configurados. No toca
// ninguna tabla de la base de datos.
export async function POST() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Solo administradores." }, { status: 403 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Solo administradores." }, { status: 403 })
  }

  try {
    await notifyAdminOfPurchase({
      courseName: "Trading Lab (TEST)",
      courseSlug: "trading-lab",
      userName: "Usuario de Prueba",
      userEmail: "test@flowdex.app",
      amountUsd: 297,
      provider: "mercadopago",
      orderId: "TEST-" + Date.now().toString(),
    })

    return NextResponse.json({
      ok: true,
      message:
        "Notificación enviada. Si no la recibís, asegurate de haber iniciado conversación con el bot (/start).",
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
