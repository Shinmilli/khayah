import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/financial-reports.default.json'
import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'financial-reports.json')

export type FinancialReportSegmentLabels = { ko: string; en: string }

export type FinancialReportSegmentV2 = {
  id: string
  percent: number
  color: string
  labels: FinancialReportSegmentLabels
}

export type FinancialReportPageSettings = {
  showBalanceSheet: boolean
  showOperationsStatement: boolean
  showActionButtons: boolean
}

export type FinancialReportYearDataV2 = {
  year: number
  incomeSegments: FinancialReportSegmentV2[]
  expenseSegments: FinancialReportSegmentV2[]
  incomeTotalWon: number
  expenseTotalWon: number
  balanceSheetImageUrl?: string | null
  operationsStatementImageUrl?: string | null
  donationDisclosurePdfUrl?: string | null
}

export type FinancialReportsDocumentV2 = {
  version: 2
  settings: FinancialReportPageSettings
  reports: FinancialReportYearDataV2[]
}

/** 공개 API 응답 — locale별 label이 풀린 형태 */
export type FinancialReportSegmentPublic = {
  id: string
  label: string
  percent: number
  color: string
}

export type FinancialReportYearDataPublic = Omit<
  FinancialReportYearDataV2,
  'incomeSegments' | 'expenseSegments'
> & {
  incomeSegments: FinancialReportSegmentPublic[]
  expenseSegments: FinancialReportSegmentPublic[]
}

export type FinancialReportsPublicDocument = {
  version: 2
  settings: FinancialReportPageSettings
  reports: FinancialReportYearDataPublic[]
}

type FinancialReportSegmentV1 = {
  id: string
  label: string
  percent: number
  color: string
}

type FinancialReportYearDataV1 = Omit<FinancialReportYearDataV2, 'incomeSegments' | 'expenseSegments'> & {
  incomeSegments: FinancialReportSegmentV1[]
  expenseSegments: FinancialReportSegmentV1[]
}

type FinancialReportsDocumentV1 = {
  version: 1
  settings: FinancialReportPageSettings
  reports: FinancialReportYearDataV1[]
}

export type FinancialReportsDocument = FinancialReportsDocumentV2
export type FinancialLocale = 'ko' | 'en'

const SEGMENT_LABEL_EN_BY_ID: Record<string, string> = {
  misc: 'Other income',
  brought_forward: 'Brought forward',
  subsidy: 'Subsidies',
  donation: 'Donations',
  fundraising: 'Fundraising costs',
  carried_next: 'Carried forward',
  admin: 'General administration',
  programs: 'Program expenses',
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function defaultEnLabel(id: string, koLabel: string): string {
  return SEGMENT_LABEL_EN_BY_ID[id] ?? koLabel
}

function validateSegmentV2(v: unknown): v is FinancialReportSegmentV2 {
  if (!isPlainObject(v)) return false
  if (typeof v.id !== 'string' || typeof v.percent !== 'number' || typeof v.color !== 'string') return false
  if (!isPlainObject(v.labels)) return false
  return typeof v.labels.ko === 'string' && typeof v.labels.en === 'string'
}

function validateYearV2(v: unknown): v is FinancialReportYearDataV2 {
  if (!isPlainObject(v)) return false
  if (typeof v.year !== 'number' || !Number.isFinite(v.year)) return false
  if (!Array.isArray(v.incomeSegments) || !Array.isArray(v.expenseSegments)) return false
  if (typeof v.incomeTotalWon !== 'number' || typeof v.expenseTotalWon !== 'number') return false
  return v.incomeSegments.every(validateSegmentV2) && v.expenseSegments.every(validateSegmentV2)
}

function validateDocumentV2(body: unknown): body is FinancialReportsDocumentV2 {
  if (!isPlainObject(body)) return false
  if (body.version !== 2) return false
  if (!isPlainObject(body.settings)) return false
  const s = body.settings
  if (typeof s.showBalanceSheet !== 'boolean') return false
  if (typeof s.showOperationsStatement !== 'boolean') return false
  if (typeof s.showActionButtons !== 'boolean') return false
  if (!Array.isArray(body.reports)) return false
  return body.reports.every(validateYearV2)
}

function validateSegmentV1(v: unknown): v is FinancialReportSegmentV1 {
  if (!isPlainObject(v)) return false
  return typeof v.id === 'string' && typeof v.label === 'string' && typeof v.percent === 'number' && typeof v.color === 'string'
}

function validateDocumentV1(body: unknown): body is FinancialReportsDocumentV1 {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!isPlainObject(body.settings)) return false
  if (!Array.isArray(body.reports)) return false
  for (const r of body.reports) {
    if (!isPlainObject(r)) return false
    if (typeof r.year !== 'number') return false
    if (!Array.isArray(r.incomeSegments) || !Array.isArray(r.expenseSegments)) return false
    if (!r.incomeSegments.every(validateSegmentV1) || !r.expenseSegments.every(validateSegmentV1)) return false
  }
  return true
}

