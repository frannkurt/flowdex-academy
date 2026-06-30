"use server"

// Server actions para gestión de usuarios desde el panel admin.
// Convención: cada acción valida que el caller sea admin, usa SERVICE_ROLE
// para operar contra auth.users (porque la API admin no se expone a anon),
// y hace revalidatePath del /admin al finalizar.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isSuperAdmin } from "@/lib/auth/super-admin"

async function assertAdminOrRedirect() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/dashboard")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return { adminUserId: user.id }
}

function buildReturnPath(formData: FormData, status?: string) {
  // El tab "sistema" es donde vive el panel de usuarios registrados.
  // Si en el futuro cambiamos de lugar, este default se actualiza acá.
  const tab = String(formData.get("returnTab") ?? "sistema")
  const params = new URLSearchParams({ tab })
  if (status) params.set("status", status)
  return `/admin?${params.toString()}`
}

export async function deleteUserAction(formData: FormData) {
  const { adminUserId } = await assertAdminOrRedirect()

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  const returnPath = buildReturnPath(formData)

  // Guardas básicas: no se permite borrar al admin que está logueado (sería
  // bloquearse a uno mismo). El email Franco está hardcodeado en el schema
  // como admin, pero igual sumamos la guarda por id por las dudas.
  if (!targetUserId) {
    redirect(buildReturnPath(formData, "user_delete_error"))
  }

  if (targetUserId === adminUserId) {
    redirect(buildReturnPath(formData, "user_delete_self_error"))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(buildReturnPath(formData, "user_delete_error"))
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Guarda dura: el super admin nunca se puede borrar, ni siquiera por
  // otro admin. Verificamos por email para que el guard funcione incluso
  // si el id del super admin cambia (recreación de cuenta, migración).
  const { data: targetUser } = await adminClient.auth.admin.getUserById(targetUserId)
  if (isSuperAdmin(targetUser?.user?.email)) {
    redirect(buildReturnPath(formData, "user_delete_super_admin_error"))
  }

  // auth.admin.deleteUser borra el row en auth.users. El cascade del schema
  // (on delete cascade en profiles.id, user_courses.user_id, course_progress.user_id)
  // limpia las filas asociadas automáticamente. Las orders quedan con
  // user_id huérfano: lo dejamos así a propósito para preservar el histórico
  // contable (no es lo mismo "no compró nunca" que "compró pero se borró").
  const { error } = await adminClient.auth.admin.deleteUser(targetUserId)

  if (error) {
    redirect(buildReturnPath(formData, "user_delete_error"))
  }

  revalidatePath("/admin")
  redirect(buildReturnPath(formData, "user_deleted"))
}
