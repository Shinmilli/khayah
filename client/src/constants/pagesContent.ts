import { splitLocalePath, type Locale } from '../i18n/locale'
import { resolveLegacyPathKey } from '../i18n/legacyPaths'
import { PAGES_STATIC_KO, type StaticPage } from './pagesContent.ko'
import { PAGES_STATIC_EN } from './pagesContent.en'

export type { StaticPage }
export { PAGES_STATIC_KO }

/** @deprecated use getStaticPage(pathKey, locale) */
export const PAGES_STATIC = PAGES_STATIC_KO

const BY_LOCALE: Record<Locale, Record<string, StaticPage>> = {
  ko: PAGES_STATIC_KO,
  en: PAGES_STATIC_EN,
}

const PAGE_ALIASES: Record<string, string> = {
  'business/social': 'business/advocacy/social-business',
  'business/social/academy': 'business/advocacy/social-business',
  'business/social/color-and-comfort': 'business/advocacy/social-business',
  'support/method': 'support/apply',
}

const KO_OWN_PAGES = new Set([
  'business/social',
  'business/social/academy',
  'business/social/color-and-comfort',
  'support/method',
])

export function getStaticPage(pathKey: string, locale: Locale): StaticPage | null {
  const key = locale === 'ko' && KO_OWN_PAGES.has(pathKey) ? pathKey : (PAGE_ALIASES[pathKey] ?? pathKey)
  return BY_LOCALE[locale][key] ?? null
}

const REDESIGN_MARK = /data-k=|class="(?:kaya|dom|ovs|gm|sbiz|sup|aca|cnc|kh-history)-/

/** 영어 화면은 예전 HTML 대신 한국어와 같은 디자인 마크업을 쓴다. 제목은 영어 페이지 것을 유지한다. */
export function getDesignPage(pathKey: string, locale: Locale): StaticPage | null {
  const local = getStaticPage(pathKey, locale)
  if (locale === 'ko') return local
  const ko = getStaticPage(pathKey, 'ko')
  if (!ko || !REDESIGN_MARK.test(ko.content)) return local
  return { title: local?.title || ko.title, content: ko.content }
}

/** 각 세그먼트를 한 번 디코드해 정적 키·API slug와 맞춤 (이중 인코딩 URL 대응) */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/** pathname을 PAGES_STATIC 키 형태로 정규화 */
export function normalizePathKey(pathname: string): string {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const trimmed = pathnameWithoutLocale.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return ''
  const key = trimmed.split('/').map(decodeSegment).join('/')
  return resolveLegacyPathKey(key) ?? key
}

/** pathname에서 API slug 추출 (마지막 세그먼트, 디코드 후) */
export function pathToSlug(pathname: string): string {
  const key = normalizePathKey(pathname)
  if (!key) return ''
  const segments = key.split('/')
  return segments[segments.length - 1] ?? ''
}
