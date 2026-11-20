import { readDrafted, writeDrafted, type SaveMode } from './documentDraft'
import { readJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'impact-page'

export type ImpactSection = { id: string; order: number; enabled: boolean }
export type ImpactNumber = {
  label: string
  value: string
  unit: string
  note: string
  source?: 'manual' | 'impact'
  impactKey?: string
  enabled?: boolean
}
export type ImpactOffice = { name: string; kicker: string; status: string; body: string; photo: string; photoAlt: string; people: string; partners: string; programs: string }

export type ImpactPageDocument = {
  version: 1
  public: boolean
  title: string
  kicker: string
  headline: string
  message: string
  sections: ImpactSection[]
  homeTitle: string
  homeLead: string
  homeNote: string
  homePublic?: boolean
  homeNumbers: ImpactNumber[]
  overviewNote: string
  overview: ImpactNumber[]
  offices: ImpactOffice[]
  supportScope: 'all' | 'country'
  featuredLabel: string
  projects: Array<{ id: string; name: string; base: string; field: string; period: string; status: '진행' | '종료' }>
  years: Array<{ year: string; rows: Array<{ name: string; real: string; total: string; child: string; youth: string; teacher: string }> }>
  evals: Array<{ id: string; program: string; axis: string; mode: string; value: string; itemName: string; meta: string }>
  stories: Array<{ id: string; category: '변화의 이야기' | '전문가 이야기'; title: string; project: string; featured: boolean; consent: boolean; body: string; before: string; intervention: string; after: string; evidence: string; sustainability: string; expertName: string; expertOrg: string; expertField: string; expertLine: string; expertPhoto: string }>
}

const SECTION_IDS = ['stories', 'education', 'experts', 'overview', 'offices', 'programs'] as const

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown, fallback: string, max = 2000): string {
  const raw = typeof value === 'string' ? value : fallback
  return raw.slice(0, max)
}

function flag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

export function defaultImpactPageDocument(): ImpactPageDocument {
  return {
    version: 1,
    public: false,
    title: '한눈에 보는 카야',
    kicker: 'OUR IMPACT',
    headline: '사람의 성장, 변화의 기록',
    message:
      '카야는 사람의 가능성에 주목합니다. 배움의 기회를 넓히고 스스로 성장할 수 있는 힘을 키우며, 그 변화가 지역사회로 이어지도록 함께합니다.',
    sections: [
      { id: 'stories', order: 1, enabled: true },
      { id: 'education', order: 2, enabled: false },
      { id: 'experts', order: 3, enabled: true },
      { id: 'overview', order: 4, enabled: true },
      { id: 'offices', order: 5, enabled: true },
      { id: 'programs', order: 6, enabled: true },
    ],
    homeTitle: '카야가 함께 걸어온 길',
    homeLead: '한 사람의 성장을 믿으며 10년 동안 이어온 걸음을 전합니다.',
    homeNote: '2026년 ○월 기준 · 설립 이후 누적',
    homePublic: false,
    homeNumbers: [
      { label: '함께 걸어온 시간', value: '10', unit: '년', note: '2016년 5월 설립' },
      { label: '함께한 사람들', value: '[0,000]', unit: '명', note: '국내외 사업에 직접 참여한 사람들' },
      { label: '함께한 나라', value: '[0]', unit: '개국', note: '한국 본부 · 미얀마 · 키르기스스탄 지부' },
      { label: '함께한 협력기관', value: '[00]', unit: '곳', note: '정부 · 학교 · 현지 NGO · 기업' },
    ],
    overviewNote: '2016년 설립 이후 지금까지 카야와 함께한 사람과 기관입니다.',
    overview: [
      { label: '참여 아동·청소년·청년', value: '—', unit: '명', note: '해외 교육사업과 국내 청년사업 참여자' },
      { label: '참여 교사', value: '—', unit: '명', note: '교사 연수에 참여한 현지 교사' },
      { label: '해외봉사단 파견', value: '—', unit: '명', note: '청년 해외봉사단 파견 단원' },
      { label: '긴급구호 지원', value: '—', unit: '가구', note: '미얀마 대지진 긴급구호 지원 가구' },
      { label: '협력기관', value: '—', unit: '곳', note: '함께한 학교·정부·현지 NGO·기업 (중복 제외)' },
    ],
    offices: [
      {
        name: '한국 본부',
        kicker: 'HQ · KOREA',
        status: '운영 중',
        body: '국내 청년사업 운영과 해외사업 기획·관리, 해외봉사단 선발과 교육을 맡습니다.',
        photo: '/images/business/volunteer-group.jpg',
        photoAlt: '한국 본부 현장 사진',
        people: '—',
        partners: '—',
        programs: '청년 해외봉사단, 청년 해외연수 사전교육',
      },
      {
        name: '미얀마 지부',
        kicker: 'BRANCH · MYANMAR',
        status: '운영 중',
        body: '현지 교육사업과 대지진 피해 지역의 긴급구호·회복 지원을 이어갑니다.',
        photo: '/images/business/overseas-intro.jpg',
        photoAlt: '미얀마 지부 현장 사진',
        people: '—',
        partners: '—',
        programs: '교육사업, 대지진 긴급구호',
      },
      {
        name: '키르기스스탄 지부',
        kicker: 'BRANCH · KYRGYZSTAN',
        status: '운영 중',
        body: '현지 교육사업과 해외봉사단의 현장 활동을 지원합니다.',
        photo: '/images/business/overseas-edu-quality-1.jpg',
        photoAlt: '키르기스스탄 지부 현장 사진',
        people: '—',
        partners: '—',
        programs: '교육사업, 해외봉사단 현지 활동',
      },
    ],
    supportScope: 'all',
    featuredLabel: '',
    projects: [],
    years: [],
    evals: [],
    stories: [],
  }
}

