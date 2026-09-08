export type AdminRole = 'super' | 'content' | 'inquiry'

export type AdminUserPublic = {
  id: number
  email: string
  name: string
  role: AdminRole
  active: boolean
  lastLoginAt: string | null
}

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  super: '슈퍼 관리자',
  content: '콘텐츠',
  inquiry: '문의',
}

export const ADMIN_ROLES: AdminRole[] = ['super', 'content', 'inquiry']

export function homePathForRole(role: AdminRole): string {
  return role === 'inquiry' ? '/admin/app/inquiries' : '/admin/app/main-banner'
}