function mapSegmentV1ToV2(seg: FinancialReportSegmentV1): FinancialReportSegmentV2 {
  return {
    id: seg.id,
    percent: seg.percent,
    color: seg.color,
    labels: { ko: seg.label, en: defaultEnLabel(seg.id, seg.label) },
  }
}

function migrateV1ToV2(v1: FinancialReportsDocumentV1): FinancialReportsDocumentV2 {
  return {
    version: 2,
    settings: v1.settings,
    reports: v1.reports.map((r) => ({
      ...r,
      incomeSegments: r.incomeSegments.map(mapSegmentV1ToV2),
      expenseSegments: r.expenseSegments.map(mapSegmentV1ToV2),
    })),
  }
}

function normalizeDocument(body: unknown): FinancialReportsDocumentV2 {
  if (validateDocumentV2(body)) return normalizeDocumentMedia(body)
  if (validateDocumentV1(body)) return normalizeDocumentMedia(migrateV1ToV2(body))
  return normalizeDocumentMedia(seedDocument as FinancialReportsDocumentV2)
}

function normalizeDocumentMedia(doc: FinancialReportsDocumentV2): FinancialReportsDocumentV2 {
  return {
    ...doc,
    reports: doc.reports.map((r) => ({
      ...r,
      balanceSheetImageUrl: normalizeStoredMediaUrl(r.balanceSheetImageUrl),
      operationsStatementImageUrl: normalizeStoredMediaUrl(r.operationsStatementImageUrl),
      donationDisclosurePdfUrl: normalizeStoredMediaUrl(r.donationDisclosurePdfUrl),
    })),
  }
}

export function parseFinancialLocale(raw: unknown): FinancialLocale {
  return raw === 'en' ? 'en' : 'ko'
}

function toPublicDocument(doc: FinancialReportsDocumentV2, locale: FinancialLocale): FinancialReportsPublicDocument {
  const mapSeg = (seg: FinancialReportSegmentV2): FinancialReportSegmentPublic => ({
    id: seg.id,
    label: seg.labels[locale],
    percent: seg.percent,
    color: seg.color,
  })
  return {
    version: 2,
    settings: doc.settings,
    reports: doc.reports.map((r) => ({
      ...r,
      incomeSegments: r.incomeSegments.map(mapSeg),
      expenseSegments: r.expenseSegments.map(mapSeg),
    })),
  }
}

export async function readFinancialReportsDocument(): Promise<FinancialReportsDocumentV2> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    const normalized = normalizeDocument(parsed)
    if (!validateDocumentV2(parsed)) {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
      await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8')
    }
    return normalized
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[financial-reports] read failed, using seed:', e)
  }
  return normalizeDocumentMedia(seedDocument as FinancialReportsDocumentV2)
}

export async function readFinancialReportsForLocale(locale: FinancialLocale): Promise<FinancialReportsPublicDocument> {
  const doc = await readFinancialReportsDocument()
  return toPublicDocument(doc, locale)
}

export async function writeFinancialReportsDocument(body: unknown): Promise<void> {
  if (!validateDocumentV2(body)) {
    const err = new Error('Invalid financial reports payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(normalizeDocumentMedia(body), null, 2), 'utf8')
}
