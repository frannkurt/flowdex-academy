// Super admin de Flowdex. Es la cuenta dueña del producto y NUNCA puede
// ser eliminada, ni siquiera por otro admin con permisos. Este archivo
// es la fuente de verdad: si en el futuro cambia el email del super admin
// (migración a dominio propio), se actualiza acá UNA vez y todos los
// guards quedan sincronizados.
//
// Por qué no usar una env var: justamente para que el super admin esté
// hardcodeado en el repo y no dependa de que alguien recuerde setear la
// env. Es una decisión deliberada de "no se puede romper por accidente".

export const SUPER_ADMIN_EMAIL = "admin@example.com"

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
}
