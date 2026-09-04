import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/hero-banner.default.json'
import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'hero-banner.json')

export type HeroBannerLocaleCopy = {
  alt: string
  lines: string[]
}

export type HeroBannerSlide = {
  id: string
  order: number
  enabled: boolean
  image: string
  locales: {
    ko: HeroBannerLocaleCopy
    en: HeroBannerLocaleCopy
  }
}

export type HeroBannerDocument = {
  version: 1
  slides: HeroBannerSlide[]
}

export type HeroBannerPublicSlide = {
  id: string
  order: number
  image: string
  alt: string
  lines: string[]
}

export type HeroLocale = 'ko' | 'en'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateLocaleCopy(v: unknown): v is HeroBannerLocaleCopy {
  if (!isPlainObject(v)) return false
  if (typeof v.alt !== 'string') return false
  if (!Array.isArray(v.lines) || !v.lines.every((line) => typeof line === 'string')) return false
  return true
}

function validateSlide(v: unknown): v is HeroBannerSlide {
  if (!isPlainObject(v)) return false
  if (typeof v.id !== 'string' || !v.id.trim()) return false
  if (typeof v.order !== 'number' || !Number.isFinite(v.order)) return false
  if (typeof v.enabled !== 'boolean') return false
  if (typeof v.image !== 'string') return false
  if (!isPlainObject(v.locales)) return false
  return validateLocaleCopy(v.locales.ko) && validateLocaleCopy(v.locales.en)
}

function validateDocument(body: unknown): body is HeroBannerDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!Array.isArray(body.slides)) return false
  return body.slides.every(validateSlide)
}

function normalizeImage(image: string): string {
  const trimmed = image.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('/')) return trimmed
  return normalizeStoredMediaUrl(trimmed) ?? trimmed
}

function normalizeDocument(doc: HeroBannerDocument): HeroBannerDocument {
  return {
    version: 1,
    slides: [...doc.slides]
      .map((slide) => ({
        id: slide.id.trim().slice(0, 80),
        order: slide.order,
        enabled: slide.enabled,
        image: normalizeImage(slide.image),
        locales: {
          ko: {
            alt: slide.locales.ko.alt.trim().slice(0, 200),
            lines: slide.locales.ko.lines.map((l) => l.trimEnd()).slice(0, 8),
          },
          en: {
            alt: slide.locales.en.alt.trim().slice(0, 200),
            lines: slide.locales.en.lines.map((l) => l.trimEnd()).slice(0, 8),
          },
        },
      }))
      .sort((a, b) => a.order - b.order)
      .slice(0, 12),
  }
}

export function parseHeroLocale(raw: unknown): HeroLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readHeroBannerDocument(): Promise<HeroBannerDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (validateDocument(parsed)) return normalizeDocument(parsed)
    console.warn('[hero-banner] invalid file content, using seed')
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[hero-banner] read failed, using seed:', e)
  }
  return normalizeDocument(seedDocument as HeroBannerDocument)
}

export async function readHeroBannerForLocale(locale: HeroLocale): Promise<HeroBannerPublicSlide[]> {
  const doc = await readHeroBannerDocument()
  return doc.slides
    .filter((s) => s.enabled && s.image.trim())
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: s.id,
      order: s.order,
      image: s.image,
      alt: s.locales[locale].alt,
      lines: s.locales[locale].lines.filter((line) => line.trim().length > 0),
    }))
    .filter((s) => s.lines.length > 0)
}

export async function writeHeroBannerDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid hero banner payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizeDocument(body)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8')
}
