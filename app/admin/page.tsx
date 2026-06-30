import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"
import { UserPanel } from "@/components/admin/UserPanel"
import { OrdersSection } from "@/components/admin/OrdersSection"
import AdminTabs from "@/components/admin/AdminTabs"
import MetricsPanel, {
  type MetricsApplicationRow,
  type MetricsCourseProgressRow,
} from "@/components/admin/MetricsPanel"
import RegisteredUsersPanel, {
  type RegisteredUserRow,
} from "@/components/admin/RegisteredUsersPanel"
import { AuditPanel } from "@/components/admin/AuditPanel"
import TestTelegramNotificationButton from "@/components/admin/TestTelegramNotificationButton"
import ReengagementButton from "@/components/admin/ReengagementButton"
import FounderApplicationsPanel, {
  type FounderApplicationRow,
} from "@/components/admin/FounderApplicationsPanel"
import DeskPanel, {
  type DeskRunRow,
  type DeskEntitlementRow,
  type DeskCreditRow,
  type DeskOrderRow,
} from "@/components/admin/DeskPanel"
import {
  acceptApplicationAction,
  deleteApplicationAction,
  rejectApplicationAction,
  setApplicationStatusAction,
  updateApplicationNotesAction,
} from "./founder-applications-actions"
import { grantDeskCreditsAction, setDeskTierAction, markAffiliatePaidAction } from "./desk-actions"
import AffiliatesPanel, { type AffiliateRedemptionRow } from "@/components/admin/AffiliatesPanel"
import UserSearchSelect from "@/components/admin/UserSearchSelect"
import JournalsPanel from "@/components/admin/JournalsPanel"
import { deleteUserAction } from "./user-actions"
import { deleteOrderAction } from "./order-actions"
import { sendCourseGranted } from "@/lib/emails/send"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  amount_ars: number | null
  provider: string
  provider_reference: string | null
  status: string
  created_at: string
  updated_at: string
}

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: "user" | "admin"
  last_seen_at: string | null
  signup_source: string | null
}

type CourseRow = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number | null
}

type UserCourseRow = {
  user_id: string
  course_id: string
  granted_at: string
  expires_at: string | null
  is_active: boolean
  grant_type: string | null
  amount_paid: number | null
  grant_notes: string | null
}

type PromoCodeRow = {
  code: string
  discount_percentage: number | null
  discount_amount: number | null
  valid_until: string | null
  max_uses: number | null
  current_uses: number | null
  is_active: boolean
  affiliate_user_id: string | null
  affiliate_name: string | null
  commission_pct_desk: number | null
  commission_pct_academy: number | null
  applies_desk: boolean | null
  applies_academy: boolean | null
}

type AdminTab =
  | "metricas"
  | "usuarios"
  | "postulaciones"
  | "desk"
  | "afiliados"
  | "auditoria"
  | "cursos"
  | "ordenes"
  | "promos"
  | "sistema"

function normalizeAdminTab(value: FormDataEntryValue | string | null | undefined): AdminTab {
  const normalized = String(value ?? "").trim()

  // Compat: "caja" era el tab viejo de ingresos antes de fusionarse en
  // Métricas (mayo 2026). Si llega un link viejo, lo redirigimos a métricas.
  if (normalized === "caja") {
    return "metricas"
  }

  if (
    normalized === "metricas" ||
    normalized === "usuarios" ||
    normalized === "postulaciones" ||
    normalized === "desk" ||
    normalized === "afiliados" ||
    normalized === "auditoria" ||
    normalized === "cursos" ||
    normalized === "ordenes" ||
    normalized === "promos" ||
    normalized === "sistema"
  ) {
    return normalized
  }

  return "metricas"
}

function buildAdminRedirectPath(
  formData: FormData,
  options?: {
    fallbackTab?: AdminTab
    status?: string
  }
) {
  const params = new URLSearchParams()
  const tab = normalizeAdminTab(formData.get("returnTab") ?? options?.fallbackTab ?? "usuarios")
  const returnUserId = String(formData.get("returnUserId") ?? "").trim()

  params.set("tab", tab)

  if (options?.status) {
    params.set("status", options.status)
  }

  if (tab === "usuarios" && returnUserId) {
    params.set("userId", returnUserId)
  }

  return `/admin?${params.toString()}`
}

function parseNullableNumber(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim()

  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function parseNullableInteger(value: FormDataEntryValue | null) {
  const parsed = parseNullableNumber(value)

  if (parsed === null) {
    return null
  }

  return Math.trunc(parsed)
}

async function grantCourseAction(formData: FormData) {
  "use server"

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

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  const courseId = String(formData.get("courseId") ?? "").trim()
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "usuarios" })

  if (!targetUserId || !courseId) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: course } = await adminClient
    .from("courses")
    .select("slug")
    .eq("id", courseId)
    .maybeSingle()

  if (!course?.slug) {
    redirect(buildAdminRedirectPath(formData, { fallbackTab: "usuarios", status: "assign_error" }))
  }

  const grantType = String(formData.get("grantType") ?? "manual").trim()
  const amountPaidRaw = parseNullableNumber(formData.get("amountPaid"))
  const discountAppliedRaw = parseNullableNumber(formData.get("discountApplied"))
  const grantNotes = String(formData.get("grantNotes") ?? "").trim() || null

  // If paid, amount_paid = monto cobrado - descuento
  let amountPaid: number | null = null
  if (grantType === "paid" && amountPaidRaw !== null) {
    amountPaid = Math.max(0, amountPaidRaw - (discountAppliedRaw ?? 0))
  } else if (grantType === "free") {
    amountPaid = 0
  }

  const grantedAt = new Date()
  const expiresAt = getCourseAccessExpiryDate(course.slug, grantedAt)

  await adminClient.from("user_courses").upsert(
    {
      user_id: targetUserId,
      course_id: courseId,
      granted_at: grantedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
      grant_type: grantType,
      amount_paid: amountPaid,
      grant_notes: grantNotes,
    },
    {
      onConflict: "user_id,course_id",
    }
  )

  // Aviso automático al alumno: "ya tenés acceso a {curso}". Si el mail falla,
  // la asignación NO se revierte — el acceso ya quedó otorgado.
  try {
    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", targetUserId)
      .maybeSingle()

    const target = targetProfile as { email: string | null; full_name: string | null } | null
    if (target?.email) {
      await sendCourseGranted({
        to: target.email,
        firstName: target.full_name?.trim().split(" ")[0] || null,
        courseSlug: course.slug,
        expiresAt,
      })
    }
  } catch {
    // Silencioso: el mail es un extra, la asignación es lo importante.
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard")
  redirect(buildAdminRedirectPath(formData, { fallbackTab: "usuarios", status: "assigned" }))
}

