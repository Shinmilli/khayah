import seedDocument from '../seed/inquiry-faq.default.json'
import { readDrafted, writeDrafted, type SaveMode } from './documentDraft'
import { readJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'inquiry-faq'

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
  /** 끄면 공개 화면에서 FAQ 탭을 숨긴다. 없으면 꺼진 것으로 본다. */
  enabled: boolean
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
  if (body.enabled !== undefined && typeof body.enabled !== 'boolean') return false
  if (!isPlainObject(body.locales)) return false
  const locales = body.locales
  return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en)
}

function withEnabled(body: InquiryFaqDocumentV2): InquiryFaqDocumentV2 {
  return {
    version: 2,
    enabled: body.enabled === true,
    locales: body.locales,
  }
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
    enabled: false,
    locales: {
      ko: { items: cloneItems(v1.items) },
      en: { items: cloneItems(seed.locales.en.items) },
    },
  }
}

export function parseInquiryFaqLocale(raw: unknown): InquiryLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readInquiryFaqDocument(): Promise<InquiryFaqDocumentV2> {
  const parsed = await readJsonDocument(DOCUMENT_KEY)
  if (validateDocumentV2(parsed)) return withEnabled(parsed)
  if (validateDocumentV1(parsed)) return migrateV1ToV2(parsed)
  throw new Error('Invalid FAQ document')
}

export async function readInquiryFaqState(preferDraft: boolean) {
  const state = await readDrafted(DOCUMENT_KEY, readInquiryFaqDocument, preferDraft)
  if (validateDocumentV2(state.doc)) return { doc: withEnabled(state.doc), unpublished: state.unpublished }
  if (validateDocumentV1(state.doc)) return { doc: migrateV1ToV2(state.doc), unpublished: state.unpublished }
  throw new Error('Invalid FAQ document')
}

export async function readInquiryFaqForLocale(
  locale: InquiryLocale,
  preferDraft = false,
): Promise<InquiryFaqLocaleContent & { enabled: boolean }> {
  const { doc } = await readInquiryFaqState(preferDraft)
  return { enabled: doc.enabled, ...doc.locales[locale] }
}

export async function writeInquiryFaqDocument(body: unknown, mode: SaveMode = 'publish'): Promise<void> {
  if (!validateDocumentV2(body)) {
    const err = new Error('Invalid FAQ payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned: InquiryFaqDocumentV2 = {
    version: 2,
    enabled: body.enabled === true,
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
  await writeDrafted(DOCUMENT_KEY, cleaned, mode)
}
