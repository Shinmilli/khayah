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
  [PATH.aboutFinancialReport]: ABOUT,
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

  // 소식 (공지·활동·연간·언론·문의 통일)
  [PATH.newsAnnouncements]: NEWS,
  [PATH.newsActivities]: NEWS,
  [PATH.newsNewsletter]: NEWS,
  [PATH.newsPress]: NEWS,
  [PATH.newsInquiry]: NEWS,
  news: NEWS,
  [PATH.stories]: NEWS,
}

/** 관리자에서 올린 페이지별 배너. 비어 있으면 BY_PATH 기본값을 씀 */
let customByPath: Record<string, string> = {}

export function setPageHeroImageOverrides(images: Record<string, string> | null | undefined): void {
  const next: Record<string, string> = {}
  if (images) {
    for (const [key, raw] of Object.entries(images)) {
      const url = (raw ?? '').trim()
      if (url) next[key] = url
    }
  }
  customByPath = next
}

function custom(pathKey: string): string | undefined {
  const url = customByPath[pathKey]
  return url || undefined
}

function sectionKeyForPath(pathKey: string): 'khayah' | 'business' | 'support' | 'news' | null {
  if (pathKey === 'about' || pathKey.startsWith('about/')) return 'khayah'
  if (pathKey === 'business' || pathKey.startsWith('business/')) return 'business'
  if (pathKey === 'support' || pathKey.startsWith('support/')) return 'support'
  if (pathKey === 'news' || pathKey.startsWith('news/') || pathKey.startsWith('stories')) return 'news'
  return null
}

/** 초소형 JPEG — 본 이미지 전에 블러로 깔아 체감 대기 시간을 줄임 */
const HERO_BLUR: Record<string, string> = {
  '/images/banners/about.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAKACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAABQYBAgME/8QAJxAAAgECBAQHAAAAAAAAAAAAAQIDAAQFESFBEhMigTEyUWFxscH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAA//EABcRAQEBAQAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/AB+HXUcXMWVSwZen2PrR7ELZJpIp428kYAXvvS1bKDNHmAc5AKYcTAFloANQO1TqvXJfvIhjktiWKgqSNiTp91aS0MVygaYBY14mYbMfH9rG36UjK6HhGo+ajEGKSRBSVDEZgb0wtf/Z',
  '/images/banners/business-advocacy.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAKACADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAID/8QAIxAAAgIBAwMFAAAAAAAAAAAAAQIDEQAEEiEFMVEiQWGywf/EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARIf/aAAwDAQACEQMRAD8ADJLsdt6gx9qJrIPUJRUcMShe6rXOFnJMjWSarviwSNEpBo7gL+MhrOzJNMs1LapKvn3NXg06cXJJPpo8+Tm+iYnUQWSeD9cW37iQuX//2Q==',
  '/images/banners/business-domestic.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAMABUDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAMFBAb/xAAgEAACAgEEAwEAAAAAAAAAAAABAgARAwQSEyEiMXGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQD/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8Aw8q43BcgOBZq/wBiGzBs29CN3ok+jOkw6XHbk2wZrIIFRh02EDxQD4IGIDMyVuYMSL6B6hLvCg6q/sIJ/9k=',
  '/images/banners/business-overseas.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAMABUDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIEAQP/xAAiEAACAgEDBAMAAAAAAAAAAAABAgMRAAQhYRIiMUETI9H/xAAWAQEBAQAAAAAAAAAAAAAAAAADAgT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIRBBL/2gAMAwEAAhEDEQA/AMXWAx/CgBA2Dfuc11r9PbGKJocGvfGJpLTSysrEFoWJo85PCPpsEinHjIFqV6wpm1kbyENI8ZXalPnnbDGKK8ju46iTXdv6ww3Zpnn1H//Z',
  '/images/banners/business-projects.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAMABUDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFAf/EACIQAAIBBAIBBQAAAAAAAAAAAAECAwAEERIhMQUTFCNBUf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAERAP/aAAwDAQACEQMRAD8AZuL63hvfatnIXO37WT3Hp7Fl+LgIwHJJFKecIguY50A3IxzSLyuxgUsdZBswye6qy5AWaleg37o9oN4kQL3gg/fFFVLSKONC6RqrOAWIHfFFZzd//9k=',
  '/images/banners/news.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAKACADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgMEBf/EACcQAAEDAgQFBQAAAAAAAAAAAAEAAgMREgQFITElM0FRcUJzgbHB/8QAFwEAAwEAAAAAAAAAAAAAAAAAAQIDBP/EABgRAQEAAwAAAAAAAAAAAAAAAAACASFB/9oADAMBAAIRAxEAPwChrrgLhTtREGA+pKi1OvYJ42b5/ViBPmGEccsmkdBeGirXg0psPnqgy/XAR3ChAotrFDgcntlYsXIj8D6Vr1ODcf/Z',
  '/images/banners/support.jpg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAKACADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUC/8QAIhAAAgEDBQADAQAAAAAAAAAAAQIDAAQRBRIhMUE1UVKx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQD/xAAZEQADAQEBAAAAAAAAAAAAAAAAAREhMVH/2gAMAwEAAhEDEQA/ABtewR3At7VnWPZhS4AO7vzvOKzDKA6xgIXYnBbrn3PlK16KONrN0jRWJGSFANRrkkXLYP5/gofo8xFWEPFctBMy7VGQgY7SaIsbT6isaxFQTksF4FWNU+MmPq4wfrkUvTVUWEbBQGI5OOTTI4TeU//Z',
}

function defaultHeroImageForPath(pathKey: string): string | null {
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

export function pageHeroImageForPath(pathKey: string | null | undefined): string | null {
  if (!pathKey) return null
  const section = sectionKeyForPath(pathKey)
  if (section) {
    const override = custom(section)
    if (override) return override
  }
  return defaultHeroImageForPath(pathKey)
}

/** 스토리 아카이브 — 범위 구분 없이 소식 공통 배너 */
export function pageHeroImageForStoryScope(_scope?: string | null): string {
  return pageHeroImageForPath(PATH.stories) ?? NEWS
}

/** 게시글 종류·스토리 범위에 맞는 히어로 배너 */
export function pageHeroImageForPostKind(
  kind: string | null | undefined,
  storyScope?: string | null,
): string {
  switch (kind) {
    case '공지사항':
      return pageHeroImageForPath(PATH.newsAnnouncements) ?? NEWS
    case '활동소식':
      return pageHeroImageForPath(PATH.newsActivities) ?? NEWS
    case '연간소식지':
      return pageHeroImageForPath(PATH.newsNewsletter) ?? NEWS
    case '언론보도':
      return pageHeroImageForPath(PATH.newsPress) ?? NEWS
    case '진행사업':
      return pageHeroImageForPath(PATH.businessProjects) ?? BY_PATH[PATH.businessProjects]
    case '스토리':
      return pageHeroImageForStoryScope(storyScope)
    default:
      return custom('news') || NEWS
  }
}

export function pageHeroBlurForUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return HERO_BLUR[url] ?? null
}

const prefetched = new Set<string>()

/** 메뉴 hover 등으로 본 이미지를 미리 받아 두어 상세 진입 시 대기 시간을 줄임 */
export function prefetchPageHeroImage(url: string | null | undefined): void {
  if (!url || prefetched.has(url) || typeof Image === 'undefined') return
  prefetched.add(url)
  const img = new Image()
  img.src = url
}
