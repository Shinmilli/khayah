import { Navigate, useLocation } from 'react-router-dom'
import { splitLocalePath } from './locale'
import { legacyRedirectTarget, resolveLegacyPathKey } from './legacyPaths'
import { pathKeyToHref } from './routes'
import { useLocale } from './LocaleContext'

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function rawPathKey(pathname: string): string {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const trimmed = pathnameWithoutLocale.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return ''
  return trimmed.split('/').map(decodeSegment).join('/')
}

/** 구 한글 URL 등 → 캐논 영문 slug로 301-style replace 리다이렉트 */
export function LegacyPathRedirect() {
  const location = useLocation()
  const { localize } = useLocale()
  const key = rawPathKey(location.pathname)

  const special = legacyRedirectTarget(key, location.search, location.hash)
  if (special) {
    const to = `${localize(pathKeyToHref(special.pathKey))}${special.search}${special.hash}`
    return <Navigate to={to} replace />
  }

  const resolved = resolveLegacyPathKey(key)
  if (resolved && resolved !== key) {
    const to = `${localize(pathKeyToHref(resolved))}${location.search}${location.hash}`
    return <Navigate to={to} replace />
  }

  return null
}
