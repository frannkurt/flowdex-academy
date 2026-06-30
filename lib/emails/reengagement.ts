import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  sendReengagementInactive,
  sendReengagementNeverEntered,
  sendReengagementCommunity,
} from "./send"

/**
 * Motor de re-enganche por email. Reutilizado por:
 *   - el cron diario (/api/maintenance/reengagement)
 *   - el botón del panel de admin
 *
 * Dos públicos:
 *   - 'inactive'      → entró alguna vez pero hace ≥7 días no vuelve. Ciclo de
 *                       4 mails (umbral 7/14/21/28 días de inactividad). Se
 *                       reinicia solo: contamos únicamente los mails enviados
 *                       DESPUÉS de su última actividad (last_seen_at), así que
 *                       si vuelve y se va de nuevo, arranca un ciclo nuevo.
 *   - 'never_entered' → registró cuenta y nunca entró (sin last_seen_at ni
 *                       last_sign_in_at). 2 mails (día 3 y 10 desde el registro).
 *
 * Espaciado mínimo entre mails de un mismo ciclo: 6 días, para que aunque un
 * alumno aparezca con mucha inactividad acumulada no le caigan los 4 juntos.
 */

const INACTIVE_THRESHOLDS_DAYS = [7, 14, 21, 28] // paso 1..4
const NEVER_ENTERED_THRESHOLDS_DAYS = [3, 10] // paso 1..2
const COMMUNITY_THRESHOLDS_DAYS = [3, 6] // paso 1..2, anclado a la fecha del primer curso activo
const MIN_GAP_DAYS = 6
const COMMUNITY_MIN_GAP_DAYS = 3
const MS_DAY = 24 * 60 * 60 * 1000

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  last_seen_at: string | null
}

type EngagementKind = "inactive" | "never_entered" | "community"

type EngagementRow = {
  user_id: string
  kind: EngagementKind
  step: number
  sent_at: string
}

type AuthMeta = { created_at?: string; last_sign_in_at?: string | null }

export type ReengagementRecipient = {
  email: string
  kind: EngagementKind
  step: number
}

export type ReengagementSummary = {
  ok: boolean
  dryRun: boolean
  inactiveSent: number
  neverEnteredSent: number
  communitySent: number
  recipients: ReengagementRecipient[]
  executedAt: string
  error?: string
}

function firstName(fullName: string | null): string | null {
  return fullName?.trim().split(" ")[0] || null
}

async function loadAuthMeta(
  adminClient: SupabaseClient
): Promise<Map<string, AuthMeta>> {
  const map = new Map<string, AuthMeta>()
  // listUsers pagina de a 1000. Flowdex es chico; recorremos hasta agotar.
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) break
    const users = data?.users ?? []
    for (const u of users) {
      map.set(u.id, { created_at: u.created_at, last_sign_in_at: u.last_sign_in_at ?? null })
    }
    if (users.length < 1000) break
  }
  return map
}

/**
 * Corre una pasada de re-enganche. Si dryRun=true, no manda ni registra nada:
 * devuelve a quién le llegaría qué. `onlyEmail` permite forzar el cálculo para
 * un solo alumno (útil para probar desde el panel).
 */
