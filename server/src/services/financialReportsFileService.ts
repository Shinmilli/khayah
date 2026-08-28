import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/financial-reports.default.json'
import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'financial-reports.json')

export type FinancialReportsDocument = typeof seedDocument

function normalizeDocument(doc: FinancialReportsDocument): FinancialReportsDocument {
  return {
    ...doc,
    reports: doc.reports.map((r) => ({
      ...r,
      balanceSheetImageUrl: normalizeStoredMediaUrl(r.balanceSheetImageUrl),
      operationsStatementImageUrl: normalizeStoredMediaUrl(r.operationsStatementImageUrl),
      donationDisclosurePdfUrl: normalizeStoredMediaUrl(r.donationDisclosurePdfUrl),
    })),
  } as FinancialReportsDocument
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateDocument(body: unknown): body is FinancialReportsDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!isPlainObject(body.settings)) return false
  const s = body.settings
  if (typeof s.showBalanceSheet !== 'boolean') return false
  if (typeof s.showOperationsStatement !== 'boolean') return false
  if (typeof s.showActionButtons !== 'boolean') return false
  if (!Array.isArray(body.reports)) return false
  for (const r of body.reports) {
    if (!isPlainObject(r)) return false
    if (typeof r.year !== 'number' || !Number.isFinite(r.year)) return false
    if (!Array.isArray(r.incomeSegments) || !Array.isArray(r.expenseSegments)) return false
    if (typeof r.incomeTotalWon !== 'number' || typeof r.expenseTotalWon !== 'number') return false
    for (const seg of [...r.incomeSegments, ...r.expenseSegments]) {
      if (!isPlainObject(seg)) return false
      if (typeof seg.id !== 'string' || typeof seg.label !== 'string') return false
      if (typeof seg.percent !== 'number' || !Number.isFinite(seg.percent)) return false
      if (typeof seg.color !== 'string') return false
    }
  }
  return true
}

export async function readFinancialReportsDocument(): Promise<FinancialReportsDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (validateDocument(parsed)) return normalizeDocument(parsed)
    console.warn('[financial-reports] invalid file content, using seed')
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[financial-reports] read failed, using seed:', e)
  }
  return normalizeDocument(seedDocument as FinancialReportsDocument)
}

export async function writeFinancialReportsDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid financial reports payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8')
}