function numbers(value: unknown, fallback: ImpactNumber[]): ImpactNumber[] {
  const source = Array.isArray(value) ? value : []
  return fallback.map((item, index) => {
    const row = isPlainObject(source[index]) ? source[index] : {}
    return {
      label: text(row.label, item.label, 80),
      value: text(row.value, item.value, 40),
      unit: text(row.unit, item.unit, 20),
      note: text(row.note, item.note, 200),
      source: row.source === 'impact' ? 'impact' : 'manual',
      impactKey: text(row.impactKey, item.impactKey ?? '', 80),
      enabled: flag(row.enabled, item.enabled !== false),
    }
  })
}

function offices(value: unknown, fallback: ImpactOffice[]): ImpactOffice[] {
  const source = Array.isArray(value) ? value : []
  return fallback.map((item, index) => {
    const row = isPlainObject(source[index]) ? source[index] : {}
    return {
      name: text(row.name, item.name, 40),
      kicker: text(row.kicker, item.kicker, 40),
      status: text(row.status, item.status, 20),
      body: text(row.body, item.body, 400),
      photo: text(row.photo, item.photo, 400),
      photoAlt: text(row.photoAlt, item.photoAlt, 80),
      people: text(row.people, item.people, 40),
      partners: text(row.partners, item.partners, 40),
      programs: text(row.programs, item.programs, 200),
    }
  })
}

