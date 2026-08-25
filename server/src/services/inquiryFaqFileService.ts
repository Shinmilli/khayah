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

export type InquiryFaqDocument = {
  version: 1
  items: InquiryFaqItem[]
}

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

function validateDocument(body: unknown): body is InquiryFaqDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!Array.isArray(body.items)) return false
  return body.items.every(validateItem)
}

export async function readInquiryFaqDocument(): Promise<InquiryFaqDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (validateDocument(parsed)) return parsed
    console.warn('[inquiry-faq] invalid file content, using seed')
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[inquiry-faq] read failed, using seed:', e)
  }
  return seedDocument as InquiryFaqDocument
}

export async function writeInquiryFaqDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid FAQ payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned: InquiryFaqDocument = {
    version: 1,
    items: body.items.map((item) => ({
      id: item.id.trim().slice(0, 80),
      question: item.question.trim().slice(0, 200),
      answer: item.answer.trim().slice(0, 4000),
      published: item.published,
      order: item.order,
    })),
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8')
}
