import { splitLocalePath } from '../../i18n/locale'
import type { NavLinkKey } from '../../i18n/messages/ko'

/** URL ?tab= 값과 탭 id 매핑 */
export const KHAYAH_ABOUT_TAB_IDS = ['intro', 'ci', 'org'] as const
export type KhayahAboutTabId = (typeof KHAYAH_ABOUT_TAB_IDS)[number]

export const KHAYAH_ABOUT_TABS: Array<{ id: KhayahAboutTabId; label: string }> = [
  { id: 'intro', label: '카야 소개' },
  { id: 'ci', label: 'CI' },
  { id: 'org', label: '조직도 · 이사회 · 전문위원' },
]

export type KhayahSectionId =
  | 'greeting'
  | 'history'
  | 'location'
  | 'financialReport'
  | 'aboutKhayah'
  | 'ci'
  | 'org'

export const KHAYAH_SECTION_NAV: Array<{ id: KhayahSectionId; to: string; labelKey: NavLinkKey }> = [
  { id: 'greeting', to: '/about/greeting', labelKey: 'greeting' },
  { id: 'history', to: '/about/history', labelKey: 'history' },
  { id: 'location', to: '/about/location', labelKey: 'location' },
  { id: 'financialReport', to: '/about/financial-report', labelKey: 'financialReport' },
  { id: 'aboutKhayah', to: '/about/khayah', labelKey: 'aboutKhayah' },
  { id: 'ci', to: '/about/khayah?tab=ci', labelKey: 'ci' },
  { id: 'org', to: '/about/khayah?tab=org', labelKey: 'org' },
]

export function parseAboutTab(search: string, hash: string): KhayahAboutTabId {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const raw = params.get('tab')?.toLowerCase().trim()
  if (raw === 'board') return 'org'
  if (raw === 'programs') return 'intro'
  if (raw && KHAYAH_ABOUT_TAB_IDS.includes(raw as KhayahAboutTabId)) return raw as KhayahAboutTabId
  const h = hash.replace(/^#/, '').toLowerCase()
  if (h === 'ci') return 'ci'
  if (h === 'vision' || h === 'about') return 'intro'
  if (h === 'directors' || h === 'experts' || h === 'org-chart') return 'org'
  return 'intro'
}

export function getActiveKhayahSection(pathname: string, search: string, hash = ''): KhayahSectionId | null {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const path = pathnameWithoutLocale.replace(/\/+$/, '') || '/'
  if (path.endsWith('/about/greeting')) return 'greeting'
  if (path.endsWith('/about/history')) return 'history'
  if (path.endsWith('/about/location')) return 'location'
  if (path.endsWith('/about/financial-report')) return 'financialReport'
  if (path.endsWith('/about/khayah')) {
    const tab = parseAboutTab(search, hash)
    if (tab === 'ci') return 'ci'
    if (tab === 'org') return 'org'
    return 'aboutKhayah'
  }
  return null
}

export function isKhayahSectionPathKey(pathKey: string): boolean {
  return (
    pathKey === 'about/greeting' ||
    pathKey === 'about/history' ||
    pathKey === 'about/location' ||
    pathKey === 'about/financial-report' ||
    pathKey === 'about/khayah'
  )
}
