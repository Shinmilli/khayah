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

    const pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') || connectionString.includes('supabase')
        ? { rejectUnauthorized: false }
        : undefined,
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
