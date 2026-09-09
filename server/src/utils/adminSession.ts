import { createHmac, timingSafeEqual } from 'crypto'
import type { CookieOptions, Request, Response } from 'express'
import type { AdminRole, AdminUserPublic } from '../types/adminAuth'
import { isAdminRole } from '../types/adminAuth'

export const ADMIN_SESSION_COOKIE = 'khayah_admin'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const DEV_SESSION_SECRET = 'dev-only-khayah-admin-session'

export const DEMO_ADMIN_PUBLIC: AdminUserPublic = {
  id: 0,
  email: 'demo@khayah.local',
  name: '임시 목업',
  role: 'super',
  active: true,
  lastLoginAt: null,
}

export function isDemoLoginAllowed(): boolean {
  const flag = (process.env.ADMIN_DEMO_LOGIN ?? process.env.ADMIN_DEV_LOGIN ?? '').trim().toLowerCase()
  if (flag === 'false' || flag === '0' || flag === 'off') return false
  return true
}

export function parseClientOrigins(raw = process.env.CLIENT_ORIGIN ?? ''): string[] {
  return raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

export type SessionPayload = {
  uid: number
  iat: number
  exp: number
  demo?: boolean
  role?: AdminRole
  email?: string
  name?: string
}

function sessionSecret(): string {
  const fromEnv = (process.env.ADMIN_SESSION_SECRET ?? '').trim()
  if (fromEnv.length >= 16) return fromEnv
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[admin session] ADMIN_SESSION_SECRET is missing or shorter than 16 characters. Using an insecure fallback so demo login can work. Set a 16+ character secret in production.',
    )
  }
  return DEV_SESSION_SECRET
}

function sessionCookieOptions(): CookieOptions {
  const origins = parseClientOrigins()
  let crossSite = process.env.NODE_ENV === 'production'
  for (const origin of origins) {
    try {
      const host = new URL(origin).hostname
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        crossSite = true
        break
      }
    } catch {
      /* ignore invalid CLIENT_ORIGIN entry */
    }
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

function applySessionCookie(res: Response, token: string, clear = false): void {
  const opts = sessionCookieOptions()
  const sameSite = opts.sameSite === 'none' ? 'None' : opts.sameSite === 'strict' ? 'Strict' : 'Lax'
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${clear ? '' : encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${clear ? 0 : Math.floor(SESSION_MAX_AGE_MS / 1000)}`,
    'HttpOnly',
    `SameSite=${sameSite}`,
  ]
  if (opts.secure) parts.push('Secure')
  res.append('Set-Cookie', parts.join('; '))
}

export function signAdminSession(uid: number, extra?: Omit<SessionPayload, 'uid' | 'iat' | 'exp'>): string {
  const iat = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    uid,
    iat,
    exp: iat + Math.floor(SESSION_MAX_AGE_MS / 1000),
    ...extra,
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

export function readSessionToken(req: Request): string | null {
  const fromCookie = readCookie(req, ADMIN_SESSION_COOKIE)
  const header = (req.headers.authorization ?? '').trim()
  const match = /^Bearer\s+(\S+)/i.exec(header)
  const fromHeader = match?.[1] ?? null
  if (fromCookie && verifyAdminSession(fromCookie)) return fromCookie
  if (fromHeader && verifyAdminSession(fromHeader)) return fromHeader
  return fromCookie || fromHeader
}

export function setAdminSessionCookie(
  res: Response,
  uid: number,
  extra?: Omit<SessionPayload, 'uid' | 'iat' | 'exp'>,
): string {
  const token = signAdminSession(uid, extra)
  try {
    applySessionCookie(res, token)
  } catch (e) {
    console.warn('[admin session] failed to set cookie', e)
  }
  return token
}

export function demoUserFromSession(session: SessionPayload): AdminUserPublic {
  return {
    id: Number.isFinite(session.uid) ? session.uid : DEMO_ADMIN_PUBLIC.id,
    email: session.email || DEMO_ADMIN_PUBLIC.email,
    name: session.name || DEMO_ADMIN_PUBLIC.name,
    role: isAdminRole(session.role) ? session.role : DEMO_ADMIN_PUBLIC.role,
    active: true,
    lastLoginAt: null,
  }
}

export function clearAdminSessionCookie(res: Response): void {
  try {
    applySessionCookie(res, '', true)
  } catch (e) {
    console.warn('[admin session] failed to clear cookie', e)
  }
}
