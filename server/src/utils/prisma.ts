/**
 * Allows the server to boot without a `DATABASE_URL`.
 *
 * IMPORTANT:
 * - `@prisma/client` is conditionally loaded to avoid runtime failures when the
 *   Prisma Client hasn't been generated yet (common during early setup).
 */

function normalizeDatabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null
  let s = raw.trim()
  // Render/env paste often includes surrounding quotes from .env files
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s.length ? s : null
}

/** pg: URL의 sslmode와 Pool ssl 옵션이 충돌하면 TLS 오류가 난다. ssl 관련 쿼리 제거. */
function stripSslQueryParams(url: string): string {
  try {
    const u = new URL(url)
    ;['sslmode', 'ssl', 'sslaccept', 'sslcert', 'sslkey', 'sslrootcert'].forEach((k) => u.searchParams.delete(k))
    return u.toString()
  } catch {
    return url
      .replace(/[?&]sslmode=[^&]*/gi, '')
      .replace(/[?&]sslaccept=[^&]*/gi, '')
      .replace(/\?&/, '?')
      .replace(/\?$/, '')
  }
}

const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL)

export type PrismaInitStatus = {
  ok: boolean
  reason?: 'mock_data' | 'missing_database_url' | 'init_failed'
  message?: string
}

export let prismaInitStatus: PrismaInitStatus = { ok: false, reason: 'missing_database_url' }

export const prisma: any | null = (() => {
  if (process.env.MOCK_DATA === 'true') {
    prismaInitStatus = { ok: false, reason: 'mock_data' }
    return null
  }
  if (!connectionString) {
    prismaInitStatus = { ok: false, reason: 'missing_database_url' }
    return null
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PrismaClientRuntime = (require('@prisma/client') as any).PrismaClient as new (...args: any[]) => any
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pg = require('pg') as typeof import('pg')

    const isRemote =
      /supabase\.com|render\.com|amazonaws\.com|pooler\./i.test(connectionString) ||
      process.env.NODE_ENV === 'production'

    const pool = new pg.Pool({
      connectionString: stripSslQueryParams(connectionString),
      // Supabase/Render: Node TLS가 중간 CA를 self-signed로 거부하는 경우가 있음
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    })
    const adapter = new PrismaPg(pool)
    const client = new PrismaClientRuntime({ adapter })
    prismaInitStatus = { ok: true }
    console.log('[prisma] initialized OK')
    return client
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    prismaInitStatus = { ok: false, reason: 'init_failed', message }
    console.warn(
      '[WARN] Prisma client could not be initialized. Falling back to mock data. Set MOCK_DATA=true to silence this warning.',
      error,
    )
    return null
  }
})()
