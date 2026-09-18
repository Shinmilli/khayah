import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/business-hub-cards.default.json'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'business-hub-cards.json')

export const BUSINESS_HUBS = ['overseas', 'domestic'] as const
export type BusinessHub = (typeof BUSINESS_HUBS)[number]

export const BUSINESS_HUB_ICONS = ['education', 'volunteer', 'projects', 'people'] as const
export type BusinessHubIcon = (typeof BUSINESS_HUB_ICONS)[number]

export type BusinessHubCardLocaleCopy = {
  title: string
  description: string
  buttonLabel: string
}

export type BusinessHubCard = {
  id: string
  hub: BusinessHub
  order: number
  enabled: boolean
  href: string
  icon: BusinessHubIcon
  locales: {
    ko: BusinessHubCardLocaleCopy
    en: BusinessHubCardLocaleCopy
  }
}

export type BusinessHubCardsDocument = {
  version: 1
  cards: BusinessHubCard[]
}

export type BusinessHubCardPublic = {
  id: string
  hub: BusinessHub
  order: number
  href: string
  icon: BusinessHubIcon
  title: string
  description: string
  buttonLabel: string
}

export type BusinessLocale = 'ko' | 'en'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isHub(v: unknown): v is BusinessHub {
  return v === 'overseas' || v === 'domestic'
}

function isIcon(v: unknown): v is BusinessHubIcon {
  return v === 'education' || v === 'volunteer' || v === 'projects' || v === 'people'
}

function validateLocaleCopy(v: unknown): v is BusinessHubCardLocaleCopy {
  if (!isPlainObject(v)) return false
  if (typeof v.title !== 'string') return false
  if (typeof v.description !== 'string') return false
  if (typeof v.buttonLabel !== 'string') return false
  return true
}

function validateCard(v: unknown): v is BusinessHubCard {
  if (!isPlainObject(v)) return false
  if (typeof v.id !== 'string' || !v.id.trim()) return false
  if (!isHub(v.hub)) return false
  if (typeof v.order !== 'number' || !Number.isFinite(v.order)) return false
  if (typeof v.enabled !== 'boolean') return false
  if (typeof v.href !== 'string') return false
  if (!isIcon(v.icon)) return false
  if (!isPlainObject(v.locales)) return false
  return validateLocaleCopy(v.locales.ko) && validateLocaleCopy(v.locales.en)
}

function validateDocument(body: unknown): body is BusinessHubCardsDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!Array.isArray(body.cards)) return false
  return body.cards.every(validateCard)
}

function normalizeHref(href: string): string {
  const trimmed = href.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('mailto:')) return trimmed.slice(0, 400)
  const withoutLocale = trimmed.replace(/^\/en(?=\/|$)/, '') || '/'
  const withSlash = withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`
  return withSlash.slice(0, 200)
}

function normalizeDocument(doc: BusinessHubCardsDocument): BusinessHubCardsDocument {
  return {
    version: 1,
    cards: [...doc.cards]
      .map((card) => ({
        id: card.id.trim().slice(0, 80),
        hub: card.hub,
        order: card.order,
        enabled: card.enabled,
        href: normalizeHref(card.href),
        icon: card.icon,
        locales: {
          ko: {
            title: card.locales.ko.title.trim().slice(0, 80),
            description: card.locales.ko.description.trim().slice(0, 800),
            buttonLabel: card.locales.ko.buttonLabel.trim().slice(0, 40),
          },
          en: {
            title: card.locales.en.title.trim().slice(0, 80),
            description: card.locales.en.description.trim().slice(0, 800),
            buttonLabel: card.locales.en.buttonLabel.trim().slice(0, 40),
          },
        },
      }))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .slice(0, 24),
  }
}

export function parseBusinessLocale(raw: unknown): BusinessLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export function parseBusinessHub(raw: unknown): BusinessHub | null {
  return isHub(raw) ? raw : null
}

export async function readBusinessHubCardsDocument(): Promise<BusinessHubCardsDocument> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (validateDocument(parsed)) return normalizeDocument(parsed)
    console.warn('[business-hub-cards] invalid file content, using seed')
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[business-hub-cards] read failed, using seed:', e)
  }
  return normalizeDocument(seedDocument as BusinessHubCardsDocument)
}

export async function readBusinessHubCardsForLocale(
  locale: BusinessLocale,
  hub?: BusinessHub | null,
): Promise<BusinessHubCardPublic[]> {
  const doc = await readBusinessHubCardsDocument()
  return doc.cards
    .filter((card) => card.enabled && (!hub || card.hub === hub) && card.locales[locale].title.trim())
    .sort((a, b) => a.order - b.order)
    .map((card) => ({
      id: card.id,
      hub: card.hub,
      order: card.order,
      href: card.href,
      icon: card.icon,
      title: card.locales[locale].title,
      description: card.locales[locale].description,
      buttonLabel: card.locales[locale].buttonLabel,
    }))
}

export async function writeBusinessHubCardsDocument(body: unknown): Promise<void> {
  if (!validateDocument(body)) {
    const err = new Error('Invalid business hub cards payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizeDocument(body)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8')
}
