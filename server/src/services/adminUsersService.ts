import { prisma } from '../utils/prisma'
import { isAdminRole, type AdminRole, type AdminUserPublic } from '../types/adminAuth'

export class AdminHttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type AdminUserRow = {
  id: number
  email: string
  name: string
  role: string
  active: boolean
  lastLoginAt: Date | null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function toPublicUser(row: AdminUserRow): AdminUserPublic {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: isAdminRole(row.role) ? row.role : 'content',
    active: row.active,
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
  }
}

function requirePrisma() {
  if (!prisma) {
    throw new AdminHttpError(503, 'Database unavailable')
  }
  return prisma
}

export async function countAdminUsers(): Promise<number> {
  return requirePrisma().adminUser.count()
}

export async function countActiveSupers(): Promise<number> {
  return requirePrisma().adminUser.count({ where: { role: 'super', active: true } })
}

export async function findAdminUserById(id: number): Promise<AdminUserRow | null> {
  return requirePrisma().adminUser.findUnique({ where: { id } })
}

export async function findAdminUserByEmail(email: string): Promise<AdminUserRow | null> {
  return requirePrisma().adminUser.findUnique({ where: { email: normalizeEmail(email) } })
}

export async function createBootstrapSuper(email: string, name: string): Promise<AdminUserRow> {
  return requirePrisma().adminUser.create({
    data: {
      email: normalizeEmail(email),
      name: name.slice(0, 120),
      role: 'super',
      active: true,
      lastLoginAt: new Date(),
    },
  })
}

const DEMO_ADMIN_EMAIL = 'demo@khayah.local'

export async function ensureDemoSuper(): Promise<AdminUserRow> {
  const existing = await findAdminUserByEmail(DEMO_ADMIN_EMAIL)
  if (existing) {
    return requirePrisma().adminUser.update({
      where: { id: existing.id },
      data: {
        role: 'super',
        active: true,
        name: existing.name || '임시 목업',
        lastLoginAt: new Date(),
      },
    })
  }
  return requirePrisma().adminUser.create({
    data: {
      email: DEMO_ADMIN_EMAIL,
      name: '임시 목업',
      role: 'super',
      active: true,
      lastLoginAt: new Date(),
    },
  })
}

export async function touchAdminLogin(id: number, name: string): Promise<AdminUserRow> {
  return requirePrisma().adminUser.update({
    where: { id },
    data: {
      lastLoginAt: new Date(),
      name: name.slice(0, 120),
    },
  })
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  return requirePrisma().adminUser.findMany({
    orderBy: [{ createdAt: 'asc' }, { email: 'asc' }],
  })
}

export async function inviteAdminUser(email: string, role: AdminRole): Promise<AdminUserRow> {
  const normalized = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new AdminHttpError(400, '올바른 이메일을 입력하세요.')
  }
  const existing = await findAdminUserByEmail(normalized)
  if (existing) {
    throw new AdminHttpError(409, '이미 등록된 이메일입니다.')
  }
  return requirePrisma().adminUser.create({
    data: {
      email: normalized,
      name: '',
      role,
      active: true,
    },
  })
}

export async function updateAdminUser(
  id: number,
  patch: { role?: AdminRole; active?: boolean },
): Promise<AdminUserRow> {
  const user = await findAdminUserById(id)
  if (!user) {
    throw new AdminHttpError(404, '계정을 찾을 수 없습니다.')
  }
  const nextRole = patch.role ?? (isAdminRole(user.role) ? user.role : 'content')
  const nextActive = patch.active ?? user.active
  if (user.role === 'super' && user.active) {
    const supers = await countActiveSupers()
    const wouldLoseSuper = nextRole !== 'super' || nextActive === false
    if (supers <= 1 && wouldLoseSuper) {
      throw new AdminHttpError(400, '마지막 슈퍼 관리자는 역할 변경·비활성화할 수 없습니다.')
    }
  }
  return requirePrisma().adminUser.update({
    where: { id },
    data: { role: nextRole, active: nextActive },
  })
}

export async function deleteAdminUser(id: number): Promise<void> {
  const user = await findAdminUserById(id)
  if (!user) {
    throw new AdminHttpError(404, '계정을 찾을 수 없습니다.')
  }
  if (user.role === 'super' && user.active) {
    const supers = await countActiveSupers()
    if (supers <= 1) {
      throw new AdminHttpError(400, '마지막 슈퍼 관리자는 삭제할 수 없습니다.')
    }
  }
  await requirePrisma().adminUser.delete({ where: { id } })
}
