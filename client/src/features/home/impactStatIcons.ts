/** Material Symbols Outlined — 나눔의 결실 통계 아이콘 (index.html icon_names와 동일한 목록) */
export const IMPACT_STAT_ICONS = [
  { name: 'groups', label: '사람들' },
  { name: 'person', label: '사람' },
  { name: 'diversity_3', label: '다양성' },
  { name: 'child_care', label: '아동' },
  { name: 'school', label: '교육' },
  { name: 'volunteer_activism', label: '봉사' },
  { name: 'handshake', label: '협력' },
  { name: 'favorite', label: '하트' },
  { name: 'location_on', label: '위치' },
  { name: 'map', label: '지도' },
  { name: 'public', label: '지구본' },
  { name: 'holiday_village', label: '마을' },
  { name: 'home', label: '집' },
  { name: 'apartment', label: '건물' },
  { name: 'domain', label: '시설' },
  { name: 'home_work', label: '주거·시설' },
  { name: 'construction', label: '건설' },
  { name: 'warehouse', label: '창고' },
  { name: 'local_shipping', label: '운송·카트' },
  { name: 'shopping_cart', label: '카트' },
  { name: 'water_drop', label: '물' },
  { name: 'eco', label: '환경' },
  { name: 'health_and_safety', label: '보건' },
  { name: 'menu_book', label: '책' },
  { name: 'work', label: '일자리' },
] as const

export type ImpactStatIconName = (typeof IMPACT_STAT_ICONS)[number]['name']

const ICON_SET = new Set<string>(IMPACT_STAT_ICONS.map((i) => i.name))

export function isImpactStatIcon(name: string): name is ImpactStatIconName {
  return ICON_SET.has(name)
}

export function defaultImpactStatIcon(id: string): ImpactStatIconName {
  if (id === 'participants') return 'groups'
  if (id === 'regions') return 'location_on'
  if (id === 'facilities') return 'local_shipping'
  return 'groups'
}

export function resolveImpactStatIcon(icon: string | undefined, id: string): ImpactStatIconName {
  const name = icon?.trim() ?? ''
  return isImpactStatIcon(name) ? name : defaultImpactStatIcon(id)
}

/** Google Fonts `icon_names`는 알파벳 순이어야 함 */
export const IMPACT_STAT_ICON_FONT_NAMES = [...ICON_SET].sort().join(',')
