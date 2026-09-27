import { prisma } from '../utils/prisma'

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS "site_documents" (
  "key" VARCHAR(64) NOT NULL,
  "body" JSONB NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_documents_pkey" PRIMARY KEY ("key")
);
`

let tableReady: Promise<void> | null = null

async function ensureTable(): Promise<void> {
  if (!prisma) return
  if (!tableReady) {
    tableReady = prisma
      .$executeRawUnsafe(CREATE_TABLE_SQL)
      .then(() => undefined)
      .catch((error: unknown) => {
        tableReady = null
        throw error
      })
  }
  await tableReady
}

function requirePrisma(): NonNullable<typeof prisma> {
  if (!prisma) {
    const err = new Error('Database unavailable')
    ;(err as Error & { status?: number }).status = 503
    throw err
  }
  return prisma
}

/** 관리자 설정 문서는 DB에만 있다. 행이 없으면 예외를 던진다. */
export async function readJsonDocument(key: string): Promise<unknown> {
  const db = requirePrisma()
  await ensureTable()
  const row = await db.siteDocument.findUnique({ where: { key } })
  if (row?.body == null) {
    const err = new Error(`Missing site document: ${key}`)
    ;(err as Error & { status?: number }).status = 404
    throw err
  }
  return row.body
}

export async function writeJsonDocument(key: string, body: unknown): Promise<void> {
  const db = requirePrisma()
  await ensureTable()
  await db.siteDocument.upsert({
    where: { key },
    create: { key, body },
    update: { body },
  })
}
