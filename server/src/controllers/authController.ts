import type { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { verifyGoogleIdToken } from '../utils/googleIdToken'
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
} from '../utils/adminSession'
import { loadAdminUser } from '../middlewares/requireAdmin'
import {
  AdminHttpError,
  countAdminUsers,
  createBootstrapSuper,
  ensureDemoSuper,
  findAdminUserByEmail,
  normalizeEmail,
  toPublicUser,
  touchAdminLogin,
} from '../services/adminUsersService'

function isDemoLoginAllowed(): boolean {
  const flag = (process.env.ADMIN_DEMO_LOGIN ?? '').trim().toLowerCase()
  if (flag === 'false' || flag === '0' || flag === 'off') return false
  return true
}

function sendAdminError(res: Response, e: unknown, fallback: string) {
  if (e instanceof AdminHttpError) {
    res.status(e.status).json({ error: e.message })
    return
  }
  console.error(e)
  res.status(500).json({ error: fallback })
}

export async function postGoogleLogin(req: Request, res: Response) {
  if (!prisma) {
    res.status(503).json({ error: 'Database unavailable' })
    return
  }
  const idToken = typeof req.body?.idToken === 'string' ? req.body.idToken.trim() : ''
  if (!idToken) {
    res.status(400).json({ error: 'idToken is required' })
    return
  }

  let google: { email: string; emailVerified: boolean; name: string }
  try {
    google = await verifyGoogleIdToken(idToken)
  } catch (e) {
    console.error('[auth/google]', e)
    res.status(401).json({ error: 'Google 로그인 검증에 실패했습니다.' })
    return
  }

  if (!google.email || !google.emailVerified) {
    res.status(403).json({ error: '인증된 Google 이메일만 사용할 수 있습니다.' })
    return
  }

  const email = normalizeEmail(google.email)
  const displayName = google.name || email.split('@')[0] || ''

  try {
    const existing = await findAdminUserByEmail(email)
    if (!existing) {
      const total = await countAdminUsers()
      const bootstrap = normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL ?? '')
      if (total === 0 && bootstrap && bootstrap === email) {
        const created = await createBootstrapSuper(email, displayName)
        setAdminSessionCookie(res, created.id)
        res.json({ user: toPublicUser(created) })
        return
      }
      res.status(403).json({
        error: '등록되지 않은 계정입니다. 슈퍼 관리자에게 초대를 요청하세요.',
      })
      return
    }
    if (!existing.active) {
      res.status(403).json({ error: '비활성화된 계정입니다.' })
      return
    }
    const updated = await touchAdminLogin(existing.id, displayName || existing.name)
    setAdminSessionCookie(res, updated.id)
    res.json({ user: toPublicUser(updated) })
  } catch (e) {
    sendAdminError(res, e, '로그인 처리에 실패했습니다.')
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await loadAdminUser(req)
    if (!user) {
      res.status(401).json({ error: '로그인이 필요합니다.' })
      return
    }
    res.json({ user })
  } catch (e) {
    sendAdminError(res, e, '세션 확인에 실패했습니다.')
  }
}

export async function postLogout(_req: Request, res: Response) {
  clearAdminSessionCookie(res)
  res.json({ ok: true })
}

export async function postDemoLogin(_req: Request, res: Response) {
  if (!isDemoLoginAllowed()) {
    res.status(403).json({ error: '임시 목업 로그인이 비활성화되어 있습니다.' })
    return
  }
  if (!prisma) {
    res.status(503).json({ error: 'Database unavailable' })
    return
  }
  try {
    const user = await ensureDemoSuper()
    setAdminSessionCookie(res, user.id)
    res.json({ user: toPublicUser(user) })
  } catch (e) {
    sendAdminError(res, e, '목업 로그인에 실패했습니다.')
  }
}
