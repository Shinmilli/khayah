import type { Request, Response } from 'express'
import { isAdminRole } from '../types/adminAuth'
import {
  AdminHttpError,
  deleteAdminUser,
  inviteAdminUser,
  listAdminUsers,
  toPublicUser,
  updateAdminUser,
} from '../services/adminUsersService'

function sendAdminError(res: Response, e: unknown, fallback: string) {
  if (e instanceof AdminHttpError) {
    res.status(e.status).json({ error: e.message })
    return
  }
  console.error(e)
  res.status(500).json({ error: fallback })
}

export async function adminListUsers(_req: Request, res: Response) {
  try {
    const rows = await listAdminUsers()
    res.json({ users: rows.map(toPublicUser) })
  } catch (e) {
    sendAdminError(res, e, '관리자 목록을 불러오지 못했습니다.')
  }
}

export async function adminInviteUser(req: Request, res: Response) {
  const email = typeof req.body?.email === 'string' ? req.body.email : ''
  const role = req.body?.role
  if (!isAdminRole(role)) {
    res.status(400).json({ error: '역할은 super, content, inquiry 중 하나여야 합니다.' })
    return
  }
  try {
    const created = await inviteAdminUser(email, role)
    res.status(201).json(toPublicUser(created))
  } catch (e) {
    sendAdminError(res, e, '초대에 실패했습니다.')
  }
}

export async function adminPatchUser(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  const patch: { role?: 'super' | 'content' | 'inquiry'; active?: boolean } = {}
  if (req.body?.role !== undefined) {
    if (!isAdminRole(req.body.role)) {
      res.status(400).json({ error: '역할은 super, content, inquiry 중 하나여야 합니다.' })
      return
    }
    patch.role = req.body.role
  }
  if (req.body?.active !== undefined) {
    if (typeof req.body.active !== 'boolean') {
      res.status(400).json({ error: 'active must be boolean' })
      return
    }
    patch.active = req.body.active
  }
  if (patch.role === undefined && patch.active === undefined) {
    res.status(400).json({ error: 'role 또는 active가 필요합니다.' })
    return
  }
  try {
    const updated = await updateAdminUser(id, patch)
    res.json(toPublicUser(updated))
  } catch (e) {
    sendAdminError(res, e, '계정 변경에 실패했습니다.')
  }
}

export async function adminDeleteUser(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  try {
    await deleteAdminUser(id)
    res.status(204).end()
  } catch (e) {
    sendAdminError(res, e, '계정 삭제에 실패했습니다.')
  }
}
