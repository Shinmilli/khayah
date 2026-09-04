import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/history.default.json'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'history.json')

export type HistoryItem = {
  id: string
  month: string
  text: string
}

export type HistoryYear = {
  id: string
  year: string
  items: HistoryItem[]
}

export type HistoryLocaleContent = {
  lead: string
  years: HistoryYear[]
}

export type HistoryDocument = {
  version: 1
  locales: {
    ko: HistoryLocaleContent
    en: HistoryLocaleContent
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateItem(row: unknown): row is HistoryItem {
  if (!isPlainObject(row)) return false
  if (typeof row.id !== 'string' || !row.id.trim()) return false
  if (typeof row.month !== 'string') return false
  if (typeof row.text !== 'string') return false
  return true
}

function validateYear(row: unknown): row is HistoryYear {
  if (!isPlainObject(row)) return false
  if (typeof row.id !== 'string' || !row.id.trim()) return false
  if (typeof row.year !== 'string' || !row.year.trim()) return false
  if (!Array.isArray(row.items)) return false
  return row.items.every(validateItem)
}

function validateLocaleContent(body: unknown): body is HistoryLocaleContent {
  if (!isPlainObject(body)) return false
  if (typeof body.lead !== 'string') return false
  if (!Array.isArray(body.years)) return false
  return body.years.every(validateYear)
}

function validateDocument(body: unknown): body is HistoryDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!isPlainObject(body.locales)) return false
  const locales = body.locales
  return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en)
}

function normalizeDocument(body: unknown): HistoryDocument {
  if (validateDocument(body)) return body
  return seedDocument as HistoryDocument
}

export type HistoryLocale = 'ko' | 'en'

export function parseHistoryLocale(raw: unknown): HistoryLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readHistoryDocument(): Promise<HistoryDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    const normalized = normalizeDocument(parsed)
    if (!validateDocument(parsed)) {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
      await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8')
    }
    return normalized
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[history] read failed, using seed:', e)
  }
  return seedDocument as HistoryDocument
}

export async function readHistoryForLocale(locale: HistoryLocale): Promise<HistoryLocaleContent> {
  const doc = await readHistoryDocument()
  return doc.locales[locale]
}

export async function writeHistoryDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid history payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8')
}
