import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'
import { deleteRemovedStoredMedia } from '../utils/storedMedia'
import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'hero-banner'

export type HeroBannerLocaleCopy = {
  alt: string
  lines: string[]
  smallLine?: string
}

export type HeroBannerButton = { label: string; href: string }

export type HeroBannerSlide = {
  id: string
  order: number
  enabled: boolean
  image: string
  mobileImage: string
  align: 'left' | 'center'
  dim: 'weak' | 'mid' | 'strong'
  buttons: HeroBannerButton[]
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
  mobileImage: string
  align: 'left' | 'center'
  dim: 'weak' | 'mid' | 'strong'
  buttons: HeroBannerButton[]
  alt: string
  lines: string[]
  smallLine: string
}

const KO_SMALL_LINE = '교육으로 사람을 세우는 국제개발협력 NGO, 카야인터내셔널'

function readSmallLine(v: unknown, whenMissing: string): string {
  if (typeof v !== 'string') return whenMissing
  return v.trim().slice(0, 200)
}

export type HeroLocale = 'ko' | 'en'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateLocaleCopy(v: unknown): v is HeroBannerLocaleCopy {
  if (!isPlainObject(v)) return false
  if (typeof v.alt !== 'string') return false
  if (!Array.isArray(v.lines) || !v.lines.every((line) => typeof line === 'string')) return false
  if (v.smallLine != null && typeof v.smallLine !== 'string') return false
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
        mobileImage: normalizeImage(typeof slide.mobileImage === 'string' ? slide.mobileImage : ''),
        align: (slide.align === 'center' ? 'center' : 'left') as 'left' | 'center',
        dim: (slide.dim === 'weak' ? 'weak' : slide.dim === 'strong' ? 'strong' : 'mid') as 'weak' | 'mid' | 'strong',
        buttons: (Array.isArray(slide.buttons) ? slide.buttons : []).slice(0, 2).map((row) => ({
          label: typeof row?.label === 'string' ? row.label.trim().slice(0, 40) : '',
          href: typeof row?.href === 'string' ? row.href.trim().slice(0, 400) : '',
        })),
        locales: {
          ko: {
            alt: slide.locales.ko.alt.trim().slice(0, 200),
            lines: slide.locales.ko.lines.map((l) => l.trimEnd()).slice(0, 8),
            smallLine: readSmallLine(slide.locales.ko.smallLine, KO_SMALL_LINE),
          },
          en: {
            alt: slide.locales.en.alt.trim().slice(0, 200),
            lines: slide.locales.en.lines.map((l) => l.trimEnd()).slice(0, 8),
            smallLine: readSmallLine(slide.locales.en.smallLine, ''),
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
  const parsed = await readJsonDocument(DOCUMENT_KEY)
  if (!validateDocument(parsed)) throw new Error('Invalid hero banner document')
  return normalizeDocument(parsed)
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
      mobileImage: s.mobileImage,
      align: s.align,
      dim: s.dim,
      buttons: s.buttons.filter((button) => button.label && button.href),
      alt: s.locales[locale].alt,
      lines: s.locales[locale].lines.map((line) => line.trimEnd()).filter((line) => line.length > 0),
      smallLine: s.locales[locale].smallLine ?? (locale === 'ko' ? KO_SMALL_LINE : ''),
    }))
}

export async function writeHeroBannerDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid hero banner payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizeDocument(body)
  const previous = await readHeroBannerDocument()
  await writeJsonDocument(DOCUMENT_KEY, cleaned)
  await deleteRemovedStoredMedia(previous, cleaned)
}
