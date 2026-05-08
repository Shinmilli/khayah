/**
 * Allows the server to boot without a `DATABASE_URL`.
 *
 * IMPORTANT:
 * - `@prisma/client` is conditionally loaded to avoid runtime failures when the
 *   Prisma Client hasn't been generated yet (common during early setup).
 */

const connectionString = process.env.DATABASE_URL

export const prisma: any | null = (() => {
  if (process.env.MOCK_DATA === 'true') return null
  if (!connectionString) return null

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PrismaClientRuntime = (require('@prisma/client') as any).PrismaClient as new (...args: any[]) => any
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pg = require('pg') as typeof import('pg')

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClientRuntime({ adapter })
  } catch (error) {
    console.warn(
      '[WARN] Prisma client could not be initialized. Falling back to mock data. Set MOCK_DATA=true to silence this warning.',
      error,
    )
    return null
  }
})()