async function revokeCourseAction(formData: FormData) {
  "use server"

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

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  const courseId = String(formData.get("courseId") ?? "").trim()
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "usuarios" })

  if (!targetUserId || !courseId) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  await adminClient
    .from("user_courses")
    .update({ is_active: false })
    .eq("user_id", targetUserId)
    .eq("course_id", courseId)

  revalidatePath("/admin")
  revalidatePath("/dashboard")
  redirect(returnPath)
}

async function updateCoursePricingAction(formData: FormData) {
  "use server"

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

  const courseId = String(formData.get("courseId") ?? "").trim()
  const price = parseNullableNumber(formData.get("price"))
  const discountPrice = parseNullableNumber(formData.get("discountPrice"))
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "cursos" })

  if (!courseId || price === null || price < 0) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  await adminClient
    .from("courses")
    .update({
      price,
      discount_price: discountPrice,
    })
    .eq("id", courseId)

  revalidatePath("/admin")
  revalidatePath("/")
  redirect(returnPath)
}

async function createPromoCodeAction(formData: FormData) {
  "use server"

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

  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const discountPercentage = parseNullableNumber(formData.get("discountPercentage"))
  const discountAmount = parseNullableNumber(formData.get("discountAmount"))
  const validUntilRaw = String(formData.get("validUntil") ?? "").trim()
  const maxUses = parseNullableInteger(formData.get("maxUses"))
  // Afiliado (opcional): se asigna a un USUARIO real (no texto libre) para evitar
  // inconsistencias por typos. El nombre se cachea del profile más abajo.
  const affiliateUserIdRaw = String(formData.get("affiliateUserId") ?? "").trim()
  const affiliateUserId = affiliateUserIdRaw.length ? affiliateUserIdRaw : null
  const commissionPctDesk = parseNullableNumber(formData.get("commissionPctDesk")) ?? 20
  const commissionPctAcademy = parseNullableNumber(formData.get("commissionPctAcademy")) ?? 5
  // Checkbox ausente = no marcado = false.
  const appliesDesk = String(formData.get("appliesDesk") ?? "") === "true"
  const appliesAcademy = String(formData.get("appliesAcademy") ?? "") === "true"
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "promos" })

  if (!code) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Cache del nombre del afiliado desde su profile (display sin join).
  let affiliateName: string | null = null
  if (affiliateUserId) {
    const { data: aff } = await adminClient
      .from("profiles")
      .select("full_name, email")
      .eq("id", affiliateUserId)
      .maybeSingle()
    const a = aff as { full_name: string | null; email: string | null } | null
    affiliateName = a?.full_name?.trim() || a?.email || null
  }

  await adminClient.from("promo_codes").upsert(
    {
      code,
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      valid_until: validUntilRaw ? new Date(validUntilRaw).toISOString() : null,
      max_uses: maxUses,
      current_uses: 0,
      is_active: true,
      affiliate_user_id: affiliateUserId,
      affiliate_name: affiliateName,
      commission_pct_desk: commissionPctDesk,
      commission_pct_academy: commissionPctAcademy,
      applies_desk: appliesDesk,
      applies_academy: appliesAcademy,
    },
    {
      onConflict: "code",
    }
  )

  revalidatePath("/admin")
  redirect(returnPath)
}

async function updatePromoCodeAction(formData: FormData) {
  "use server"

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

  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const discountPercentage = parseNullableNumber(formData.get("discountPercentage"))
  const discountAmount = parseNullableNumber(formData.get("discountAmount"))
  const validUntilRaw = String(formData.get("validUntil") ?? "").trim()
  const maxUses = parseNullableInteger(formData.get("maxUses"))
  const isActive = String(formData.get("isActive") ?? "").trim() === "true"
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "promos" })

  if (!code) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  await adminClient
    .from("promo_codes")
    .update({
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      valid_until: validUntilRaw ? new Date(validUntilRaw).toISOString() : null,
      max_uses: maxUses,
      is_active: isActive,
    })
    .eq("code", code)

  revalidatePath("/admin")
  redirect(returnPath)
}

async function markOrderRefundedAction(formData: FormData) {
  "use server"

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

  const orderId = String(formData.get("orderId") ?? "").trim()
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "ordenes" })

  if (!orderId) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  await adminClient
    .from("orders")
    .update({ status: "refunded" })
    .eq("id", orderId)
    .eq("status", "paid")

  revalidatePath("/admin")
  redirect(returnPath)
}

