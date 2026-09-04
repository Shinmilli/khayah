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

export function getStaticPage(pathKey: string, locale: Locale): StaticPage | null {
  return BY_LOCALE[locale][pathKey] ?? null
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
