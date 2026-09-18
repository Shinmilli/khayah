export type ImpactEditLocale = 'ko' | 'en'

export type ImpactIntroLocale = {
  kicker: string
  title: string
  subtitle: string
  rotator: string[]
}

export type ImpactIntroColors = {
  kicker: string
  title: string
  subtitle: string
  rotator: string
}

export type ImpactDonut = {
  percent: number
  labelLines: string[]
}

export type ImpactPrimaryCardColors = {
  cardBg: string
  kicker: string
  title: string
  desc: string
  ctaBg: string
  ctaText: string
  donutFill: string
  donutTrack: string
  donutHole: string
  donutValue: string
  donutSub: string
}

export type ImpactPrimaryCardLocale = {
  kicker: string
  title: string
  desc: string
  ctaLabel: string
  ctaHref: string
  donut: ImpactDonut
}

export type ImpactPrimaryCard = {
  id: string
  showDonut: boolean
  colors: ImpactPrimaryCardColors
  locales: {
    ko: ImpactPrimaryCardLocale
    en: ImpactPrimaryCardLocale
  }
}

export type ImpactStatColors = {
  cardBg: string
  label: string
  value: string
  unit: string
  iconBg: string
  iconColor: string
}

export type ImpactStatLocale = {
  label: string
  value: string
  unit: string
}

export type ImpactStatItem = {
  id: string
  icon?: string
  colors: ImpactStatColors
  locales: {
    ko: ImpactStatLocale
    en: ImpactStatLocale
  }
}

export type ImpactStatsDocument = {
  version: 3
  backgroundImageUrl: string
  introColors: ImpactIntroColors
  intro: {
    ko: ImpactIntroLocale
    en: ImpactIntroLocale
  }
  primaryCards: ImpactPrimaryCard[]
  stats: ImpactStatItem[]
}

export type ImpactPrimaryCardView = {
  id: string
  showDonut: boolean
  colors: ImpactPrimaryCardColors
  kicker: string
  title: string
  desc: string
  ctaLabel: string
  ctaHref: string
  donut: ImpactDonut
}

export type ImpactStatView = {
  id: string
  icon?: string
  colors: ImpactStatColors
  label: string
  value: string
  unit: string
}

export type ImpactStatsPublicView = {
  backgroundImageUrl: string
  introColors: ImpactIntroColors
  intro: ImpactIntroLocale
  primaryCards: ImpactPrimaryCardView[]
  stats: ImpactStatView[]
}

export const DEFAULT_PRIMARY_CARD_COLORS: ImpactPrimaryCardColors = {
  cardBg: '#b20838',
  kicker: '#df84a1',
  title: '#ffffff',
  desc: '#ffffff',
  ctaBg: '#ffffff',
  ctaText: '#b20838',
  donutFill: '#ffd6e6',
  donutTrack: '#e96c9c',
  donutHole: '#b20838',
  donutValue: '#ffffff',
  donutSub: '#ffffff',
}

export const DEFAULT_STAT_COLORS: ImpactStatColors = {
  cardBg: '#ffffff',
  label: '#555555',
  value: '#b20838',
  unit: '#b20838',
  iconBg: '#d4d4d4',
  iconColor: '#ffffff',
}

export const DEFAULT_INTRO_COLORS: ImpactIntroColors = {
  kicker: '#b20838',
  title: '#333333',
  subtitle: '#777777',
  rotator: '#ffffff',
}

export const DEFAULT_IMPACT_BG = '/images/Home/impact_background.png'

const DEFAULT_PRIMARY_ID = 'fund-use'

