import type { ProjectField, ProjectPageKey, ProjectSet, ProjectSetRecord, ProjectSetsDocument } from './projectSetTypes'

export type ProjectListKind = 'domestic' | 'overseas' | 'overseas-education' | 'volunteer' | 'research'
import { PROJECT_FIELDS } from './projectSetTypes'

const PAGE_KEY: Record<ProjectListKind, ProjectPageKey> = {
  domestic: 'domestic',
  overseas: 'overseas',
  'overseas-education': 'education',
  volunteer: 'volunteer',
  research: 'research',
}

const EYEBROW: Record<ProjectListKind, string> = {
  domestic: 'PROGRAMS · 국내 진행사업',
  overseas: 'PROGRAMS · 해외 진행사업',
  'overseas-education': 'PROGRAMS · 해외 교육 진행사업',
  volunteer: 'PROGRAMS · 해외봉사단 진행사업',
  research: 'PROGRAMS · 연구사업 진행사업',
}

export function projectPageKey(kind: ProjectListKind): ProjectPageKey {
  return PAGE_KEY[kind]
}

export function matchesProjectPage(item: ProjectSetRecord, kind: ProjectListKind): boolean {
  if (!item.enabled) return false
  if (kind === 'domestic') return item.category === '국내'
  if (kind === 'research') return item.category === '연구'
  if (item.category !== '해외') return false
  if (kind === 'overseas') return true
  if (kind === 'overseas-education') return item.field === '교육'
  return item.field === '해외봉사단'
}

function toPublic(item: ProjectSetRecord): ProjectSet {
  return {
    id: item.id,
    year: item.year,
    field: item.field,
    eyebrow: item.eyebrow,
    title: item.title,
    period: item.period,
    audience: item.audience,
    partner: item.partner,
    paragraphs: item.paragraphs,
    slides: item.slides,
    showArrows: item.showArrows,
    emphasizeLast: item.emphasizeLast,
    steps: item.stepsOn ? item.steps : [],
    facts: item.factsOn ? item.facts : [],
    note: item.factsOn ? item.note : '',
    photos: item.photosOn ? item.photos : [],
  }
}

export function publicSetsFor(doc: ProjectSetsDocument, kind: ProjectListKind): {
  items: ProjectSet[]
  eyebrow: string
  recentFromYear: number
  fields?: readonly ProjectField[]
  title: string
  photo: string
  cards: Array<{ value: string; unit: string; note: string; source: string }>
  flow: Array<{ name: string; body: string }>
} {
  const page = doc.pages[PAGE_KEY[kind]]
  const items = doc.items
    .filter((item) => matchesProjectPage(item, kind))
    .sort((a, b) => {
      if (a.year == null && b.year == null) return a.order - b.order
      if (a.year == null) return 1
      if (b.year == null) return -1
      if (a.year !== b.year) return b.year - a.year
      return a.order - b.order
    })
    .map(toPublic)
  return {
    items,
    eyebrow: page?.eyebrow?.trim() || EYEBROW[kind],
    recentFromYear: kind === 'domestic' || kind === 'research' ? 2020 : 2024,
    fields: kind === 'overseas' ? PROJECT_FIELDS : undefined,
    title: page?.title?.trim() || '',
    photo: page?.photo?.trim() || '',
    cards: (page?.cards ?? []).filter((card) => card.value.trim()),
    flow: (page?.flow ?? []).filter((step) => step.name.trim()),
  }
}
