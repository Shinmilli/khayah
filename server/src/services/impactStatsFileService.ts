import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/impact-stats.default.json'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'impact-stats.json')

export type ImpactStatsDocument = typeof seedDocument

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateDocument(body: unknown): body is ImpactStatsDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!isPlainObject(body.donut)) return false
  const donut = body.donut
  if (typeof donut.percent !== 'number' || !Number.isFinite(donut.percent)) return false
  if (donut.percent < 0 || donut.percent > 100) return false
  if (!Array.isArray(donut.labelLines)) return false
  if (!donut.labelLines.every((line) => typeof line === 'string')) return false
  if (!Array.isArray(body.stats)) return false
  for (const row of body.stats) {
    if (!isPlainObject(row)) return false
    if (typeof row.id !== 'string' || !row.id.trim()) return false
    if (typeof row.label !== 'string') return false
    if (typeof row.value !== 'string') return false
    if (row.unit != null && typeof row.unit !== 'string') return false
  }
  return true
}

export async function readImpactStatsDocument(): Promise<ImpactStatsDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (validateDocument(parsed)) return parsed
    console.warn('[impact-stats] invalid file content, using seed')
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[impact-stats] read failed, using seed:', e)
  }
  return seedDocument as ImpactStatsDocument
}

export async function writeImpactStatsDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid impact stats payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8')
}
