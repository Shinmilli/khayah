import { PATH } from '../i18n/routes'

const ABOUT = '/images/banners/about.jpg'
/** 소식·스토리 공통 배너 */
const NEWS = '/images/banners/news.jpg'

/** PageHero 배너 — 경로별 선정 이미지 */
const BY_PATH: Record<string, string> = {
  // 카야 (소개·인사말·연혁·오시는 길 등 통일)
  [PATH.aboutKhayah]: ABOUT,
  [PATH.aboutGreeting]: ABOUT,
  [PATH.aboutHistory]: ABOUT,
  [PATH.aboutLocation]: ABOUT,
  'about/org-chart': ABOUT,
  'about/directors': ABOUT,

  // 사업
  [PATH.businessDomestic]: '/images/banners/business-domestic.jpg',
  [PATH.businessDomesticEducation]: '/images/banners/business-domestic.jpg',
  [PATH.businessOverseas]: '/images/banners/business-overseas.jpg',
  [PATH.businessOverseasEducation]: '/images/banners/business-overseas.jpg',
  [PATH.businessOverseasHealth]: '/images/banners/business-overseas.jpg',
  [PATH.businessAdvocacy]: '/images/banners/business-advocacy.jpg',
  [PATH.businessProjects]: '/images/banners/business-projects.jpg',

  // 후원
  [PATH.supportGuide]: '/images/banners/support.jpg',
  [PATH.supportApply]: '/images/banners/support.jpg',

  // 소식 (공지·활동·연간·언론·재정·문의 통일)
  [PATH.newsAnnouncements]: NEWS,
  [PATH.newsActivities]: NEWS,
  [PATH.newsNewsletter]: NEWS,
  [PATH.newsPress]: NEWS,
  [PATH.newsFinancialReport]: NEWS,
  [PATH.newsInquiry]: NEWS,
  news: NEWS,
}

export function pageHeroImageForPath(pathKey: string | null | undefined): string | null {
  if (!pathKey) return null
  if (BY_PATH[pathKey]) return BY_PATH[pathKey]
  if (pathKey.startsWith('about/')) return ABOUT
  if (pathKey.startsWith('support/')) return BY_PATH[PATH.supportGuide]
  if (pathKey.startsWith(`${PATH.businessProjects}/`)) return BY_PATH[PATH.businessProjects]
  if (pathKey.startsWith(`${PATH.businessDomestic}/`)) return BY_PATH[PATH.businessDomestic]
  if (pathKey.startsWith(`${PATH.businessOverseas}/`)) return BY_PATH[PATH.businessOverseas]
  if (pathKey.startsWith('news/')) return NEWS
  if (pathKey.startsWith('stories')) return NEWS
  return null
}

/** 스토리 아카이브 — 범위 구분 없이 소식 공통 배너 */
export function pageHeroImageForStoryScope(_scope?: string | null): string {
  return NEWS
}
