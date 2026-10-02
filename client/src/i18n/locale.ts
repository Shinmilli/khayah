export type Locale = 'ko' | 'en'

export const DEFAULT_LOCALE: Locale = 'ko'
export const SITE_PREFIX = '/khayah'
export const LOCALE_PREFIX = '/en'

export function isLocale(value: string): value is Locale {
  return value === 'ko' || value === 'en'
}

function collapsePath(pathname: string): string {
  const normalized = pathname.replace(/\/+/g, '/') || '/'
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized
}

/** `/khayah` 사이드 접두사를 떼서 기존 페이지 경로로 되돌린다. */
export function stripSitePrefix(pathname: string): string {
  const normalized = collapsePath(pathname)
  if (normalized === SITE_PREFIX) return '/'
  if (normalized.startsWith(`${SITE_PREFIX}/`)) {
    const rest = normalized.slice(SITE_PREFIX.length) || '/'
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return normalized
}

/** pathname에서 locale과 locale 제외 경로 분리 */
export function splitLocalePath(pathname: string): { locale: Locale; pathnameWithoutLocale: string } {
  const normalized = stripSitePrefix(pathname)
  if (normalized === LOCALE_PREFIX || normalized.startsWith(`${LOCALE_PREFIX}/`)) {
    const rest = normalized.slice(LOCALE_PREFIX.length) || '/'
    return { locale: 'en', pathnameWithoutLocale: rest.startsWith('/') ? rest : `/${rest}` }
  }
  return { locale: 'ko', pathnameWithoutLocale: normalized }
}

/** 내부 경로에 locale prefix만 적용한다. 예전 `/khayah`가 붙어 있으면 떼고 맞춘다. */
export function localizePath(path: string, locale: Locale): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    return path
  }
  const [pathPart, hash = ''] = path.split('#')
  const [base, search = ''] = pathPart.split('?')
  const raw = base.startsWith('/') ? base : `/${base}`
  const normalized = stripSitePrefix(raw)
  const withoutLocale =
    normalized === LOCALE_PREFIX || normalized.startsWith(`${LOCALE_PREFIX}/`)
      ? normalized.slice(LOCALE_PREFIX.length) || '/'
      : normalized
  const withLocale =
    locale === 'en'
      ? withoutLocale === '/'
        ? LOCALE_PREFIX
        : `${LOCALE_PREFIX}${withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`}`
      : withoutLocale.startsWith('/')
        ? withoutLocale
        : `/${withoutLocale}`
  return `${withLocale}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
}

/** 같은 페이지의 다른 locale URL */
export function swapLocalePath(
  pathname: string,
  search: string,
  hash: string,
  targetLocale: Locale,
): string {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const base = localizePath(pathnameWithoutLocale, targetLocale)
  return `${base}${search}${hash}`
}
