export type ProjectSetSlide = {
  src: string
  alt: string
}

export type ProjectSetStep = {
  kicker: string
  title: string
  detail: string
  emphasis?: boolean
}

export type ProjectSetFact = {
  value: string
  unit: string
  label: string
}

export type ProjectSetPhoto = {
  src: string
  alt: string
}

export const PROJECT_FIELDS = ['교육', '해외봉사단', '긴급구호'] as const
export type ProjectField = (typeof PROJECT_FIELDS)[number]

/** 국내·해외·연구 진행사업이 같이 쓰는 사업 1건. 빈 문자열·빈 배열은 그리지 않는다. */
export type ProjectSet = {
  id: string
  /** null이면 연도를 모르는 사업. 버튼은 '연도 미정', 묶음 제목은 '[연도 확인 필요]'. */
  year: number | null
  field?: ProjectField | ''
  eyebrow: string
  title: string
  period: string
  audience: string
  partner: string
  paragraphs: string[]
  slides: ProjectSetSlide[]
  showArrows: boolean
  /** 마지막 진행 박스만 강조. 없으면 스텝에 저장된 강조를 따른다. */
  emphasizeLast?: boolean
  steps: ProjectSetStep[]
  facts: ProjectSetFact[]
  note: string
  photos: ProjectSetPhoto[]
}

export const PROJECT_CATEGORIES = ['국내', '해외', '연구'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export const PROJECT_PAGE_KEYS = ['domestic', 'overseas', 'education', 'volunteer', 'research'] as const
export type ProjectPageKey = (typeof PROJECT_PAGE_KEYS)[number]

export type ProjectPageCard = { value: string; unit: string; note: string; source: string }
export type ProjectPageFlow = { name: string; body: string }

export type ProjectPageHeader = {
  title: string
  eyebrow: string
  photo: string
  photoAlt: string
  cards: ProjectPageCard[]
  flow: ProjectPageFlow[]
}

/** 관리자에 저장하는 사업 1건. 공개 화면은 빈 진행 박스·수치를 그리지 않는다. */
export type ProjectSetRecord = ProjectSet & {
  category: ProjectCategory
  enabled: boolean
  order: number
  emphasizeLast: boolean
  stepsOn: boolean
  factsOn: boolean
  photosOn: boolean
}

export type ProjectSetsDocument = {
  version: 1
  pages: Record<ProjectPageKey, ProjectPageHeader>
  items: ProjectSetRecord[]
}
