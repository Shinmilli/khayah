import { deleteRemovedStoredMedia } from '../utils/storedMedia'
import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'popup'
const MAX_ITEMS = 20

export type PopupButtonLabels = { ko: string; en: string }

export type PopupItem = {
  id: string
  enabled: boolean
  imageUrl: string
  linkUrl: string
  buttonEnabled: boolean
  buttonLabels: PopupButtonLabels
  buttonUrl: string
}

export type PopupDocument = {
  version: 1
  items: PopupItem[]
}

const DEFAULT_BUTTON_LABELS: PopupButtonLabels = { ko: '자세히 보기', en: 'Learn more' }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function clip(v: string, max: number): string {
  return v.length > max ? v.slice(0, max) : v
}

function asExternalUrl(v: unknown): string {
  const s = clip(asString(v), 2000)
  if (!s) return ''
  try {
    const u = new URL(s)
    if (u.protocol === 'http:' || u.protocol === 'https:') return s
  } catch {
    /* invalid */
  }
  return ''
}

function asImageUrl(v: unknown): string {
  const s = clip(asString(v), 2000)
  if (!s) return ''
  if (s.startsWith('/') && !s.startsWith('//')) return s
  return asExternalUrl(s)
}

function newId(): string {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

function asButtonLabels(v: unknown): PopupButtonLabels {
  if (!isPlainObject(v)) return { ...DEFAULT_BUTTON_LABELS }
  const ko = clip(asString(v.ko), 80) || DEFAULT_BUTTON_LABELS.ko
  const en = clip(asString(v.en), 80) || DEFAULT_BUTTON_LABELS.en
  return { ko, en }
}

function parseItem(raw: unknown, usedIds: Set<string>): PopupItem | null {
  if (!isPlainObject(raw)) return null
  let id = clip(asString(raw.id), 80)
  if (!id || usedIds.has(id)) id = newId()
  usedIds.add(id)
  return {
    id,
    enabled: raw.enabled === true,
    imageUrl: asImageUrl(raw.imageUrl),
    linkUrl: asExternalUrl(raw.linkUrl),
    buttonEnabled: raw.buttonEnabled === true,
    buttonLabels: asButtonLabels(raw.buttonLabels),
    buttonUrl: asExternalUrl(raw.buttonUrl),
  }
}

export function parsePopupDocument(body: unknown): PopupDocument | null {
  if (!isPlainObject(body) || !Array.isArray(body.items)) return null
  const usedIds = new Set<string>()
  const items: PopupItem[] = []
  for (const raw of body.items.slice(0, MAX_ITEMS)) {
    const item = parseItem(raw, usedIds)
    if (item) items.push(item)
  }
  return { version: 1, items }
}

function isMissingDocument(e: unknown): boolean {
  return (e as { status?: number })?.status === 404
}

export async function readPopupDocument(): Promise<PopupDocument | null> {
  try {
    const parsed = await readJsonDocument(DOCUMENT_KEY)
    const doc = parsePopupDocument(parsed)
    if (!doc) throw new Error('Invalid popup document')
    return doc
  } catch (e) {
    if (isMissingDocument(e)) return null
    throw e
  }
}

export function emptyPopupDocument(): PopupDocument {
  return { version: 1, items: [] }
}

export async function writePopupDocument(body: unknown): Promise<PopupDocument> {
  const normalized = parsePopupDocument(body)
  if (!normalized) {
    const err = new Error('Invalid popup payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  let previous: unknown = null
  try {
    previous = await readJsonDocument(DOCUMENT_KEY)
  } catch (e) {
    if (!isMissingDocument(e)) throw e
  }
  await writeJsonDocument(DOCUMENT_KEY, normalized)
  await deleteRemovedStoredMedia(previous, normalized)
  return normalized
}
