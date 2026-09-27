import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'
import { deleteRemovedStoredMedia } from '../utils/storedMedia'
import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'page-hero-banners'

export const PAGE_HERO_BANNER_KEYS = ['khayah', 'business', 'support', 'news'] as const
export type PageHeroBannerKey = (typeof PAGE_HERO_BANNER_KEYS)[number]

export type PageHeroBannersDocument = {
  version: 1
  images: Record<PageHeroBannerKey, string>
}

const LEGACY_BY_SECTION: Record<PageHeroBannerKey, string[]> = {
  khayah: ['about/khayah', 'about/greeting', 'about/history', 'about/location', 'about/financial-report'],
  business: [
    'business/domestic',
    'business/overseas',
    'business/advocacy',
    'business/projects',
    'business/domestic/education',
    'business/overseas/education',
    'business/overseas/volunteer',
    'business/overseas/health-care',
  ],
  support: ['support/guide', 'support/apply'],
  news: ['news/announcements', 'stories', 'news/activities', 'news/newsletter', 'news/press', 'news/inquiry'],
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function emptyDocument(): PageHeroBannersDocument {
  return {
    version: 1,
    images: { khayah: '', business: '', support: '', news: '' },
  }
}

function normalizeImage(image: string): string {
  const trimmed = image.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/')) return trimmed
  return normalizeStoredMediaUrl(trimmed) ?? trimmed
}

function firstImage(...candidates: unknown[]): string {
  for (const raw of candidates) {
    if (typeof raw === 'string' && raw.trim()) return normalizeImage(raw)
  }
  return ''
}

export function validatePageHeroBannersDocument(body: unknown): body is PageHeroBannersDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  const images = body.images
  if (!isPlainObject(images)) return false
  return PAGE_HERO_BANNER_KEYS.every((key) => typeof images[key] === 'string')
}

export function normalizePageHeroBannersDocument(body: unknown): PageHeroBannersDocument {
  const base = emptyDocument()
  if (!isPlainObject(body)) return base
  const images = body.images
  if (!isPlainObject(images)) return base
  for (const key of PAGE_HERO_BANNER_KEYS) {
    const legacy = LEGACY_BY_SECTION[key].map((pathKey) => images[pathKey])
    base.images[key] = firstImage(images[key], ...legacy)
  }
  return base
}

export async function readPageHeroBannersDocument(): Promise<PageHeroBannersDocument> {
  const parsed = await readJsonDocument(DOCUMENT_KEY)
  if (!validatePageHeroBannersDocument(parsed)) throw new Error('Invalid page hero banners document')
  return normalizePageHeroBannersDocument(parsed)
}

export async function writePageHeroBannersDocument(body: unknown): Promise<void> {
  if (!validatePageHeroBannersDocument(body)) {
    const err = new Error('Invalid page hero banners payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizePageHeroBannersDocument(body)
  const previous = await readPageHeroBannersDocument()
  await writeJsonDocument(DOCUMENT_KEY, cleaned)
  await deleteRemovedStoredMedia(previous, cleaned)
}
