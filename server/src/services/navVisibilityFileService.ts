import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'nav-visibility'

export const NAV_VISIBILITY_TOP_KEYS = ['khayah', 'business', 'support', 'news'] as const
export type NavVisibilityTopKey = (typeof NAV_VISIBILITY_TOP_KEYS)[number]

export const NAV_VISIBILITY_LINK_KEYS = [
  'greeting',
  'history',
  'location',
  'financialReport',
  'aboutKhayah',
  'ci',
  'org',
  'domestic',
  'domesticEducation',
  'overseas',
  'overseasEducation',
  'overseasVolunteer',
  'researchEducation',
  'researchSocial',
  'advocacy',
  'projects',
  'supportGuide',
  'announcements',
  'activities',
  'stories',
  'newsletter',
  'press',
  'inquiry',
] as const
export type NavVisibilityLinkKey = (typeof NAV_VISIBILITY_LINK_KEYS)[number]

export type NavVisibilityDocument = {
  version: 1
  top: Record<NavVisibilityTopKey, boolean>
  links: Record<NavVisibilityLinkKey, boolean>
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asBoolean(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function emptyDocument(): NavVisibilityDocument {
  const top = {} as Record<NavVisibilityTopKey, boolean>
  const links = {} as Record<NavVisibilityLinkKey, boolean>
  for (const key of NAV_VISIBILITY_TOP_KEYS) top[key] = true
  for (const key of NAV_VISIBILITY_LINK_KEYS) links[key] = true
  return { version: 1, top, links }
}

export function normalizeNavVisibilityDocument(body: unknown): NavVisibilityDocument {
  const base = emptyDocument()
  if (!isPlainObject(body)) return base
  const top = isPlainObject(body.top) ? body.top : {}
  const links = isPlainObject(body.links) ? body.links : {}
  for (const key of NAV_VISIBILITY_TOP_KEYS) {
    base.top[key] = asBoolean(top[key], true)
  }
  for (const key of NAV_VISIBILITY_LINK_KEYS) {
    base.links[key] = asBoolean(links[key], true)
  }
  return base
}

export function validateNavVisibilityDocument(body: unknown): body is NavVisibilityDocument {
  if (!isPlainObject(body)) return false
  if (body.version !== 1) return false
  if (!isPlainObject(body.top) || !isPlainObject(body.links)) return false
  const top = body.top
  const links = body.links
  const topOk = NAV_VISIBILITY_TOP_KEYS.every((key) => typeof top[key] === 'boolean')
  const linksOk = NAV_VISIBILITY_LINK_KEYS.every((key) => typeof links[key] === 'boolean')
  return topOk && linksOk
}

export async function readNavVisibilityDocument(): Promise<NavVisibilityDocument> {
  const parsed = await readJsonDocument(DOCUMENT_KEY)
  if (!isPlainObject(parsed)) throw new Error('Invalid nav visibility document')
  return normalizeNavVisibilityDocument(parsed)
}

export async function writeNavVisibilityDocument(body: unknown): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid nav visibility payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const cleaned = normalizeNavVisibilityDocument(body)
  await writeJsonDocument(DOCUMENT_KEY, cleaned)
}