export function normalizeImpactPage(body: unknown): ImpactPageDocument {
  const base = defaultImpactPageDocument()
  if (!isPlainObject(body)) return base
  const rows = Array.isArray(body.sections) ? body.sections : []
  const sections = SECTION_IDS.map((id, index) => {
    const found = rows.find((row) => isPlainObject(row) && row.id === id)
    const item = isPlainObject(found) ? found : base.sections[index]
    return {
      id,
      order: Number.isFinite(Number(item.order)) ? Math.round(Number(item.order)) : index + 1,
      enabled: flag(item.enabled, base.sections[index].enabled),
    }
  })
  return {
    version: 1,
    public: body.public === true,
    title: text(body.title, base.title, 80),
    kicker: text(body.kicker, base.kicker, 40),
    headline: text(body.headline, base.headline, 80),
    message: text(body.message, base.message, 500),
    sections,
    homeTitle: text(body.homeTitle, base.homeTitle, 80),
    homeLead: text(body.homeLead, base.homeLead, 200),
    homeNote: text(body.homeNote, base.homeNote, 80),
    homePublic: typeof body.homePublic === 'boolean' ? body.homePublic : body.public === true,
    homeNumbers: numbers(body.homeNumbers, base.homeNumbers),
    overviewNote: text(body.overviewNote, base.overviewNote, 200),
    overview: numbers(body.overview, base.overview),
    offices: offices(body.offices, base.offices),
    supportScope: body.supportScope === 'country' ? 'country' : 'all',
    featuredLabel: text(body.featuredLabel, '', 120),
    projects: listOf(body.projects, 40).map((row, index) => ({
      id: text(row.id, `p-${index + 1}`, 40) || `p-${index + 1}`,
      name: text(row.name, '', 80),
      base: text(row.base, '', 40),
      field: text(row.field, '', 40),
      period: text(row.period, '', 40),
      status: row.status === '종료' ? '종료' : '진행',
    })),
    years: listOf(body.years, 12).map((row) => ({
      year: text(row.year, '', 8),
      rows: listOf(row.rows, 40).map((item) => ({
        name: text(item.name, '', 80),
        real: text(item.real, '', 20),
        total: text(item.total, '', 20),
        child: text(item.child, '', 20),
        youth: text(item.youth, '', 20),
        teacher: text(item.teacher, '', 20),
      })),
    })),
    evals: listOf(body.evals, 40).map((row, index) => ({
      id: text(row.id, `e-${index + 1}`, 40) || `e-${index + 1}`,
      program: text(row.program, '', 80),
      axis: text(row.axis, '배우는 힘', 40),
      mode: text(row.mode, '사전 · 사후', 40),
      value: text(row.value, '', 80),
      itemName: text(row.itemName, '', 80),
      meta: text(row.meta, '', 200),
    })),
    stories: listOf(body.stories, 40).map((row, index) => ({
      id: text(row.id, `s-${index + 1}`, 40) || `s-${index + 1}`,
      category: row.category === '전문가 이야기' ? '전문가 이야기' : '변화의 이야기',
      title: text(row.title, '', 120),
      project: text(row.project, '', 80),
      featured: flag(row.featured, false),
      consent: flag(row.consent, false),
      body: text(row.body, '', 4000),
      before: text(row.before, '', 500),
      intervention: text(row.intervention, '', 500),
      after: text(row.after, '', 500),
      evidence: text(row.evidence, '', 500),
      sustainability: text(row.sustainability, '', 500),
      expertName: text(row.expertName, '', 80),
      expertOrg: text(row.expertOrg, '', 80),
      expertField: text(row.expertField, '', 80),
      expertLine: text(row.expertLine, '', 200),
      expertPhoto: text(row.expertPhoto, '', 400),
    })),
  }
}

function listOf(value: unknown, max: number): Record<string, unknown>[] {
  return (Array.isArray(value) ? value : []).filter(isPlainObject).slice(0, max)
}

export async function readImpactPageDocument(): Promise<ImpactPageDocument> {
  try {
    return normalizeImpactPage(await readJsonDocument(DOCUMENT_KEY))
  } catch (e) {
    const status = (e as Error & { status?: number }).status
    if (status === 404) return defaultImpactPageDocument()
    throw e
  }
}

export function readImpactPageState(preferDraft: boolean) {
  return readDrafted(DOCUMENT_KEY, readImpactPageDocument, preferDraft)
}

export async function writeImpactPageDocument(body: unknown, mode: SaveMode = 'publish'): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid impact page payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeDrafted(DOCUMENT_KEY, normalizeImpactPage(body), mode)
}
