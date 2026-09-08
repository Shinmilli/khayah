import { createHmac, timingSafeEqual } from 'crypto'
import type { CookieOptions, Request, Response } from 'express'

export const ADMIN_SESSION_COOKIE = 'khayah_admin'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

type SessionPayload = {
  uid: number
  iat: number
  exp: number
}

function sessionSecret(): string {
  const fromEnv = (process.env.ADMIN_SESSION_SECRET ?? '').trim()
  if (fromEnv.length >= 16) return fromEnv
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET must be set (16+ characters) in production')
  }
  return 'dev-only-khayah-admin-session'
}

function sessionCookieOptions(): CookieOptions {
  const client = (process.env.CLIENT_ORIGIN ?? '').trim()
  let crossSite = false
  try {
    if (client) {
      const host = new URL(client).hostname
      crossSite = host !== 'localhost' && host !== '127.0.0.1'
    }
  } catch {
    /* ignore invalid CLIENT_ORIGIN */
  }
  const secure = crossSite || process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS,
  }
}

export function signAdminSession(uid: number): string {
  const iat = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    uid,
    iat,
    exp: iat + Math.floor(SESSION_MAX_AGE_MS / 1000),
  }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', sessionSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyAdminSession(token: string): SessionPayload | null {
  const i = token.lastIndexOf('.')
  if (i < 0) return null
  const body = token.slice(0, i)
  const sig = token.slice(i + 1)
  let expected: string
  try {
    expected = createHmac('sha256', sessionSecret()).update(body).digest('base64url')
  } catch {
    return null
  }
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (!Number.isFinite(payload.uid) || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie
  if (!header) return null
  for (const part of header.split(';')) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    if (trimmed.slice(0, eq) !== name) continue
    return decodeURIComponent(trimmed.slice(eq + 1))
  }
  return null
}

export function setAdminSessionCookie(res: Response, uid: number): void {
  res.cookie(ADMIN_SESSION_COOKIE, signAdminSession(uid), sessionCookieOptions())
}

export function clearAdminSessionCookie(res: Response): void {
  const opts = sessionCookieOptions()
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    path: opts.path,
    secure: opts.secure,
    sameSite: opts.sameSite,
    httpOnly: opts.httpOnly,
  })
}
