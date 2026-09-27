import { normalizeStoredMediaUrl } from '../utils/normalizeStoredMediaUrl'
import { deleteRemovedStoredMedia } from '../utils/storedMedia'
import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'nav-menu-images'

export const NAV_MENU_IMAGE_KEYS = ['khayah', 'business', 'support', 'news'] as const
export type NavMenuImageKey = (typeof NAV_MENU_IMAGE_KEYS)[number]

export type NavMenuImagesDocument = {
  version: 1
  images: Record<NavMenuImageKey, string>
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function emptyDocument(): NavMenuImagesDocument {
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

export function validateNavMenuImagesDocument(body: unknown): body is NavMenuImagesDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  const images = body.images
  if (!isPlainObject(images)) return false
  return NAV_MENU_IMAGE_KEYS.every((key) => typeof images[key] === 'string')
}

export function normalizeNavMenuImagesDocument(body: unknown): NavMenuImagesDocument {
  const base = emptyDocument()
  if (!isPlainObject(body)) return base
  const images = body.images
  if (!isPlainObject(images)) return base
  for (const key of NAV_MENU_IMAGE_KEYS) {
    const raw = images[key]
    base.images[key] = typeof raw === 'string' ? normalizeImage(raw) : ''
  }
  return base
}

export async function readNavMenuImagesDocument(): Promise<NavMenuImagesDocument> {
  const parsed = await readJsonDocument(DOCUMENT_KEY)
  if (!validateNavMenuImagesDocument(parsed)) throw new Error('Invalid nav menu images document')
  return normalizeNavMenuImagesDocument(parsed)
}

export async function writeNavMenuImagesDocument(body: unknown): Promise<void> {
  if (!validateNavMenuImagesDocument(body)) {
    const err = new Error('Invalid nav menu images payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizeNavMenuImagesDocument(body)
  const previous = await readNavMenuImagesDocument()
  await writeJsonDocument(DOCUMENT_KEY, cleaned)
  await deleteRemovedStoredMedia(previous, cleaned)
}
