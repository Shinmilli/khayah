import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'maintenance'
const TITLE_MAX = 80
const MESSAGE_MAX = 600

export type MaintenanceDocument = {
  version: 1
  enabled: boolean
  titleKo: string
  titleEn: string
  messageKo: string
  messageEn: string
}

export const DEFAULT_MAINTENANCE_DOCUMENT: MaintenanceDocument = {
  version: 1,
  enabled: false,
  titleKo: '잠시 점검 중입니다',
  titleEn: "We'll be back soon",
  messageKo:
    '더 안정적인 서비스를 위해 사이트를 점검하고 있습니다.\n조금만 기다려 주시면 곧 다시 찾아뵙겠습니다.',
  messageEn:
    'Khayah is temporarily unavailable while we carry out maintenance.\nPlease visit again in a little while.',
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function clip(v: string, max: number): string {
  return v.length > max ? v.slice(0, max) : v
}

function textOrDefault(v: unknown, max: number, fallback: string): string {
  const s = clip(asString(v), max)
  return s || fallback
}

function isMissingDocument(e: unknown): boolean {
  return (e as { status?: number })?.status === 404
}

export function normalizeMaintenanceDocument(body: unknown): MaintenanceDocument {
  const base = DEFAULT_MAINTENANCE_DOCUMENT
  if (!isPlainObject(body)) return { ...base }
  return {
    version: 1,
    enabled: body.enabled === true,
    titleKo: textOrDefault(body.titleKo, TITLE_MAX, base.titleKo),
    titleEn: textOrDefault(body.titleEn, TITLE_MAX, base.titleEn),
    messageKo: textOrDefault(body.messageKo, MESSAGE_MAX, base.messageKo),
    messageEn: textOrDefault(body.messageEn, MESSAGE_MAX, base.messageEn),
  }
}

export async function readMaintenanceDocument(): Promise<MaintenanceDocument> {
  try {
    const parsed = await readJsonDocument(DOCUMENT_KEY)
    return normalizeMaintenanceDocument(parsed)
  } catch (e) {
    if (isMissingDocument(e)) return { ...DEFAULT_MAINTENANCE_DOCUMENT }
    throw e
  }
}

export async function writeMaintenanceDocument(body: unknown): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1 || typeof body.enabled !== 'boolean') {
    const err = new Error('Invalid maintenance payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeJsonDocument(DOCUMENT_KEY, normalizeMaintenanceDocument(body))
}