export async function runReengagement(options?: {
  dryRun?: boolean
  onlyEmail?: string | null
}): Promise<ReengagementSummary> {
  const dryRun = options?.dryRun ?? false
  const onlyEmail = options?.onlyEmail?.trim().toLowerCase() || null
  const executedAt = new Date().toISOString()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      dryRun,
      inactiveSent: 0,
      neverEnteredSent: 0,
      communitySent: 0,
      recipients: [],
      executedAt,
      error: "Servidor no configurado (faltan variables de Supabase).",
    }
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    return await runReengagementInner(adminClient, { dryRun, onlyEmail, executedAt })
  } catch (error) {
    return {
      ok: false,
      dryRun,
      inactiveSent: 0,
      neverEnteredSent: 0,
      communitySent: 0,
      recipients: [],
      executedAt,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function runReengagementInner(
  adminClient: SupabaseClient,
  context: { dryRun: boolean; onlyEmail: string | null; executedAt: string }
): Promise<ReengagementSummary> {
  const { dryRun, onlyEmail, executedAt } = context

  const [
    { data: profilesData },
    { data: engagementData },
    authMeta,
    { data: activeCoursesData },
    { data: discordGrantsData },
    { data: discordConnectionsData },
    { data: telegramJoinedData },
  ] = await Promise.all([
    adminClient.from("profiles").select("id, email, full_name, role, last_seen_at").limit(10000),
    adminClient
      .from("engagement_emails")
      .select("user_id, kind, step, sent_at")
      .limit(50000)
      .then((res) => {
        // Sin esta tabla NO se puede garantizar idempotencia: si falla la
        // lectura (ej. migración sin correr), abortamos en vez de arriesgar
        // mandar duplicados todos los días.
        if (res.error) {
          throw new Error(
            `No se pudo leer engagement_emails (${res.error.code ?? "?"}): ${res.error.message}. ¿Corriste la migración 20260603000003?`
          )
        }
        return res
      }),
    loadAuthMeta(adminClient),
    adminClient
      .from("user_courses")
      .select("user_id, granted_at, expires_at")
      .eq("is_active", true)
      .limit(50000),
    adminClient.from("discord_role_grants").select("user_id").is("revoked_at", null).limit(50000),
    adminClient.from("discord_connections").select("user_id").limit(50000),
    adminClient
      .from("telegram_memberships")
      .select("user_id")
      .not("joined_at", "is", null)
      .limit(50000),
  ])

  const profiles = ((profilesData ?? []) as ProfileRow[]).filter(
    (p) => p.role !== "admin" && Boolean(p.email)
  )
  const engagement = (engagementData ?? []) as EngagementRow[]

  // Index de envíos por usuario.
  const sentByUser = new Map<string, EngagementRow[]>()
  for (const row of engagement) {
    const list = sentByUser.get(row.user_id) ?? []
    list.push(row)
    sentByUser.set(row.user_id, list)
  }

  // Presencia en comunidad: alcanza con UNA de las dos apps. Discord cuenta
  // con rol vigente o cuenta vinculada; Telegram solo si efectivamente entró
  // al grupo (joined_at relleno — el invite generado sin usar no cuenta).
  const inCommunity = new Set<string>()
  for (const row of (discordGrantsData ?? []) as Array<{ user_id: string }>) inCommunity.add(row.user_id)
  for (const row of (discordConnectionsData ?? []) as Array<{ user_id: string }>) inCommunity.add(row.user_id)
  for (const row of (telegramJoinedData ?? []) as Array<{ user_id: string }>) inCommunity.add(row.user_id)

  // Primer curso activo (no vencido) por usuario: ancla del recordatorio de
  // comunidad. Sin curso activo no hay comunidad que reclamar.
  const nowTs = Date.now()
  const activeCourseSince = new Map<string, number>()
  for (const row of (activeCoursesData ?? []) as Array<{
    user_id: string
    granted_at: string
    expires_at: string | null
  }>) {
    if (row.expires_at && new Date(row.expires_at).getTime() <= nowTs) continue
    const grantedTs = new Date(row.granted_at).getTime()
    const current = activeCourseSince.get(row.user_id)
    if (!current || grantedTs < current) activeCourseSince.set(row.user_id, grantedTs)
  }

  const now = Date.now()
  const recipients: ReengagementRecipient[] = []

  for (const profile of profiles) {
    const email = profile.email as string
    if (onlyEmail && email.toLowerCase() !== onlyEmail) continue

    const meta = authMeta.get(profile.id)
    const lastSeen = profile.last_seen_at ? new Date(profile.last_seen_at).getTime() : null
    const lastSignIn = meta?.last_sign_in_at ? new Date(meta.last_sign_in_at).getTime() : null
    const activity = Math.max(lastSeen ?? 0, lastSignIn ?? 0) || null

    const userSent = sentByUser.get(profile.id) ?? []

    if (!activity) {
      // ---- Nunca entró ----
      const createdAt = meta?.created_at ? new Date(meta.created_at).getTime() : null
      if (!createdAt) continue
      const daysSinceSignup = (now - createdAt) / MS_DAY

      const neverSent = userSent.filter((s) => s.kind === "never_entered")
      const nextStep = neverSent.length + 1
      if (nextStep > NEVER_ENTERED_THRESHOLDS_DAYS.length) continue
      if (daysSinceSignup < NEVER_ENTERED_THRESHOLDS_DAYS[nextStep - 1]) continue

      const lastSent = neverSent.reduce((max, s) => Math.max(max, new Date(s.sent_at).getTime()), 0)
      if (lastSent && (now - lastSent) / MS_DAY < MIN_GAP_DAYS) continue

      recipients.push({ email, kind: "never_entered", step: nextStep })
      if (!dryRun) {
        const ok = await sendReengagementNeverEntered({
          to: email,
          firstName: firstName(profile.full_name),
          step: nextStep,
        })
        // Registramos el envío en el acto (no en batch al final): así un disparo
        // manual y el cron del mismo día nunca mandan dos veces — el segundo en
        // correr ya ve el registro y saltea. El timer reinicia desde este envío.
        if (ok) {
          await adminClient
            .from("engagement_emails")
            .insert({ user_id: profile.id, kind: "never_entered", step: nextStep })
        }
      }
      continue
    }

    // ---- Entró pero frenó ----
    const daysInactive = (now - activity) / MS_DAY
    let sentInactiveNow = false

    if (daysInactive >= INACTIVE_THRESHOLDS_DAYS[0]) {
      // Solo cuentan los mails de este ciclo: enviados DESPUÉS de la última
      // actividad. Si volvió a entrar, los viejos quedan antes de `activity` y
      // el ciclo se reinicia.
      const inactiveThisStreak = userSent.filter(
        (s) => s.kind === "inactive" && new Date(s.sent_at).getTime() > activity
      )
      const nextStep = inactiveThisStreak.length + 1
      const lastInStreak = inactiveThisStreak.reduce(
        (max, s) => Math.max(max, new Date(s.sent_at).getTime()),
        0
      )
      const gapOk = !lastInStreak || (now - lastInStreak) / MS_DAY >= MIN_GAP_DAYS

      if (
        nextStep <= INACTIVE_THRESHOLDS_DAYS.length &&
        daysInactive >= INACTIVE_THRESHOLDS_DAYS[nextStep - 1] &&
        gapOk
      ) {
        recipients.push({ email, kind: "inactive", step: nextStep })
        sentInactiveNow = true
        if (!dryRun) {
          const ok = await sendReengagementInactive({
            to: email,
            firstName: firstName(profile.full_name),
            step: nextStep,
          })
          if (ok) {
            await adminClient
              .from("engagement_emails")
              .insert({ user_id: profile.id, kind: "inactive", step: nextStep })
          }
        }
      }
    }

    // Máximo un mail por usuario por pasada: si le tocó el de inactividad, el
    // de comunidad espera a la próxima (y ese mail ya menciona la comunidad).
    if (sentInactiveNow) continue

    // ---- Tiene curso activo pero no entró a NINGUNA comunidad ----
    // Si ya está en una de las dos (Discord o Telegram), no se lo molesta.
    if (inCommunity.has(profile.id)) continue
    const grantTs = activeCourseSince.get(profile.id)
    if (!grantTs) continue

    const daysSinceGrant = (now - grantTs) / MS_DAY
    const communitySentRows = userSent.filter((s) => s.kind === "community")
    const communityStep = communitySentRows.length + 1
    if (communityStep > COMMUNITY_THRESHOLDS_DAYS.length) continue
    if (daysSinceGrant < COMMUNITY_THRESHOLDS_DAYS[communityStep - 1]) continue

    const lastCommunity = communitySentRows.reduce(
      (max, s) => Math.max(max, new Date(s.sent_at).getTime()),
      0
    )
    if (lastCommunity && (now - lastCommunity) / MS_DAY < COMMUNITY_MIN_GAP_DAYS) continue

    recipients.push({ email, kind: "community", step: communityStep })
    if (!dryRun) {
      const ok = await sendReengagementCommunity({
        to: email,
        firstName: firstName(profile.full_name),
        step: communityStep,
      })
      if (ok) {
        await adminClient
          .from("engagement_emails")
          .insert({ user_id: profile.id, kind: "community", step: communityStep })
      }
    }
  }

  return {
    ok: true,
    dryRun,
    inactiveSent: recipients.filter((r) => r.kind === "inactive").length,
    neverEnteredSent: recipients.filter((r) => r.kind === "never_entered").length,
    communitySent: recipients.filter((r) => r.kind === "community").length,
    recipients,
    executedAt,
  }
}
