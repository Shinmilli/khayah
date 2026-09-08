export const ADMIN_ROLES = ['super', 'content', 'inquiry'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export type AdminUserPublic = {
  id: number
  email: string
  name: string
  role: AdminRole
  active: boolean
  lastLoginAt: string | null
}

export function isAdminRole(value: unknown): value is AdminRole {
  return value === 'super' || value === 'content' || value === 'inquiry'
}
