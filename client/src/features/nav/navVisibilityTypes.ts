import type { NavLinkKey, NavTopKey } from '../../i18n/messages/ko'

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
  'domesticProjects',
  'overseasProjects',
  'researchProjects',
  'researchEducation',
  'researchSocial',
  'socialAcademy',
  'socialComfort',
  'advocacy',
  'projects',
  'supportGuide',
  'supportMethod',
  'announcements',
  'activities',
  'stories',
  'newsletter',
  'press',
  'inquiry',
  'impactGlance',
] as const
export type NavVisibilityLinkKey = (typeof NAV_VISIBILITY_LINK_KEYS)[number]

export type NavVisibilityDocument = {
  version: 1
  top: Record<NavVisibilityTopKey, boolean>
  links: Record<NavVisibilityLinkKey, boolean>
}

export type NavMenuLinkDef = {
  key: NavVisibilityLinkKey
  to: string
  children?: NavMenuLinkDef[]
}

export type NavMenuColumn = {
  id: string
  topKey: NavTopKey
  links: NavMenuLinkDef[]
}

export const NAV_MENU_COLUMNS: NavMenuColumn[] = [
  {
    id: 'khaya-col',
    topKey: 'khayah',
    links: [
      { key: 'aboutKhayah', to: '/about/khayah' },
      { key: 'greeting', to: '/about/greeting' },
      { key: 'history', to: '/about/history' },
      { key: 'org', to: '/about/khayah?tab=org' },
      { key: 'financialReport', to: '/about/transparency' },
      { key: 'location', to: '/about/location' },
    ],
  },
  {
    id: 'business-col',
    topKey: 'business',
    links: [
      {
        key: 'domestic',
        to: '/business/domestic',
        children: [
          { key: 'domesticEducation', to: '/business/domestic/education' },
          { key: 'domesticProjects', to: '/business/domestic/projects' },
        ],
      },
      {
        key: 'overseas',
        to: '/business/overseas',
        children: [
          { key: 'overseasEducation', to: '/business/overseas/education' },
          { key: 'overseasVolunteer', to: '/business/overseas/volunteer' },
          { key: 'overseasProjects', to: '/business/overseas/projects' },
        ],
      },
      {
        key: 'advocacy',
        to: '/business/advocacy',
        children: [{ key: 'researchProjects', to: '/business/advocacy/projects' }],
      },
      {
        key: 'researchSocial',
        to: '/business/social',
        children: [
          { key: 'socialAcademy', to: '/business/social/academy' },
          { key: 'socialComfort', to: '/business/social/color-and-comfort' },
        ],
      },
    ],
  },
  {
    id: 'support-col',
    topKey: 'support',
    links: [
      { key: 'supportGuide', to: '/support/guide' },
      { key: 'supportMethod', to: '/support/method' },
    ],
  },
  {
    id: 'news-col',
    topKey: 'news',
    links: [
      { key: 'activities', to: '/news/activities' },
      { key: 'stories', to: '/news/stories' },
      { key: 'press', to: '/news/press' },
      { key: 'newsletter', to: '/news/newsletter' },
      { key: 'inquiry', to: '/news/inquiry' },
      { key: 'announcements', to: '/news/announcements' },
    ],
  },
]

export const NAV_TOP_LABELS: Record<NavTopKey, string> = {
  khayah: '카야',
  business: '사업',
  support: '후원',
  news: '소식',
}

export const NAV_LINK_LABELS: Record<NavVisibilityLinkKey, string> = {
  greeting: '인사말',
  history: '연혁',
  location: '오시는 길',
  financialReport: '투명경영',
  aboutKhayah: '카야 소개·CI',
  ci: 'CI',
  org: '조직도·이사회·전문위원',
  domestic: '국내사업',
  domesticEducation: '교육',
  overseas: '해외사업',
  overseasEducation: '교육',
  overseasVolunteer: '해외봉사단',
  domesticProjects: '국내 진행사업',
  overseasProjects: '해외 진행사업',
  researchProjects: '연구사업 진행사업',
  researchEducation: '교육연구',
  researchSocial: '소셜비즈니스',
  socialAcademy: '카야 아카데미',
  socialComfort: '컬러앤컴포트',
  advocacy: '연구사업',
  projects: '진행사업',
  supportGuide: '후원 안내',
  supportMethod: '후원 방법',
  announcements: '공지사항',
  activities: '활동소식',
  stories: '스토리',
  newsletter: '연간소식지',
  press: '언론보도',
  inquiry: '고객 문의',
  impactGlance: '한눈에 보는 카야',
}

export const DEFAULT_NAV_VISIBILITY: NavVisibilityDocument = {
  version: 1,
  top: {
    khayah: true,
    business: true,
    support: true,
    news: true,
  },
  links: {
    greeting: true,
    history: true,
    location: true,
    financialReport: true,
    aboutKhayah: true,
    ci: true,
    org: true,
    domestic: true,
    domesticEducation: true,
    overseas: true,
    overseasEducation: true,
    overseasVolunteer: true,
    domesticProjects: true,
    overseasProjects: true,
    researchProjects: true,
    researchEducation: false,
    researchSocial: true,
    socialAcademy: true,
    socialComfort: true,
    advocacy: true,
    projects: false,
    supportGuide: true,
    supportMethod: true,
    announcements: true,
    activities: true,
    stories: true,
    newsletter: true,
    press: true,
    inquiry: true,
    impactGlance: false,
  },
}

export function mergeNavVisibility(doc: NavVisibilityDocument | null | undefined): NavVisibilityDocument {
  return {
    version: 1,
    top: { ...DEFAULT_NAV_VISIBILITY.top, ...(doc?.top ?? {}) },
    links: { ...DEFAULT_NAV_VISIBILITY.links, ...(doc?.links ?? {}) },
  }
}

export function isNavTopEnabled(doc: NavVisibilityDocument | null, key: NavTopKey): boolean {
  if (!doc) return true
  return doc.top[key] !== false
}

export function isNavLinkEnabled(doc: NavVisibilityDocument | null, key: NavLinkKey): boolean {
  if (!doc) return true
  if (!(key in doc.links)) return true
  return doc.links[key as NavVisibilityLinkKey] !== false
}

export function filterNavLinks(
  links: NavMenuLinkDef[],
  doc: NavVisibilityDocument | null,
): NavMenuLinkDef[] {
  if (!doc) return links
  return links
    .filter((link) => isNavLinkEnabled(doc, link.key))
    .map((link) => ({
      ...link,
      children: link.children ? filterNavLinks(link.children, doc) : undefined,
    }))
}

export function filterNavColumns(
  columns: NavMenuColumn[],
  doc: NavVisibilityDocument | null,
): NavMenuColumn[] {
  if (!doc) return columns
  return columns
    .filter((col) => isNavTopEnabled(doc, col.topKey))
    .map((col) => ({ ...col, links: filterNavLinks(col.links, doc) }))
    .filter((col) => col.links.length > 0)
}
