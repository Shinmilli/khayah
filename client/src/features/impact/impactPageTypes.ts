export type ImpactSection = { id: string; order: number; enabled: boolean }
export type ImpactNumber = {
  label: string
  labelEn?: string
  value: string
  unit: string
  note: string
  noteEn?: string
  source?: 'manual' | 'impact'
  impactKey?: string
  enabled?: boolean
}
export type ImpactOffice = {
  name: string
  kicker: string
  status: string
  body: string
  photo: string
  photoAlt: string
  people: string
  partners: string
  programs: string
}

export type ImpactProject = {
  id: string
  name: string
  base: string
  field: string
  period: string
  status: '진행' | '종료'
}

export type ImpactYearRow = { name: string; real: string; total: string; child: string; youth: string; teacher: string }

export type ImpactYear = { year: string; rows: ImpactYearRow[] }

export type ImpactEval = {
  id: string
  program: string
  axis: string
  mode: string
  value: string
  itemName: string
  meta: string
}

export type ImpactStory = {
  id: string
  category: '변화의 이야기' | '전문가 이야기'
  title: string
  project: string
  featured: boolean
  consent: boolean
  body: string
  before: string
  intervention: string
  after: string
  evidence: string
  sustainability: string
  expertName: string
  expertOrg: string
  expertField: string
  expertLine: string
  expertPhoto: string
}

export type ImpactPageDocument = {
  version: 1
  public: boolean
  title: string
  kicker: string
  headline: string
  message: string
  supportScope: 'all' | 'country'
  featuredLabel: string
  sections: ImpactSection[]
  homeTitle: string
  homeTitleEn?: string
  homeLead: string
  homeLeadEn?: string
  homeNote: string
  homeNoteEn?: string
  /** 메인 숫자 섹션만의 표시. 없으면 페이지 공개 여부를 따른다. */
  homePublic?: boolean
  homeNumbers: ImpactNumber[]
  overviewNote: string
  overview: ImpactNumber[]
  offices: ImpactOffice[]
  projects: ImpactProject[]
  years: ImpactYear[]
  evals: ImpactEval[]
  stories: ImpactStory[]
}

export const IMPACT_SECTION_LABEL: Record<string, string> = {
  stories: '01 변화의 이야기',
  education: '02 교육의 변화',
  experts: '03 전문가 평가',
  overview: '04 한눈에 보기',
  offices: '05 본부와 지부',
  programs: '06 사업별로 자세히 보기',
}