async function deactivatePromoCodeAction(formData: FormData) {
  "use server"

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

  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "promos" })

  if (!code) {
    redirect(returnPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(returnPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  await adminClient
    .from("promo_codes")
    .update({ is_active: false })
    .eq("code", code)

  revalidatePath("/admin")
  redirect(returnPath)
}

async function deletePromoCodeAction(formData: FormData) {
  "use server"

  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")

  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const returnPath = buildAdminRedirectPath(formData, { fallbackTab: "promos" })
  if (!code) redirect(returnPath)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) redirect(returnPath)

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Borrado real del cupón. Las redenciones ya registradas guardan el código
  // como texto, así que el historial de comisiones del afiliado NO se pierde.
  await adminClient.from("promo_codes").delete().eq("code", code)

  revalidatePath("/admin")
  redirect(returnPath)
}

async function setTemporaryPasswordAction(formData: FormData) {
  "use server"

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

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  const temporaryPassword = String(formData.get("temporaryPassword") ?? "").trim()
  const errorPath = buildAdminRedirectPath(formData, { fallbackTab: "usuarios", status: "password_error" })

  if (!targetUserId || temporaryPassword.length < 6) {
    redirect(errorPath)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(errorPath)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: userPayload, error: getUserError } = await adminClient.auth.admin.getUserById(targetUserId)

  if (getUserError || !userPayload?.user) {
    redirect(errorPath)
  }

  const currentMetadata =
    userPayload.user.user_metadata && typeof userPayload.user.user_metadata === "object"
      ? userPayload.user.user_metadata
      : {}

  const { error: updateUserError } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: temporaryPassword,
    user_metadata: {
      ...currentMetadata,
      must_change_password: true,
    },
  })

  if (updateUserError) {
    redirect(errorPath)
  }

  revalidatePath("/admin")
  redirect(buildAdminRedirectPath(formData, { fallbackTab: "usuarios", status: "password_updated" }))
}

type AdminPageProps = {
  searchParams?: Promise<{
    status?: string
    tab?: string
    userId?: string
    focusId?: string
  }>
}