export const DEFAULT_IMPACT_STATS: ImpactStatsDocument = {
  version: 3,
  backgroundImageUrl: '',
  introColors: { ...DEFAULT_INTRO_COLORS },
  intro: {
    ko: {
      kicker: 'Impact',
      title: '나눔의 결실',
      subtitle: '함께 만든 희망의 열매들',
      rotator: [
        '01. 투명하게 증명합니다',
        '02. 현장의 변화를 우선합니다',
        '03. 소중한 마음을 연결합니다',
      ],
    },
    en: {
      kicker: 'Impact',
      title: 'Impact of giving',
      subtitle: 'Fruit of hope, grown together',
      rotator: [
        '01. We prove it transparently',
        '02. Change on the ground comes first',
        '03. We connect generous hearts',
      ],
    },
  },
  primaryCards: [
    {
      id: DEFAULT_PRIMARY_ID,
      showDonut: true,
      colors: { ...DEFAULT_PRIMARY_CARD_COLORS },
      locales: {
        ko: {
          kicker: 'Our Work',
          title: '후원금은 이렇게 사용됩니다',
          desc: 'Khayah는 후원금을 가장 가치 있는 일에 사용하기 위해 노력합니다.',
          ctaLabel: '자세히보기',
          ctaHref: '/about/financial-report',
          donut: { percent: 85.5, labelLines: ['수혜된 아동의', '교육지원'] },
        },
        en: {
          kicker: 'Our Work',
          title: 'How your donation is used',
          desc: 'Khayah strives to use every gift where it creates the most value.',
          ctaLabel: 'Learn more',
          ctaHref: '/about/financial-report',
          donut: { percent: 85.5, labelLines: ['Education support', 'for children we serve'] },
        },
      },
    },
  ],
  stats: [
    {
      id: 'participants',
      icon: 'groups',
      colors: { ...DEFAULT_STAT_COLORS },
      locales: {
        ko: { label: '사업 참여자 수', value: '100,000', unit: '명' },
        en: { label: 'Program participants', value: '100,000', unit: '' },
      },
    },
    {
      id: 'regions',
      icon: 'location_on',
      colors: { ...DEFAULT_STAT_COLORS },
      locales: {
        ko: { label: '지원받은 지역/마을 수', value: '0000', unit: '' },
        en: { label: 'Communities / villages supported', value: '0000', unit: '' },
      },
    },
    {
      id: 'facilities',
      icon: 'local_shipping',
      colors: { ...DEFAULT_STAT_COLORS },
      locales: {
        ko: { label: '건설 지원 시설 혹은 제공한 카트 수', value: '0000', unit: '' },
        en: { label: 'Facilities built or carts provided', value: '0000', unit: '' },
      },
    },
  ],
}

export function newImpactId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())
  return `${prefix}-${rand}`
}

export function emptyPrimaryCard(): ImpactPrimaryCard {
  return {
    id: newImpactId('primary'),
    showDonut: true,
    colors: { ...DEFAULT_PRIMARY_CARD_COLORS },
    locales: {
      ko: {
        kicker: 'Our Work',
        title: '',
        desc: '',
        ctaLabel: '자세히보기',
        ctaHref: '',
        donut: { percent: 0, labelLines: [] },
      },
      en: {
        kicker: 'Our Work',
        title: '',
        desc: '',
        ctaLabel: 'Learn more',
        ctaHref: '',
        donut: { percent: 0, labelLines: [] },
      },
    },
  }
}

export function emptyStatItem(): ImpactStatItem {
  return {
    id: newImpactId('stat'),
    icon: 'groups',
    colors: { ...DEFAULT_STAT_COLORS },
    locales: {
      ko: { label: '', value: '', unit: '' },
      en: { label: '', value: '', unit: '' },
    },
  }
}

export function formatImpactPercent(n: number): string {
  if (!Number.isFinite(n)) return '0%'
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

export function visibleImpactStats(stats: ImpactStatView[]): ImpactStatView[] {
  return stats.filter((row) => row.label.trim().length > 0)
}

export function visiblePrimaryCards(cards: ImpactPrimaryCardView[]): ImpactPrimaryCardView[] {
  return cards
}

export function resolvedImpactBg(url: string | undefined): string {
  const trimmed = url?.trim() ?? ''
  return trimmed || DEFAULT_IMPACT_BG
}

export function impactStatsForLocale(
  doc: ImpactStatsDocument,
  locale: ImpactEditLocale,
): ImpactStatsPublicView {
  return {
    backgroundImageUrl: resolvedImpactBg(doc.backgroundImageUrl),
    introColors: { ...DEFAULT_INTRO_COLORS, ...doc.introColors },
    intro: doc.intro[locale],
    primaryCards: doc.primaryCards.map((card) => ({
      id: card.id,
      showDonut: card.showDonut !== false,
      colors: { ...DEFAULT_PRIMARY_CARD_COLORS, ...card.colors },
      ...card.locales[locale],
    })),
    stats: doc.stats.map((row) => ({
      id: row.id,
      icon: row.icon,
      colors: { ...DEFAULT_STAT_COLORS, ...row.colors },
      ...row.locales[locale],
    })),
  }
}

export const DEFAULT_IMPACT_PUBLIC_KO = impactStatsForLocale(DEFAULT_IMPACT_STATS, 'ko')

/** @deprecated use DEFAULT_IMPACT_STATS */
export const DEFAULT_IMPACT_STATS_KO = DEFAULT_IMPACT_STATS.intro.ko
