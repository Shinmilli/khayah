import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/inquiry-faq.default.json'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'inquiry-faq.json')

export type InquiryFaqItem = {
  id: string
  question: string
  answer: string
  published: boolean
  order: number
}

export type InquiryFaqLocaleContent = {
  items: InquiryFaqItem[]
}

export type InquiryFaqDocumentV2 = {
  version: 2
  locales: {
    ko: InquiryFaqLocaleContent
    en: InquiryFaqLocaleContent
  }
}

type InquiryFaqDocumentV1 = {
  version: 1
  items: InquiryFaqItem[]
}

export type InquiryFaqDocument = InquiryFaqDocumentV2
export type InquiryLocale = 'ko' | 'en'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateItem(v: unknown): v is InquiryFaqItem {
  if (!isPlainObject(v)) return false
  if (typeof v.id !== 'string' || !v.id.trim()) return false
  if (typeof v.question !== 'string') return false
  if (typeof v.answer !== 'string') return false
  if (typeof v.published !== 'boolean') return false
  if (typeof v.order !== 'number' || !Number.isFinite(v.order)) return false
  return true
}

function validateLocaleContent(v: unknown): v is InquiryFaqLocaleContent {
  if (!isPlainObject(v)) return false
  if (!Array.isArray(v.items)) return false
  return v.items.every(validateItem)
}

function validateDocumentV2(body: unknown): body is InquiryFaqDocumentV2 {
  if (!isPlainObject(body)) return false
  if (body.version !== 2) return false
  if (!isPlainObject(body.locales)) return false
  const locales = body.locales
  return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en)
}

function validateDocumentV1(body: unknown): body is InquiryFaqDocumentV1 {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!Array.isArray(body.items)) return false
  return body.items.every(validateItem)
}

function cloneItems(items: InquiryFaqItem[]): InquiryFaqItem[] {
  return JSON.parse(JSON.stringify(items)) as InquiryFaqItem[]
}

function migrateV1ToV2(v1: InquiryFaqDocumentV1): InquiryFaqDocumentV2 {
  const seed = seedDocument as InquiryFaqDocumentV2
  return {
    version: 2,
    locales: {
      ko: { items: cloneItems(v1.items) },
      en: { items: cloneItems(seed.locales.en.items) },
    },
  }
}

function normalizeDocument(body: unknown): InquiryFaqDocumentV2 {
  if (validateDocumentV2(body)) return body
  if (validateDocumentV1(body)) return migrateV1ToV2(body)
  return seedDocument as InquiryFaqDocumentV2
}

export function parseInquiryFaqLocale(raw: unknown): InquiryLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readInquiryFaqDocument(): Promise<InquiryFaqDocumentV2> {
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
    if (code !== 'ENOENT') console.warn('[inquiry-faq] read failed, using seed:', e)
  }
  return seedDocument as InquiryFaqDocumentV2
}

export async function readInquiryFaqForLocale(locale: InquiryLocale): Promise<InquiryFaqLocaleContent> {
  const doc = await readInquiryFaqDocument()
  return doc.locales[locale]
}

export async function writeInquiryFaqDocument(body: unknown): Promise<void> {
  if (!validateDocumentV2(body)) {
    const err = new Error('Invalid FAQ payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned: InquiryFaqDocumentV2 = {
    version: 2,
    locales: {
      ko: {
        items: body.locales.ko.items.map((item) => ({
          id: item.id.trim().slice(0, 80),
          question: item.question.trim().slice(0, 200),
          answer: item.answer.trim().slice(0, 4000),
          published: item.published,
          order: item.order,
        })),
      },
      en: {
        items: body.locales.en.items.map((item) => ({
          id: item.id.trim().slice(0, 80),
          question: item.question.trim().slice(0, 200),
          answer: item.answer.trim().slice(0, 4000),
          published: item.published,
          order: item.order,
        })),
      },
    },
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8')
}
