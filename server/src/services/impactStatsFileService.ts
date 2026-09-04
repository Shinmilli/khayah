import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/impact-stats.default.json'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'impact-stats.json')

export type ImpactStatItem = {
  id: string
  label: string
  value: string
  unit?: string
}

export type ImpactStatsLocaleContent = {
  donut: {
    percent: number
    labelLines: string[]
  }
  stats: ImpactStatItem[]
}

export type ImpactStatsDocumentV2 = {
  version: 2
  locales: {
    ko: ImpactStatsLocaleContent
    en: ImpactStatsLocaleContent
  }
}

type ImpactStatsDocumentV1 = {
  version: 1
  donut: ImpactStatsLocaleContent['donut']
  stats: ImpactStatItem[]
}

export type ImpactStatsDocument = ImpactStatsDocumentV2

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateLocaleContent(body: unknown): body is ImpactStatsLocaleContent {
  if (!isPlainObject(body)) return false
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

function validateDocumentV2(body: unknown): body is ImpactStatsDocumentV2 {
  if (!isPlainObject(body)) return false
  if (body.version !== 2) return false
  if (!isPlainObject(body.locales)) return false
  const locales = body.locales
  return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en)
}

function validateDocumentV1(body: unknown): body is ImpactStatsDocumentV1 {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  return validateLocaleContent(body)
}

function cloneLocaleContent(src: ImpactStatsLocaleContent): ImpactStatsLocaleContent {
  return JSON.parse(JSON.stringify(src)) as ImpactStatsLocaleContent
}

function migrateV1ToV2(v1: ImpactStatsDocumentV1): ImpactStatsDocumentV2 {
  const seed = seedDocument as ImpactStatsDocumentV2
  return {
    version: 2,
    locales: {
      ko: cloneLocaleContent({ donut: v1.donut, stats: v1.stats }),
      en: cloneLocaleContent(seed.locales.en),
    },
  }
}

function normalizeDocument(body: unknown): ImpactStatsDocumentV2 {
  if (validateDocumentV2(body)) return body
  if (validateDocumentV1(body)) return migrateV1ToV2(body)
  return seedDocument as ImpactStatsDocumentV2
}

export type ImpactLocale = 'ko' | 'en'

export function parseImpactLocale(raw: unknown): ImpactLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readImpactStatsDocument(): Promise<ImpactStatsDocumentV2> {
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
    if (code !== 'ENOENT') console.warn('[impact-stats] read failed, using seed:', e)
  }
  return seedDocument as ImpactStatsDocumentV2
}

export async function readImpactStatsForLocale(locale: ImpactLocale): Promise<ImpactStatsLocaleContent> {
  const doc = await readImpactStatsDocument()
  return doc.locales[locale]
}

export async function writeImpactStatsDocument(body: unknown): Promise<void> {
  if (!validateDocumentV2(body)) {
    const err = new Error('Invalid impact stats payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8')
}
