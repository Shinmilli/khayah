import defaults from '../data/projectSets.default.json'
import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'project-sets'
const CATEGORIES = ['국내', '해외', '연구'] as const
const FIELDS = ['', '교육', '해외봉사단', '긴급구호'] as const
const PAGE_KEYS = ['domestic', 'overseas', 'education', 'volunteer', 'research'] as const

type Category = (typeof CATEGORIES)[number]
type PageKey = (typeof PAGE_KEYS)[number]

export type ProjectPageHeader = {
  title: string
  eyebrow: string
  photo: string
  photoAlt: string
  cards: Array<{ value: string; unit: string; note: string; source: string }>
  flow: Array<{ name: string; body: string }>
}

export type ProjectSetRecord = {
  id: string
  category: Category
  field: '' | '교육' | '해외봉사단' | '긴급구호'
  year: number | null
  enabled: boolean
  order: number
  eyebrow: string
  title: string
  period: string
  audience: string
  partner: string
  paragraphs: string[]
  slides: Array<{ src: string; alt: string }>
  showArrows: boolean
  emphasizeLast: boolean
  stepsOn: boolean
  steps: Array<{ kicker: string; title: string; detail: string; emphasis?: boolean }>
  factsOn: boolean
  facts: Array<{ value: string; unit: string; label: string }>
  note: string
  photosOn: boolean
  photos: Array<{ src: string; alt: string }>
}

export type ProjectSetsDocument = {
  version: 1
  pages: Record<PageKey, ProjectPageHeader>
  items: ProjectSetRecord[]
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown, fallback = '', max = 2000): string {
  const raw = typeof value === 'string' ? value : fallback
  return raw.replace(/\r\n/g, '\n').slice(0, max)
}

function flag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function lines(value: unknown, max: number, lineMax = 20000): string[] {
  const source = Array.isArray(value) ? value : []
  return source
    .filter((line): line is string => typeof line === 'string')
    .map((line) => line.slice(0, lineMax))
    .slice(0, max)
}

function media(value: unknown, max: number): Array<{ src: string; alt: string }> {
  const source = Array.isArray(value) ? value : []
  return source.filter(isPlainObject).slice(0, max).map((row) => ({
    src: text(row.src, '', 2000),
    alt: text(row.alt, '', 400),
  }))
}

function defaultDocument(): ProjectSetsDocument {
  return defaults as ProjectSetsDocument
}

function pageHeader(value: unknown, fallback: ProjectPageHeader): ProjectPageHeader {
  const row = isPlainObject(value) ? value : {}
  const cards = (Array.isArray(row.cards) ? row.cards : fallback.cards ?? [])
    .filter(isPlainObject)
    .slice(0, 4)
    .map((card) => ({
      value: text(card.value, '', 40),
      unit: text(card.unit, '', 20),
      note: text(card.note, '', 80),
      source: text(card.source, '', 80),
    }))
  const flow = (Array.isArray(row.flow) ? row.flow : fallback.flow ?? [])
    .filter(isPlainObject)
    .slice(0, 8)
    .map((step) => ({
      name: text(step.name, '', 40),
      body: text(step.body, '', 200),
    }))
  return {
    title: text(row.title, fallback.title, 80),
    eyebrow: text(row.eyebrow, fallback.eyebrow, 120),
    photo: text(row.photo, fallback.photo, 400),
    photoAlt: text(row.photoAlt, fallback.photoAlt, 200),
    cards,
    flow,
  }
}

function normalizeItem(value: unknown, index: number): ProjectSetRecord | null {
  if (!isPlainObject(value)) return null
  const base = defaultDocument().items[index]
  const category = CATEGORIES.includes(value.category as Category) ? (value.category as Category) : base?.category
  if (!category) return null
  const field = FIELDS.includes(value.field as (typeof FIELDS)[number]) ? (value.field as ProjectSetRecord['field']) : ''
  const yearRaw = value.year
  const year =
    typeof yearRaw === 'number' && Number.isFinite(yearRaw) ? Math.round(yearRaw) : yearRaw === null ? null : (base?.year ?? null)
  const steps = (Array.isArray(value.steps) ? value.steps : [])
    .filter(isPlainObject)
    .slice(0, 6)
    .map((step) => ({
      kicker: text(step.kicker, '', 40),
      title: text(step.title, '', 80),
      detail: text(step.detail, '', 200),
      emphasis: false,
    }))
  const facts = [0, 1, 2].map((slot) => {
    const row = Array.isArray(value.facts) && isPlainObject(value.facts[slot]) ? value.facts[slot] : {}
    return {
      value: text(row.value, '', 20),
      unit: text(row.unit, '', 20),
      label: text(row.label, '', 200),
    }
  })
  const id = text(value.id, base?.id || `set-${index + 1}`, 80).trim() || `set-${index + 1}`
  return {
    id,
    category,
    field,
    year: year != null && (year < 1990 || year > 2100) ? null : year,
    enabled: flag(value.enabled, true),
    order: Number.isFinite(Number(value.order)) ? Math.round(Number(value.order)) : index,
    eyebrow: text(value.eyebrow, '', 160),
    title: text(value.title, '', 200),
    period: text(value.period, '', 80),
    audience: text(value.audience, '', 120),
    partner: text(value.partner, '', 200),
    paragraphs: lines(value.paragraphs, 400),
    slides: media(value.slides, 40),
    showArrows: flag(value.showArrows, false),
    emphasizeLast: flag(value.emphasizeLast, false),
    stepsOn: flag(value.stepsOn, true),
    steps,
    factsOn: flag(value.factsOn, true),
    facts,
    note: text(value.note, '', 200),
    photosOn: flag(value.photosOn, true),
    photos: [0, 1, 2].map((slot) => {
      const row = Array.isArray(value.photos) && isPlainObject(value.photos[slot]) ? value.photos[slot] : {}
      return { src: text(row.src, '', 400), alt: text(row.alt, '', 400) }
    }),
  }
}

function normalize(body: unknown): ProjectSetsDocument {
  const base = defaultDocument()
  const source = isPlainObject(body) ? body : base
  const pagesIn = isPlainObject(source.pages) ? source.pages : {}
  const pages = {} as ProjectSetsDocument['pages']
  for (const key of PAGE_KEYS) pages[key] = pageHeader(pagesIn[key], base.pages[key])
  const rows = Array.isArray(source.items) ? source.items : base.items
  const items: ProjectSetRecord[] = []
  const seen = new Set<string>()
  rows.forEach((row, index) => {
    const item = normalizeItem(row, index)
    if (!item) return
    let id = item.id
    while (seen.has(id)) id = `${id}-${items.length + 1}`
    seen.add(id)
    items.push({ ...item, id })
  })
  return { version: 1, pages, items }
}

export async function readProjectSetsDocument(): Promise<ProjectSetsDocument> {
  try {
    return normalize(await readJsonDocument(DOCUMENT_KEY))
  } catch (e) {
    const status = (e as Error & { status?: number }).status
    if (status === 404) return normalize(defaultDocument())
    throw e
  }
}

export async function writeProjectSetsDocument(body: unknown): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid project sets payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeJsonDocument(DOCUMENT_KEY, normalize(body))
}
