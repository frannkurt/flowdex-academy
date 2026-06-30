import { getCourseAccessExpiryDate } from "@/lib/courses/access-expiration"

export type CommunityAccessCourseSlug =
  | "inner-circle"
  | "membresia"
  | "trading-lab"
  | "kickstart-trading"
  | "expert-investment"
  | "kickstart-investment"

export type CommunityAccessRow = {
  slug: string | null
  grantedAt: string | null
  expiresAt: string | null
  isActive: boolean | null
}

function isRowCurrentlyActive(row: CommunityAccessRow, now: Date) {
  if (row.isActive !== true) return false
  if (!row.expiresAt) return true
  return new Date(row.expiresAt).getTime() > now.getTime()
}

export function hasEffectiveMembershipAccess(
  rows: CommunityAccessRow[],
  now: Date = new Date()
) {
  const membershipRows = rows.filter((row) => row.slug === "membresia")

  if (membershipRows.some((row) => isRowCurrentlyActive(row, now))) {
    return true
  }

  // Si ya existe una membresía registrada, respetamos ese estado. El fallback
  // solo cubre alumnos viejos de inner-circle previos al trigger retroactivo.
  if (membershipRows.length > 0) {
    return false
  }

  const innerCircleRow = rows.find((row) => row.slug === "inner-circle")
  if (!innerCircleRow || innerCircleRow.isActive !== true || !innerCircleRow.grantedAt) {
    return false
  }

  const inferredMembershipExpiry = getCourseAccessExpiryDate(
    "membresia",
    new Date(innerCircleRow.grantedAt)
  )

  return inferredMembershipExpiry.getTime() > now.getTime()
}
