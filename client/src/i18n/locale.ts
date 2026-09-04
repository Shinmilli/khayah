export type Locale = 'ko' | 'en'

export const DEFAULT_LOCALE: Locale = 'ko'
export const LOCALE_PREFIX = '/en'

export function isLocale(value: string): value is Locale {
  return value === 'ko' || value === 'en'
}

/** pathname에서 locale과 locale 제외 경로 분리 */
export function splitLocalePath(pathname: string): { locale: Locale; pathnameWithoutLocale: string } {
  const normalized = pathname.replace(/\/+/g, '/') || '/'
  if (normalized === LOCALE_PREFIX || normalized.startsWith(`${LOCALE_PREFIX}/`)) {
    const rest = normalized.slice(LOCALE_PREFIX.length) || '/'
    return { locale: 'en', pathnameWithoutLocale: rest.startsWith('/') ? rest : `/${rest}` }
  }
  return { locale: 'ko', pathnameWithoutLocale: normalized }
}

/** 내부 경로에 locale prefix 적용 (외부 URL은 그대로) */
export function localizePath(path: string, locale: Locale): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    return path
  }
  const [pathPart, hash = ''] = path.split('#')
  const [base, search = ''] = pathPart.split('?')
  const normalized = base.startsWith('/') ? base : `/${base}`
  const withLocale =
    locale === 'en'
      ? normalized === '/'
        ? LOCALE_PREFIX
        : `${LOCALE_PREFIX}${normalized}`
      : normalized
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
