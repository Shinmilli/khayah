export type ImpactStatItem = {
  id: string
  label: string
  value: string
  unit?: string
}

export type ImpactStatsDocument = {
  version: 1
  donut: {
    percent: number
    labelLines: string[]
  }
  stats: ImpactStatItem[]
}

export const DEFAULT_IMPACT_STATS: ImpactStatsDocument = {
  version: 1,
  donut: {
    percent: 85.5,
    labelLines: ['수혜된 아동의', '교육지원'],
  },
  stats: [
    { id: 'participants', label: '사업 참여자 수', value: '100,000', unit: '명' },
    { id: 'regions', label: '지원받은 지역/마을 수', value: '0000', unit: '' },
    { id: 'facilities', label: '건설 지원 시설 혹은 제공한 카트 수', value: '0000', unit: '' },
  ],
}

export function formatImpactPercent(n: number): string {
  if (!Number.isFinite(n)) return '0%'
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

/** 라벨이 있는 항목만 홈에 표시 */
export function visibleImpactStats(stats: ImpactStatItem[]): ImpactStatItem[] {
  return stats.filter((row) => row.label.trim().length > 0)
}
