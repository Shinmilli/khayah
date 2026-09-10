import type { NextFunction, Request, Response } from 'express'
import { isAdminRole, type AdminRole, type AdminUserPublic } from '../types/adminAuth'
import { prisma } from '../utils/prisma'
import {
  demoUserFromSession,
  isDemoLoginAllowed,
  readSessionToken,
  verifyAdminSession,
  type SessionPayload,
} from '../utils/adminSession'
import { findAdminUserById } from '../services/adminUsersService'

export async function loadAdminUser(req: Request): Promise<AdminUserPublic | null> {
  const token = readSessionToken(req)
  if (!token) return null
  let session: SessionPayload | null = null
  try {
    session = verifyAdminSession(token)
  } catch {
    return null
  }
  if (!session) return null
  if (session.demo) {
    if (!isDemoLoginAllowed()) return null
    return demoUserFromSession(session)
  }
  if (!prisma) return null
  const row = await findAdminUserById(session.uid)
  if (!row || !row.active || !isAdminRole(row.role)) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    active: true,
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
  }
}

export function requireRoles(roles: readonly AdminRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await loadAdminUser(req)
      if (!user) {
        res.status(401).json({ error: '로그인이 필요합니다.' })
        return
      }
      if (!roles.includes(user.role)) {
        res.status(403).json({ error: '권한이 없습니다.' })
        return
      }
      ;(req as Request & { adminUser: AdminUserPublic }).adminUser = user
      next()
    } catch (e) {
      console.error('[admin auth]', e)
      res.status(500).json({ error: '인증 처리 중 오류가 났습니다.' })
    }
  }
}

const SUPER: AdminRole[] = ['super']
const CONTENT: AdminRole[] = ['super', 'content']
const INQUIRY: AdminRole[] = ['super', 'inquiry']
const FAQ: AdminRole[] = ['super', 'content', 'inquiry']

/** Path-based RBAC for /api (mounted at /api, so req.path is e.g. /admin/posts). */
export async function adminAuthGuard(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next()
    return
  }
  const p = req.path
  if (p.startsWith('/auth/')) {
    next()
    return
  }
  if (p.startsWith('/admin/users')) {
    await requireRoles(SUPER)(req, res, next)
    return
  }
  if (p.startsWith('/admin/inquiries')) {
    await requireRoles(INQUIRY)(req, res, next)
    return
  }
  if (p.startsWith('/admin/inquiry-faq')) {
    await requireRoles(FAQ)(req, res, next)
    return
  }
  if (p.startsWith('/admin/')) {
    await requireRoles(CONTENT)(req, res, next)
    return
  }
  if (
    p === '/uploads/document' ||
    p === '/uploads/image' ||
    p === '/uploads/video' ||
    p === '/uploads/delete'
  ) {
    await requireRoles(CONTENT)(req, res, next)
    return
  }
  next()
}
