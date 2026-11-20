import type { ProjectPageCard, ProjectPageFlow, ProjectPageHeader, ProjectPageKey } from '../../projects/projectSetTypes'

type PublicFill = {
  heroLabel: string
  title: string
  photo: string
  introKicker: string
  introKickerKo: string
  introTitle: string
  emphasis: string
  lead: string
  cards: ProjectPageCard[]
  flow: ProjectPageFlow[]
}

const OVERSEAS_LEAD = '카야는 미얀마(2018년~)와 키르기스스탄(2022년~)에 지부를 두고 현지 직원과 함께 사업을 운영합니다.\nKOICA, 사랑의열매, 삼성꿈장학재단, 경기도 등과 협력해 교육 중심의 개발협력 사업을 이어가고 있습니다.'
const VOLUNTEER_LEAD = '2024년부터 청년 해외봉사단을 운영하고 있습니다.\n모집·교육·파견·성과관리까지 전 과정을 직접 맡아, 3년간 6개국에 청년 460명을 파견했습니다.'
const RESEARCH_LEAD = '카야는 현장에서 쓰는 교육모델과 사업 방법을 직접 연구하고 개발합니다.\n개발한 커리큘럼과 교재는 국내외 사업에 적용하고, 그 결과를 다시 개선에 반영합니다.'

const FILL: Record<ProjectPageKey, PublicFill> = {
  domestic: {
    heroLabel: 'DOMESTIC PROGRAMS',
    title: '국내 진행사업',
    photo: '/images/banners/business-domestic.jpg',
    introKicker: 'DOMESTIC',
    introKickerKo: '국내사업',
    introTitle: '배움과 실천으로 여는 청소년·청년의 내일',
    emphasis: '청소년·청년의 내일',
    lead: '카야의 국내사업은 청소년·청년의 진로와 미래역량 교육입니다.\n국내 청년 대상 Life Design 교육과 개발도상국 청소년 초청 캠프를 운영합니다.',
    cards: [
      { value: '2016', unit: '년', note: '카야 설립, 국내 교육사업 시작', source: '' },
      { value: '93.6', unit: '%', note: 'Life Design 워크숍 참여자의 진로 탐색 의지 향상', source: '국내 청년 워크숍 사후 설문' },
      { value: '460', unit: '명', note: '청년 해외봉사단 선발·교육·파견', source: '2024~2026, 6개국' },
    ],
    flow: [],
  },
  overseas: {
    heroLabel: 'OVERSEAS PROGRAMS',
    title: '해외 진행사업',
    photo: '/images/banners/business-overseas.jpg',
    introKicker: 'OVERSEAS',
    introKickerKo: '해외사업',
    introTitle: '현지와 함께 세우는 교육의 내일',
    emphasis: '교육의 내일',
    lead: OVERSEAS_LEAD,
    cards: [
      { value: '2', unit: '개', note: '해외 지부', source: '미얀마 · 키르기스스탄' },
      { value: '2017', unit: '년~', note: '해외 개발협력사업', source: 'KOICA·KCOC 민관협력 사업으로 시작' },
      { value: '5', unit: '개', note: '2026년 진행 중인 해외사업', source: '교육 4 · 지진 후속 지원 1' },
      { value: '7,937', unit: '명', note: '2025 미얀마 지진 긴급구호 지원 주민', source: '18개 마을' },
    ],
    flow: [],
  },
  education: {
    heroLabel: 'OVERSEAS · EDUCATION',
    title: '해외 교육 진행사업',
    photo: '/images/banners/business-overseas.jpg',
    introKicker: 'OVERSEAS EDUCATION · 해외 교육사업',
    introKickerKo: '',
    introTitle: '현장에서 운영 중인 해외 교육사업',
    emphasis: '해외 교육사업',
    lead: '기초를 다지고 미래를 여는 교육을 현지와 함께 만듭니다.',
    cards: [],
    flow: [],
  },
  volunteer: {
    heroLabel: 'OVERSEAS · VOLUNTEERS',
    title: '해외봉사단 진행사업',
    photo: '/images/banners/business-overseas.jpg',
    introKicker: 'VOLUNTEERS',
    introKickerKo: '해외봉사단',
    introTitle: '현지 과제에서 출발하는 해외봉사',
    emphasis: '해외봉사',
    lead: VOLUNTEER_LEAD,
    cards: [
      { value: '460', unit: '명', note: '청년 파견 (만 19~39세)', source: '2024~2026' },
      { value: '6', unit: '개국', note: '라오스 · 몽골 · 우즈베키스탄', source: '캄보디아 · 키르기스스탄 · 필리핀' },
      { value: '3', unit: '주', note: '1회 파견 기간', source: '하계·동계 연 2회' },
    ],
    flow: [],
  },
  research: {
    heroLabel: 'RESEARCH',
    title: '연구사업 진행사업',
    photo: '/images/banners/business-advocacy.jpg',
    introKicker: 'RESEARCH',
    introKickerKo: '연구사업',
    introTitle: '현장 경험을 배움의 모델로',
    emphasis: '배움의 모델로',
    lead: RESEARCH_LEAD,
    cards: [],
    flow: [
      { name: '현장', body: '사업 현장에서 문제와 질문 발견' },
      { name: '연구', body: '참여자·전문가와 원인과 해법 탐구' },
      { name: '모델화', body: '커리큘럼·워크북·교재로 정리' },
      { name: '적용·공유', body: '국내외 사업에 적용하고 강의로 확산' },
    ],
  },
}

function text(stored: string | undefined, fallback: string) {
  const value = stored?.trim() ? stored : ''
  return value || fallback
}

export function fillPublicPage(header: ProjectPageHeader, pageKey: ProjectPageKey): ProjectPageHeader {
  const fill = FILL[pageKey]
  return {
    ...header,
    heroLabel: text(header.heroLabel, fill.heroLabel),
    title: text(header.title, fill.title),
    photo: text(header.photo, fill.photo),
    introKicker: text(header.introKicker, fill.introKicker),
    introKickerKo: text(header.introKickerKo, fill.introKickerKo),
    introTitle: text(header.introTitle, fill.introTitle),
    emphasis: text(header.emphasis, fill.emphasis),
    lead: text(header.lead, fill.lead),
    cards: header.cards?.length ? header.cards : fill.cards,
    flow: header.flow?.length ? header.flow : fill.flow,
  }
}
