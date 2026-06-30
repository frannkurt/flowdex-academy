"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import {
  sendFounderApplicationAccepted,
  sendFounderApplicationRejected,
} from "@/lib/emails/send"

// Server actions para el tab "Postulaciones" del panel /admin.
// Cada acción verifica role='admin' antes de hacer nada.
// Para crear cuentas y asignar cursos usamos service role.

type AdminGuard = {
  ok: true
  adminUserId: string
  adminClient: SupabaseClient
} | { ok: false }

async function guardAdmin(): Promise<AdminGuard> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { ok: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") return { ok: false }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return { ok: false }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return { ok: true, adminUserId: user.id, adminClient }
}

function adminReturnPath(formData: FormData, status?: string) {
  const params = new URLSearchParams()
  params.set("tab", "postulaciones")
  const focusId = String(formData.get("focusId") ?? "").trim()
  if (focusId) params.set("focusId", focusId)
  if (status) params.set("status", status)
  return `/admin?${params.toString()}`
}

function generateTemporaryPassword(length = 12): string {
  // Mezcla mayúsculas, minúsculas, dígitos. No usamos símbolos para evitar
  // problemas al copiar/pegar desde el email.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let out = ""
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

// ── Cambiar status simple (shortlist / archivar) ──

export async function setApplicationStatusAction(formData: FormData) {
  const guard = await guardAdmin()
  if (!guard.ok) redirect("/dashboard")

  const applicationId = String(formData.get("applicationId") ?? "").trim()
  const newStatus = String(formData.get("newStatus") ?? "").trim()

  if (!applicationId || !["pending", "shortlisted", "archived"].includes(newStatus)) {
    redirect(adminReturnPath(formData))
  }

  await guard.adminClient
    .from("founder_applications")
    .update({
      status: newStatus,
      decision_at: newStatus === "pending" ? null : new Date().toISOString(),
      decision_by: newStatus === "pending" ? null : guard.adminUserId,
    })
    .eq("id", applicationId)

  revalidatePath("/admin")
  redirect(adminReturnPath(formData, "status_updated"))
}

// ── Guardar notas del admin ──

export async function updateApplicationNotesAction(formData: FormData) {
  const guard = await guardAdmin()
  if (!guard.ok) redirect("/dashboard")

  const applicationId = String(formData.get("applicationId") ?? "").trim()
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null
  if (!applicationId) redirect(adminReturnPath(formData))

  await guard.adminClient
    .from("founder_applications")
    .update({ admin_notes: adminNotes })
    .eq("id", applicationId)

  revalidatePath("/admin")
  redirect(adminReturnPath(formData, "notes_saved"))
}

// ── Eliminar postulación (hard delete, irreversible) ──

export async function deleteApplicationAction(formData: FormData) {
  const guard = await guardAdmin()
  if (!guard.ok) redirect("/dashboard")

  const applicationId = String(formData.get("applicationId") ?? "").trim()
  if (!applicationId) redirect(adminReturnPath(formData))

  // Hard delete real. Libera el unique(email) para que la persona pueda
  // volver a postularse si quiere.
  await guard.adminClient
    .from("founder_applications")
    .delete()
    .eq("id", applicationId)

  revalidatePath("/admin")
  // No pasamos focusId porque el registro ya no existe
  redirect("/admin?tab=postulaciones&status=deleted")
}

// ── Rechazar postulación + email ──

export async function rejectApplicationAction(formData: FormData) {
  const guard = await guardAdmin()
  if (!guard.ok) redirect("/dashboard")

  const applicationId = String(formData.get("applicationId") ?? "").trim()
  if (!applicationId) redirect(adminReturnPath(formData))

  const { data: application } = await guard.adminClient
    .from("founder_applications")
    .select("email, full_name, status")
    .eq("id", applicationId)
    .maybeSingle()

  if (!application) redirect(adminReturnPath(formData, "not_found"))

  await guard.adminClient
    .from("founder_applications")
    .update({
      status: "rejected",
      decision_at: new Date().toISOString(),
      decision_by: guard.adminUserId,
    })
    .eq("id", applicationId)

  // Email best-effort
  try {
    await sendFounderApplicationRejected({
      to: application.email,
      firstName: application.full_name?.split(" ")[0] ?? null,
    })
  } catch {
    // No interrumpimos
  }

  revalidatePath("/admin")
  redirect(adminReturnPath(formData, "rejected"))
}

// ── Aceptar postulación: crea cuenta + asigna curso + email ──

export async function acceptApplicationAction(formData: FormData) {
  const guard = await guardAdmin()
  if (!guard.ok) redirect("/dashboard")

  const applicationId = String(formData.get("applicationId") ?? "").trim()
  // El admin elige el curso final (puede no coincidir con preference si vino "either")
  const finalCourseSlugRaw = String(formData.get("finalCourseSlug") ?? "").trim()
  const finalCourseSlug =
    finalCourseSlugRaw === "kickstart-investment" || finalCourseSlugRaw === "kickstart-trading"
      ? finalCourseSlugRaw
      : null

  if (!applicationId || !finalCourseSlug) {
    redirect(adminReturnPath(formData, "accept_invalid"))
  }

  const { data: application } = await guard.adminClient
    .from("founder_applications")
    .select("id, email, full_name, status, granted_user_id")
    .eq("id", applicationId)
    .maybeSingle()

  if (!application) redirect(adminReturnPath(formData, "not_found"))

  // 1) Buscar curso por slug
  const { data: course } = await guard.adminClient
    .from("courses")
    .select("id, slug")
    .eq("slug", finalCourseSlug)
    .maybeSingle()

  if (!course?.id) redirect(adminReturnPath(formData, "accept_course_missing"))

  // 2) Crear o ubicar usuario en auth
  let targetUserId = application.granted_user_id as string | null
  let temporaryPassword: string | null = null

  if (!targetUserId) {
    // Intentamos crear. Si ya existe, lo buscamos.
    temporaryPassword = generateTemporaryPassword(12)

    const { data: created, error: createError } = await guard.adminClient.auth.admin.createUser({
      email: application.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: application.full_name,
        must_change_password: true,
        founder_application_id: application.id,
      },
    })

    if (createError) {
      // Si ya existe, lo buscamos por email vía listUsers (filtro)
      const { data: list } = await guard.adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      })
      const existing = list?.users.find((u) => u.email?.toLowerCase() === application.email.toLowerCase())
      if (existing) {
        targetUserId = existing.id
        // No reseteamos password — el usuario ya tenía cuenta.
        temporaryPassword = null
      } else {
        redirect(adminReturnPath(formData, "accept_user_error"))
      }
    } else {
      targetUserId = created.user?.id ?? null
    }

    if (!targetUserId) redirect(adminReturnPath(formData, "accept_user_error"))

    // Aseguramos profile creado (por si el trigger no corrió)
    await guard.adminClient
      .from("profiles")
      .upsert(
        {
          id: targetUserId,
          email: application.email,
          full_name: application.full_name,
          role: "user",
        },
        { onConflict: "id" }
      )
  }

  // 3) Asignar curso (grant)
  const grantedAt = new Date()
  const expiresAt = getCourseAccessExpiryDate(course.slug, grantedAt)

  await guard.adminClient
    .from("user_courses")
    .upsert(
      {
        user_id: targetUserId,
        course_id: course.id,
        granted_at: grantedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
        grant_type: "free",
        amount_paid: 0,
        grant_notes: "Programa fundador · cuenta gratuita asignada por aceptación de postulación",
      },
      { onConflict: "user_id,course_id" }
    )

  // 4) Update application
  await guard.adminClient
    .from("founder_applications")
    .update({
      status: "accepted",
      decision_at: new Date().toISOString(),
      decision_by: guard.adminUserId,
      granted_user_id: targetUserId,
    })
    .eq("id", applicationId)

  // 5) Email de aceptación
  try {
    await sendFounderApplicationAccepted({
      to: application.email,
      firstName: application.full_name?.split(" ")[0] ?? null,
      programSlug: finalCourseSlug,
      temporaryPassword,
    })
  } catch {
    // No interrumpimos
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard")
  redirect(adminReturnPath(formData, "accepted"))
}
