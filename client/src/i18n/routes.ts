import { localizePath, type Locale } from './locale'

/** 캐논 경로 key (앞 슬래시 없음, 영문 slug) */
export const PATH = {
  home: '',
  stories: 'stories',
  aboutKhayah: 'about/khayah',
  aboutGreeting: 'about/greeting',
  aboutHistory: 'about/history',
  aboutLocation: 'about/location',
  businessOverseas: 'business/overseas',
  businessOverseasEducation: 'business/overseas/education',
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
  newsFinancialReport: 'news/financial-report',
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

/** 진행사업 지역: 표시명 ↔ URL slug */
export const PROJECT_REGION_TO_SLUG: Record<string, string> = {
  네팔: 'nepal',
  미얀마: 'myanmar',
  키르기즈스탄: 'kyrgyzstan',
  국내: 'domestic',
}

export const PROJECT_SLUG_TO_REGION: Record<string, string> = {
  nepal: '네팔',
  myanmar: '미얀마',
  kyrgyzstan: '키르기즈스탄',
  domestic: '국내',
}

export function projectRegionHref(region: string, locale: Locale = 'ko'): string {
  if (region === '전체') return localizePath(pathKeyToHref(PATH.businessProjects), locale)
  const slug = PROJECT_REGION_TO_SLUG[region] ?? encodeURIComponent(region)
  return localizePath(`${pathKeyToHref(PATH.businessProjects)}/${slug}`, locale)
}
