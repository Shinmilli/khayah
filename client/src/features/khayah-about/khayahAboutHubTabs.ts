/** URL ?tab= 값과 탭 id 매핑 */
export const KHAYAH_ABOUT_TAB_IDS = ['intro', 'ci', 'org'] as const
export type KhayahAboutTabId = (typeof KHAYAH_ABOUT_TAB_IDS)[number]

export const KHAYAH_ABOUT_TABS: Array<{ id: KhayahAboutTabId; label: string }> = [
  { id: 'intro', label: '카야 소개' },
  { id: 'ci', label: 'CI' },
  { id: 'org', label: '조직도 · 이사회 · 전문위원' },
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
