import { localizePath, type Locale } from './locale'

/** 캐논 경로 key (앞 슬래시 없음, 영문 slug) */
export const PATH = {
  home: '',
  stories: 'stories',
  aboutKhayah: 'about/khayah',
  aboutGreeting: 'about/greeting',
  aboutHistory: 'about/history',
  aboutLocation: 'about/location',
  aboutFinancialReport: 'about/financial-report',
  businessOverseas: 'business/overseas',
  businessOverseasEducation: 'business/overseas/education',
  businessOverseasVolunteer: 'business/overseas/volunteer',
  businessOverseasHealth: 'business/overseas/health-care',
  businessDomestic: 'business/domestic',
  businessDomesticEducation: 'business/domestic/education',
  businessAdvocacy: 'business/advocacy',
  businessProjects: 'business/projects',
  businessProjectsNepal: 'business/projects/nepal',
  businessProjectsMyanmar: 'business/projects/myanmar',
  businessProjectsKyrgyzstan: 'business/projects/kyrgyzstan',
  businessProjectsDomestic: 'business/projects/domestic',
  supportGuide: 'support/guide',
  supportApply: 'support/apply',
  news: 'news',
  newsAnnouncements: 'news/announcements',
  newsActivities: 'news/activities',
  newsNewsletter: 'news/newsletter',
  newsPress: 'news/press',
  newsInquiry: 'news/inquiry',
  together: 'together',
  togetherAnnouncements: 'together/announcements',
  togetherNews: 'together/news',
} as const

export type PathKey = (typeof PATH)[keyof typeof PATH]

export function pathKeyToHref(pathKey: string): string {
  if (!pathKey) return '/'
  return `/${pathKey}`
}

/** 진행사업 분류: 표시명 ↔ URL slug. 예전 국가 값은 해외로 묶는다. */
export const PROJECT_REGION_TO_SLUG: Record<string, string> = {
  해외: 'overseas',
  국내: 'domestic',
  연구사업: 'research',
  네팔: 'overseas',
  미얀마: 'overseas',
  키르기즈스탄: 'overseas',
}

export const PROJECT_SLUG_TO_REGION: Record<string, string> = {
  overseas: '해외',
  domestic: '국내',
  research: '연구사업',
  nepal: '해외',
  myanmar: '해외',
  kyrgyzstan: '해외',
}

const LEGACY_OVERSEAS_REGIONS = new Set(['네팔', '미얀마', '키르기즈스탄'])

export function canonicalProjectRegion(region: string): string {
  return LEGACY_OVERSEAS_REGIONS.has(region) ? '해외' : region
}

export function projectRegionHref(region: string, locale: Locale = 'ko'): string {
  if (region === '전체') return localizePath(pathKeyToHref(PATH.businessProjects), locale)
  const slug = PROJECT_REGION_TO_SLUG[region] ?? encodeURIComponent(region)
  return localizePath(`${pathKeyToHref(PATH.businessProjects)}/${slug}`, locale)
}