type AdminPageSearchParams = {
  status?: string
  tab?: string
  userId?: string
  focusId?: string
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
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
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Cliente con service-role para acceder a auth.users (last_sign_in_at,
  // created_at) y a course_progress sin pelearse con RLS. Las admin policies
  // ya permiten read pero auth.users no es accesible vía anon ni siquiera
  // con admin role — siempre necesita service-role.
  const adminFetchUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const adminFetchKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const adminFetchClient =
    adminFetchUrl && adminFetchKey
      ? createClient(adminFetchUrl, adminFetchKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : null

  // Las tablas del Desk (desk_runs/credits/entitlements/orders) solo tienen
  // política RLS "owner read": con el cliente de sesión, hasta el admin ve SOLO
  // sus propias filas. Para que el panel muestre el consumo de TODOS los usuarios
  // hay que leerlas con service-role (saltea RLS). Si no hay service-role key,
  // cae al cliente normal (degradado: solo las del admin) en vez de romper.
  const deskClient = adminFetchClient ?? supabase

  // Aviso explícito: sin service-role los KPIs de "Alumnos activos" y
  // "Alumnos en riesgo" en Métricas quedan en 0 silenciosamente porque no
  // podemos leer last_sign_in_at de auth.users. last_seen_at de profiles
  // sigue funcionando como fallback (lo popla el proxy con throttle), pero
  // para usuarios viejos previos a esa feature, las métricas serán parciales.
  if (!adminFetchClient) {
    console.warn(
      "[admin] SUPABASE_SERVICE_ROLE_KEY no configurada. Métricas de actividad de usuarios serán parciales (solo last_seen_at de profiles, sin auth.users.last_sign_in_at)."
    )
  }

  // Límites de paginación: el panel /admin carga TODO en memoria para
  // poder cruzar profiles × user_courses × orders × course_progress en el
  // MetricsPanel sin round-trips. Funciona bien hasta los miles de filas.
  // Cuando Flowdex pase de ~5k alumnos hay que refactorizar a paginación
  // server-side por tab — por ahora dejamos limits altos que evitan freezar
  // la pestaña si crecemos rápido sin tocar este código.
  const MAX_PROFILES = 5000
  const MAX_USER_COURSES = 20000
  const MAX_ORDERS = 10000
  const MAX_COURSE_PROGRESS = 20000
  const MAX_APPLICATIONS = 5000

  const [
    profilesResult,
    coursesResult,
    userCoursesResult,
    promoCodesResult,
    ordersResult,
    founderApplicationsResult,
    courseProgressResult,
    classBookingsResult,
    authUsersResult,
    deskRunsResult,
    deskEntitlementsResult,
    deskCreditsResult,
    deskOrdersResult,
    couponRedemptionsResult,
    deskSignalsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, last_seen_at, signup_source")
      .order("email", { ascending: true })
      .limit(MAX_PROFILES),
    supabase.from("courses").select("id, name, slug, description, price, discount_price").order("name", { ascending: true }),
    supabase
      .from("user_courses")
      .select("user_id, course_id, granted_at, expires_at, is_active, grant_type, amount_paid, grant_notes")
      .order("granted_at", { ascending: false })
      .limit(MAX_USER_COURSES),
    supabase
      .from("promo_codes")
      .select("code, discount_percentage, discount_amount, valid_until, max_uses, current_uses, is_active, affiliate_user_id, affiliate_name, commission_pct_desk, commission_pct_academy, applies_desk, applies_academy")
      .order("code", { ascending: true }),
    supabase
      .from("orders")
      .select("id, user_id, course_id, amount_usd, amount_ars, provider, provider_reference, status, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(MAX_ORDERS),
    supabase
      .from("founder_applications")
      .select(
        "id, created_at, full_name, email, age, country, city, occupation, program_choice, experience_level, motivation, goals_6m, weekly_hours, referral_source, chat_platforms, accepts_feedback, accepts_participation, additional_notes, status, admin_notes, decision_at, granted_user_id"
      )
      .order("created_at", { ascending: false })
      .limit(MAX_APPLICATIONS),
    supabase
      .from("course_progress")
      .select("user_id, course_id, completed_modules")
      .limit(MAX_COURSE_PROGRESS),
    // class_bookings se popla via webhook de Cal.com. La migración ya está
    // aplicada en producción (20260525000000_class_bookings.sql); si por
    // algún motivo la tabla no existe en el target actual, Postgrest devuelve
    // { data: null, error: { code: '42P01' } } y el `?? []` de abajo previene
    // que el panel rompa. Loggeamos abajo si hay error para que sea visible.
    supabase
      .from("class_bookings")
      .select("id, booking_id, user_email, event_type, start_at, status")
      .order("start_at", { ascending: false })
      .limit(2000),
    // auth.admin.listUsers requiere service-role. Si no está configurada, el
    // panel Métricas funciona igual pero sin last_sign_in_at (los KPIs de
    // alumnos activos y "en riesgo" quedan en 0).
    adminFetchClient
      ? adminFetchClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
      : Promise.resolve({ data: { users: [] } } as { data: { users: Array<{ id: string; created_at?: string; last_sign_in_at?: string | null }> } }),
    // --- Flowdex Desk (tab "desk"): corridas con uso de tokens, tiers,
    // créditos vivos y packs vendidos. Vía service-role (deskClient) para ver
    // TODOS los usuarios; con el cliente de sesión RLS limitaría al admin.
    deskClient
      .from("desk_runs")
      .select("id, user_id, ticker, board, funded_by, created_at, gemini_calls, tokens_in, tokens_out, tokens_cached, cache_hit")
      .order("created_at", { ascending: false })
      .limit(10000),
    deskClient.from("desk_entitlements").select("user_id, tier, radar_until"),
    deskClient.from("desk_credits").select("user_id, credits_total, credits_used, source, expires_at"),
    deskClient
      .from("desk_orders")
      .select("id, user_id, pack, credits, amount_usd, provider, status, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(10000),
    deskClient
      .from("coupon_redemptions")
      .select("id, code, affiliate_user_id, affiliate_name, buyer_user_id, product, course_slug, order_ref, amount_paid_usd, commission_pct, commission_usd, commission_paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(10000),
    deskClient
      .from("desk_account_signals")
      .select("user_id, ip, fingerprint, created_at")
      .order("created_at", { ascending: false })
      .limit(10000),
  ])

  const { data: users } = profilesResult
  const { data: courses } = coursesResult
  const { data: assignments } = userCoursesResult
  const { data: promoCodes } = promoCodesResult
  const { data: orders } = ordersResult
  const { data: founderApplicationsRaw } = founderApplicationsResult
  const { data: courseProgressRaw } = courseProgressResult
  const { data: classBookingsRaw, error: classBookingsError } = classBookingsResult

  // Visibilidad de errores no fatales y de saturación de límites. Loggeamos
  // a nivel server para no romper la UX, pero queda registro si algo está
  // empezando a fallar (tabla missing, fila truncada por límite, etc.).
  if (classBookingsError) {
    console.warn(
      `[admin] Error leyendo class_bookings (${classBookingsError.code}): ${classBookingsError.message}. Cal.com aparecerá vacío.`
    )
  }

  const LIMIT_WARN_PCT = 0.9
  const limitWarn = (label: string, count: number, max: number) => {
    if (count >= Math.floor(max * LIMIT_WARN_PCT)) {
      console.warn(
        `[admin] ${label} devolvió ${count}/${max} filas (≥${LIMIT_WARN_PCT * 100}%). Refactor a paginación server-side antes de que truncar inflija pérdida silenciosa de datos en Métricas.`
      )
    }
  }
  limitWarn("profiles", users?.length ?? 0, MAX_PROFILES)
  limitWarn("user_courses", assignments?.length ?? 0, MAX_USER_COURSES)
  limitWarn("orders", orders?.length ?? 0, MAX_ORDERS)
  limitWarn("course_progress", courseProgressRaw?.length ?? 0, MAX_COURSE_PROGRESS)
  limitWarn("founder_applications", founderApplicationsRaw?.length ?? 0, MAX_APPLICATIONS)

  const userRows = (users ?? []) as ProfileRow[]
  // courseRows = solo cursos públicos (lo que ven los UI normales).
  // allCourseRows = incluye los internos (inner-circle-inversiones,
  // inner-circle-trading) que NO se venden pero los necesitamos para
  // calcular las sub-barras de progreso del IC en Métricas.
  const allCourseRows = (courses ?? []) as CourseRow[]
  const courseRows = allCourseRows.filter((course) => !isInternalProgressOnlyCourseSlug(course.slug))
  const assignmentRows = (assignments ?? []) as UserCourseRow[]
  const promoCodeRows = (promoCodes ?? []) as PromoCodeRow[]
  const orderRows = (orders ?? []) as OrderRow[]
  const founderApplicationRows = (founderApplicationsRaw ?? []) as FounderApplicationRow[]
  const courseProgressRows = (courseProgressRaw ?? []) as MetricsCourseProgressRow[]
  // Flowdex Desk — si alguna tabla no existiera en el target, el ?? [] evita romper.
  const deskRunRows = (deskRunsResult.data ?? []) as DeskRunRow[]
  const deskEntitlementRows = (deskEntitlementsResult.data ?? []) as DeskEntitlementRow[]
  const deskCreditRows = (deskCreditsResult.data ?? []) as DeskCreditRow[]
  const deskOrderRows = (deskOrdersResult.data ?? []) as DeskOrderRow[]
  const couponRedemptionRows = (couponRedemptionsResult.data ?? []) as AffiliateRedemptionRow[]
  const deskSignalRows = (deskSignalsResult.data ?? []) as Array<{
    user_id: string
    ip: string | null
    fingerprint: string | null
    created_at: string
  }>
  // Cuentas vinculadas: huellas compartidas por 2+ usuarios distintos.
  const _signalByFp = new Map<string, Set<string>>()
  deskSignalRows.forEach((s) => {
    if (!s.fingerprint) return
    const set = _signalByFp.get(s.fingerprint) ?? new Set<string>()
    set.add(s.user_id)
    _signalByFp.set(s.fingerprint, set)
  })
  const linkedAccounts = [..._signalByFp.entries()]
    .filter(([, users]) => users.size > 1)
    .map(([fingerprint, users]) => ({
      fingerprint,
      emails: [...users].map((uid) => userRows.find((u) => u.id === uid)?.email ?? uid.slice(0, 8)),
    }))
  const classBookingRows = (classBookingsRaw ?? []) as Array<{
    id: string
    booking_id: string
    user_email: string | null
    event_type: string | null
    start_at: string | null
    status: string
  }>

  // Indexar la metadata de auth.users (created_at, last_sign_in_at) por id
  // para mergear con profiles. listUsers devuelve hasta 1000 por página, que
  // es más que suficiente para el tamaño actual de Flowdex.
  type AuthUserMeta = { id: string; created_at?: string; last_sign_in_at?: string | null }
  const authUsersList = ((authUsersResult?.data?.users ?? []) as AuthUserMeta[])
  const authMetaById = authUsersList.reduce<Record<string, AuthUserMeta>>((acc, u) => {
    acc[u.id] = u
    return acc
  }, {})

  // Admins NO computan en estadísticas: compras de prueba, autoasignaciones de
  // cursos, etc. inflarían ventas / cursos completados / alumnos activos. Los
  // excluimos de TODO lo que sea métrica, manteniéndolos en las vistas
  // operativas (gestión de usuarios, asignaciones activas) donde sí hace falta
  // verlos para administrarlos.
  const adminUserIds = new Set(userRows.filter((u) => u.role === "admin").map((u) => u.id))
  const adminEmailsLower = new Set(
    userRows
      .filter((u) => u.role === "admin")
      .map((u) => (u.email ?? "").toLowerCase())
      .filter(Boolean)
  )

  const statsAssignments = assignmentRows.filter((a) => !adminUserIds.has(a.user_id))
  const statsOrders = orderRows.filter((o) => !adminUserIds.has(o.user_id))
  const statsCourseProgress = courseProgressRows.filter((p) => !adminUserIds.has(p.user_id))
  const statsUserRows = userRows.filter((u) => u.role !== "admin")
  const statsClassBookings = classBookingRows.filter(
    (b) => !adminEmailsLower.has((b.user_email ?? "").toLowerCase())
  )

  // courseStats alimenta los contadores "X activas / Y totales" de la pestaña
  // Cursos → también es estadística, así que usa las asignaciones sin admins.
  const courseStats = statsAssignments.reduce<Record<string, { active: number; total: number }>>((acc, row) => {
    const current = acc[row.course_id] ?? { active: 0, total: 0 }
    current.total += 1

    if (row.is_active) {
      current.active += 1
    }

    acc[row.course_id] = current
    return acc
  }, {})

  const userById = userRows.reduce<Record<string, ProfileRow>>((acc, row) => {
    acc[row.id] = row
    return acc
  }, {})

  const courseById = courseRows.reduce<Record<string, CourseRow>>((acc, row) => {
    acc[row.id] = row
    return acc
  }, {})

  const nowTs = Date.now()
  const activeAssignments = assignmentRows.filter((row) => {
    if (!row.is_active) {
      return false
    }

    if (!row.expires_at) {
      return true
    }

    return new Date(row.expires_at).getTime() > nowTs
  })

  const msInDay = 24 * 60 * 60 * 1000
  const membershipExpiring = activeAssignments
    .filter((row) => {
      if (!row.expires_at) {
        return false
      }

      const course = courseById[row.course_id]
      if (!course || course.slug !== "membresia") {
        return false
      }

      const daysRemaining = Math.ceil((new Date(row.expires_at).getTime() - nowTs) / msInDay)
      return daysRemaining >= 0 && daysRemaining <= 7
    })
    .map((row) => {
      const userItem = userById[row.user_id]
      const course = courseById[row.course_id]
      const daysRemaining = Math.max(0, Math.ceil((new Date(row.expires_at as string).getTime() - nowTs) / msInDay))

      return {
        userId: row.user_id,
        userName: userItem?.full_name || "Sin nombre",
        userEmail: userItem?.email || row.user_id,
        courseName: course?.name || row.course_id,
        courseSlug: course?.slug || "-",
        expiresAt: row.expires_at as string,
        daysRemaining,
      }
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  const materialExpiring = activeAssignments
    .filter((row) => {
      if (!row.expires_at) {
        return false
      }

      const course = courseById[row.course_id]
      if (!course || course.slug === "membresia") {
        return false
      }

      const daysRemaining = Math.ceil((new Date(row.expires_at).getTime() - nowTs) / msInDay)
      return daysRemaining >= 0 && daysRemaining <= 30
    })
    .map((row) => {
      const userItem = userById[row.user_id]
      const course = courseById[row.course_id]
      const daysRemaining = Math.max(0, Math.ceil((new Date(row.expires_at as string).getTime() - nowTs) / msInDay))

      return {
        userId: row.user_id,
        userName: userItem?.full_name || "Sin nombre",
        userEmail: userItem?.email || row.user_id,
        courseName: course?.name || row.course_id,
        courseSlug: course?.slug || "-",
        expiresAt: row.expires_at as string,
        daysRemaining,
      }
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  const resolvedSearchParams: AdminPageSearchParams | undefined = searchParams
    ? await searchParams
    : undefined
  const status = resolvedSearchParams?.status
  const initialTab = normalizeAdminTab(resolvedSearchParams?.tab)
  const initialUserId = String(resolvedSearchParams?.userId ?? "").trim() || null
  const initialFocusId = String(resolvedSearchParams?.focusId ?? "").trim() || null

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <OrbitalIcon size={620} animate />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="glass-card mb-8 rounded-2xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Panel de administracion</p>
          <h1 className="mt-3  text-4xl tracking-tight sm:text-6xl">FLOWDEX ADMIN</h1>
          <p className="mt-2 text-base text-[#CCCCCC]">{profile.full_name || user.email}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
            >
              Ir al dashboard
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
            >
              Ir al inicio
            </Link>
          </div>

          {status === "assigned" && (
            <div className="mt-5 rounded-xl border border-[#2D5A4A] bg-[#12201B] px-4 py-3 text-sm text-[#B9E7D8]">
              Curso asignado correctamente.
            </div>
          )}

          {status === "assign_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              No se pudo asignar el curso. Intenta nuevamente.
            </div>
          )}

          {status === "password_updated" && (
            <div className="mt-5 rounded-xl border border-[#2D5A4A] bg-[#12201B] px-4 py-3 text-sm text-[#B9E7D8]">
              Contraseña temporal actualizada. El usuario deberá cambiarla en su primer ingreso.
            </div>
          )}

          {status === "password_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              No se pudo actualizar la contraseña temporal. Verifica los datos e intenta nuevamente.
            </div>
          )}

          {status === "user_deleted" && (
            <div className="mt-5 rounded-xl border border-[#2D5A4A] bg-[#12201B] px-4 py-3 text-sm text-[#B9E7D8]">
              Usuario eliminado correctamente.
            </div>
          )}

          {status === "user_delete_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              No se pudo eliminar el usuario. Reintenta o revisá los logs de Supabase.
            </div>
          )}

          {status === "user_delete_self_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              No podés eliminar tu propia cuenta desde el panel.
            </div>
          )}

          {status === "user_delete_super_admin_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              La cuenta super admin no puede ser eliminada por ningún medio.
            </div>
          )}

          {status === "order_deleted" && (
            <div className="mt-5 rounded-xl border border-[#2D5A4A] bg-[#12201B] px-4 py-3 text-sm text-[#B9E7D8]">
              Orden eliminada correctamente.
            </div>
          )}

          {status === "order_delete_error" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              No se pudo eliminar la orden. Reintenta o revisá los logs.
            </div>
          )}

          {status === "order_delete_protected" && (
            <div className="mt-5 rounded-xl border border-[#7A2A2A] bg-[#2A1111] px-4 py-3 text-sm text-[#F2B3B3]">
              Las órdenes pagadas o reembolsadas no se pueden eliminar (histórico contable).
            </div>
          )}
        </div>

        <AdminTabs
          initialTab={initialTab}
          tabMetricas={
            <MetricsPanel
              orders={statsOrders.map((o) => ({
                id: o.id,
                user_id: o.user_id,
                course_id: o.course_id,
                amount_usd: Number(o.amount_usd),
                status: o.status,
                created_at: o.created_at,
              }))}
              courses={allCourseRows.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                price: Number(c.price),
              }))}
              userCourses={statsAssignments.map((uc) => ({
                user_id: uc.user_id,
                course_id: uc.course_id,
                granted_at: uc.granted_at,
                expires_at: uc.expires_at,
                is_active: uc.is_active,
                grant_type: uc.grant_type,
                amount_paid: uc.amount_paid,
              }))}
              courseProgress={statsCourseProgress}
              applications={founderApplicationRows.map<MetricsApplicationRow>((a) => ({
                id: a.id,
                created_at: a.created_at,
                status: a.status,
              }))}
              users={statsUserRows.map((u) => ({
                id: u.id,
                email: u.email ?? "",
                fullName: u.full_name,
                // Usamos last_seen_at de profiles (actividad real trackeada
                // por el proxy con throttle) en lugar de auth.users.last_sign_in_at
                // que solo se actualiza en logueos explícitos.
                lastSignInAt: u.last_seen_at ?? authMetaById[u.id]?.last_sign_in_at ?? null,
              }))}
              classBookings={statsClassBookings.map((b) => ({
                id: b.id,
                start_at: b.start_at,
                status: b.status,
              }))}
            />
          }
          tabUsuarios={
            <UserPanel
              users={userRows}
              courses={courseRows}
              assignments={assignmentRows}
              orders={orderRows}
              courseProgress={courseProgressRows}
              classBookings={classBookingRows.map((b) => ({
                id: b.id,
                user_email: b.user_email,
                event_type: b.event_type,
                start_at: b.start_at,
                status: b.status,
              }))}
              initialSelectedUserId={initialUserId}
              grantCourseAction={grantCourseAction}
              revokeCourseAction={revokeCourseAction}
              setTemporaryPasswordAction={setTemporaryPasswordAction}
            />
          }
          tabJournals={
            <JournalsPanel users={userRows.map((u) => ({ id: u.id, email: u.email ?? "" }))} />
          }
          tabPostulaciones={
            <FounderApplicationsPanel
              applications={founderApplicationRows}
              initialFocusId={initialFocusId}
              setStatusAction={setApplicationStatusAction}
              updateNotesAction={updateApplicationNotesAction}
              rejectAction={rejectApplicationAction}
              acceptAction={acceptApplicationAction}
              deleteAction={deleteApplicationAction}
            />
          }
          tabDesk={
            <DeskPanel
              runs={deskRunRows}
              entitlements={deskEntitlementRows}
              credits={deskCreditRows}
              orders={deskOrderRows}
              users={userRows.map((u) => ({ id: u.id, email: u.email ?? "" }))}
              grantCreditsAction={grantDeskCreditsAction}
              setTierAction={setDeskTierAction}
              linkedAccounts={linkedAccounts}
            />
          }
          tabAfiliados={
            <AffiliatesPanel
              redemptions={couponRedemptionRows}
              users={userRows.map((u) => ({ id: u.id, email: u.email ?? "" }))}
              markPaidAction={markAffiliatePaidAction}
            />
          }
          tabAuditoria={
            <AuditPanel
              membershipExpiring={membershipExpiring}
              materialExpiring={materialExpiring}
            />
          }
          tabCursos={
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className=" text-3xl tracking-tight text-white">Cursos y estado</h2>
                <p className="mt-2 text-sm text-[#888888]">Resumen de asignaciones por curso.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {courseRows.map((course) => {
                    const stats = courseStats[course.id] ?? { active: 0, total: 0 }
                    const status = stats.active > 0 ? "active" : "inactive"

                    return (
                      <article key={course.id} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7DD4C0]">{status}</p>
                            <h3 className="mt-0.5  text-lg tracking-tight text-white leading-tight">{course.name}</h3>
                            <p className="mt-1 text-xs text-[#666666]">{course.slug}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs text-[#CCCCCC]">${Number(course.price).toFixed(0)} <span className="text-[#666666]">USD</span></p>
                            {course.discount_price !== null && (
                              <p className="text-xs text-[#888888]">↑ ${Number(course.discount_price).toFixed(0)} upgrade</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex gap-4 text-xs text-[#888888]">
                          <span><span className="text-[#7DD4C0] font-semibold">{stats.active}</span> activas</span>
                          <span><span className="text-[#AAAAAA] font-semibold">{stats.total}</span> totales</span>
                        </div>

                        <form action={updateCoursePricingAction} className="mt-3 flex items-end gap-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] p-2.5">
                          <input type="hidden" name="courseId" value={course.id} />
                          <input type="hidden" name="returnTab" value="cursos" />
                          <label className="flex-1 text-[10px] text-[#888888]">
                            Base
                            <input
                              type="number"
                              name="price"
                              step="0.01"
                              min="0"
                              defaultValue={Number(course.price).toFixed(2)}
                              required
                              className="mt-1 w-full rounded-md border border-[#2A2A2A] bg-[#111111]/80 px-2 py-1.5 text-xs text-white outline-none transition-colors focus:border-[#7DD4C0]"
                            />
                          </label>
                          <label className="flex-1 text-[10px] text-[#888888]">
                            Upgrade
                            <input
                              type="number"
                              name="discountPrice"
                              step="0.01"
                              min="0"
                              defaultValue={course.discount_price !== null ? Number(course.discount_price).toFixed(2) : ""}
                              placeholder="—"
                              className="mt-1 w-full rounded-md border border-[#2A2A2A] bg-[#111111]/80 px-2 py-1.5 text-xs text-white outline-none transition-colors focus:border-[#7DD4C0]"
                            />
                          </label>
                          <button
                            type="submit"
                            className="shrink-0 rounded-md border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                          >
                            Guardar
                          </button>
                        </form>
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className=" text-3xl tracking-tight text-white">Asignaciones activas</h2>
                <p className="mt-2 text-sm text-[#888888]">
                  Quita acceso directamente por usuario y curso sin usar los selectores.
                </p>

                {activeAssignments.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4 text-sm text-[#888888]">
                    No hay asignaciones activas en este momento.
                  </div>
                ) : (
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Usuario</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Curso</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Asignado</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Vence</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Accion</th>
                        </tr>
                      </thead>
                <tbody>
                  {activeAssignments.map((row) => {
                    const userItem = userById[row.user_id]
                    const courseItem = courseById[row.course_id]

                    return (
                      <tr key={`${row.user_id}-${row.course_id}`} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70">
                        <td className="px-3 py-3 text-sm text-[#CCCCCC]">
                          {userItem?.full_name || "Sin nombre"}
                          <span className="ml-2 text-xs text-[#888888]">{userItem?.email || row.user_id}</span>
                        </td>
                        <td className="px-3 py-3 text-sm text-[#AAAAAA]">
                          {courseItem?.name || row.course_id}
                        </td>
                        <td className="px-3 py-3 text-sm text-[#888888]">
                          {row.granted_at ? new Date(row.granted_at).toLocaleDateString("es-AR") : "-"}
                        </td>
                        <td className="px-3 py-3 text-sm text-[#888888]">
                          {row.expires_at ? new Date(row.expires_at).toLocaleDateString("es-AR") : "-"}
                        </td>
                        <td className="px-3 py-3">
                          <form action={revokeCourseAction}>
                            <input type="hidden" name="targetUserId" value={row.user_id} />
                            <input type="hidden" name="courseId" value={row.course_id} />
                            <input type="hidden" name="returnTab" value="cursos" />
                            <button
                              type="submit"
                              className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-2 text-xs font-semibold text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                            >
                              Quitar acceso
                            </button>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
              </div>
            </div>
          }
          tabOrdenes={
            <OrdersSection
              orders={orderRows}
              userById={userById}
              courseById={courseById}
              markRefundedAction={markOrderRefundedAction}
              deleteOrderAction={deleteOrderAction}
            />
          }
          tabPromos={
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className=" text-3xl tracking-tight text-white">Promo codes</h2>
              <p className="mt-2 text-sm text-[#888888]">
                Crea, edita y desactiva codigos promocionales para aplicar descuentos en checkout.
              </p>

          <form action={createPromoCodeAction} className="mt-6 space-y-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-4">
            <input type="hidden" name="returnTab" value="promos" />
            <h3 className=" text-xl tracking-tight text-white">Crear nuevo codigo</h3>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs text-[#AAAAAA]">
                Codigo
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="FLOW10"
                  className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white uppercase outline-none transition-colors focus:border-[#7DD4C0]"
                />
              </label>

              <label className="text-xs text-[#AAAAAA]">
                Vencimiento
                <input
                  type="datetime-local"
                  name="validUntil"
                  className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                />
              </label>

              <label className="text-xs text-[#AAAAAA]">
                Descuento %
                <input
                  type="number"
                  name="discountPercentage"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="10"
                  className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                />
              </label>

              <label className="text-xs text-[#AAAAAA]">
                Descuento fijo (USD)
                <input
                  type="number"
                  name="discountAmount"
                  min="0"
                  step="0.01"
                  placeholder="25"
                  className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                />
              </label>

              <label className="text-xs text-[#AAAAAA] md:col-span-2">
                Maximo de usos
                <input
                  type="number"
                  name="maxUses"
                  min="1"
                  step="1"
                  placeholder="Opcional"
                  className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                />
              </label>
            </div>

            {/* Afiliado: si el cupón es de una persona que cobra comisión. */}
            <div className="rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4B86A]">Afiliado (opcional)</p>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="text-xs text-[#AAAAAA] md:col-span-2">
                  Usuario afiliado (dueño del cupón)
                  <div className="mt-1">
                    <UserSearchSelect
                      users={userRows.map((u) => ({ id: u.id, email: u.email ?? "" }))}
                      name="affiliateUserId"
                      accent="#D4B86A"
                      placeholder="Buscá el afiliado por email (vacío = promo común)"
                    />
                  </div>
                </div>
                <label className="text-xs text-[#AAAAAA]">
                  Comisión Desk (%)
                  <input type="number" name="commissionPctDesk" min="0" max="100" step="0.1" defaultValue={20}
                    className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none focus:border-[#D4B86A]" />
                </label>
                <label className="text-xs text-[#AAAAAA]">
                  Comisión Academy (%)
                  <input type="number" name="commissionPctAcademy" min="0" max="100" step="0.1" defaultValue={5}
                    className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none focus:border-[#D4B86A]" />
                </label>
                <label className="flex items-center gap-2 text-xs text-[#AAAAAA]">
                  <input type="checkbox" name="appliesDesk" value="true" defaultChecked className="accent-[#7DD4C0]" />
                  Vale en el Desk
                </label>
                <label className="flex items-center gap-2 text-xs text-[#AAAAAA]">
                  <input type="checkbox" name="appliesAcademy" value="true" defaultChecked className="accent-[#7DD4C0]" />
                  Vale en cursos
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
            >
              Crear promo code
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {promoCodeRows.length === 0 ? (
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4 text-sm text-[#888888]">
                Aun no hay promo codes cargados.
              </div>
            ) : (
              promoCodeRows.map((promo) => (
                <form
                  key={promo.code}
                  action={updatePromoCodeAction}
                  className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3"
                >
                  <input type="hidden" name="code" value={promo.code} />
                  <input type="hidden" name="returnTab" value="promos" />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg tracking-tight text-white">{promo.code}</p>
                      {promo.affiliate_name && (
                        <span className="rounded-full bg-[#D4B86A]/15 px-2 py-0.5 text-[11px] text-[#D4B86A]">
                          ★ {promo.affiliate_name}
                        </span>
                      )}
                      <span className="text-[11px] text-[#666666]">
                        {promo.applies_desk === false ? "" : "Desk"}
                        {promo.applies_desk !== false && promo.applies_academy !== false ? " · " : ""}
                        {promo.applies_academy === false ? "" : "Cursos"}
                      </span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${promo.is_active ? "bg-[#7DD4C0]/15 text-[#7DD4C0]" : "bg-[#7A2A2A]/20 text-[#F2B3B3]"}`}>
                      {promo.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#777777]">
                    <span>Usos: {promo.current_uses ?? 0}/{promo.max_uses ?? "∞"}</span>
                    {promo.affiliate_name && (
                      <>
                        <span>•</span>
                        <span>Comisión: {promo.commission_pct_desk ?? 20}% Desk · {promo.commission_pct_academy ?? 5}% cursos</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <label className="text-[11px] text-[#AAAAAA]">
                      Descuento cursos %
                      <input
                        type="number"
                        name="discountPercentage"
                        min="0"
                        max="100"
                        step="0.01"
                        defaultValue={promo.discount_percentage ?? ""}
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-1.5 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      />
                    </label>

                    <label className="text-[11px] text-[#AAAAAA]">
                      Descuento cursos fijo (USD)
                      <input
                        type="number"
                        name="discountAmount"
                        min="0"
                        step="0.01"
                        defaultValue={promo.discount_amount ?? ""}
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-1.5 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      />
                    </label>

                    <label className="text-[11px] text-[#AAAAAA]">
                      Vencimiento
                      <input
                        type="datetime-local"
                        name="validUntil"
                        defaultValue={promo.valid_until ? new Date(promo.valid_until).toISOString().slice(0, 16) : ""}
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-1.5 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      />
                    </label>

                    <label className="text-[11px] text-[#AAAAAA]">
                      Maximo de usos
                      <input
                        type="number"
                        name="maxUses"
                        min="1"
                        step="1"
                        defaultValue={promo.max_uses ?? ""}
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-1.5 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      name="isActive"
                      value="true"
                      className="rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                    >
                      Guardar
                    </button>

                    <button
                      type="submit"
                      formAction={deactivatePromoCodeAction}
                      className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                    >
                      Desactivar
                    </button>

                    <button
                      type="submit"
                      formAction={deletePromoCodeAction}
                      className="rounded-lg border border-[#7A2A2A] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                    >
                      Eliminar
                    </button>
                  </div>
                </form>
              ))
            )}
          </div>
            </div>
          }
          tabSistema={
            <div className="space-y-6">
              <TestTelegramNotificationButton />

              <ReengagementButton />

              <RegisteredUsersPanel
                users={userRows.map<RegisteredUserRow>((p) => {
                  const meta = authMetaById[p.id]
                  const activeCoursesCount = assignmentRows.filter(
                    (uc) =>
                      uc.user_id === p.id &&
                      uc.is_active &&
                      (!uc.expires_at || new Date(uc.expires_at).getTime() > nowTs)
                  ).length
                  return {
                    id: p.id,
                    email: p.email ?? "",
                    fullName: p.full_name,
                    role: p.role,
                    createdAt: meta?.created_at ?? null,
                    // last_seen_at (actividad real, trackeada por el proxy)
                    // tiene prioridad sobre last_sign_in_at de auth.users.
                    // Fallback al sign_in cuando todavía no hay actividad
                    // trackeada (usuarios viejos antes de la feature).
                    lastSignInAt: p.last_seen_at ?? meta?.last_sign_in_at ?? null,
                    activeCoursesCount,
                  }
                })}
                currentAdminId={user.id}
                deleteUserAction={deleteUserAction}
              />
            </div>
          }
        />
      </section>
    </main>
  )
}
