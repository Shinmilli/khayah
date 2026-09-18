import fs from 'fs/promises'
import path from 'path'
import seedDocument from '../seed/impact-stats.default.json'
import { deleteRemovedStoredMedia } from '../utils/storedMedia'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'impact-stats.json')
const ICON_NAME_RE = /^[a-z0-9_]{1,64}$/
const COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const DEFAULT_BG = '/images/Home/impact_background.png'

export type ImpactLocale = 'ko' | 'en'

type ImpactDonut = { percent: number; labelLines: string[] }
type ImpactIntroLocale = { kicker: string; title: string; subtitle: string; rotator: string[] }
type ImpactIntroColors = { kicker: string; title: string; subtitle: string; rotator: string }
type ImpactPrimaryCardColors = {
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
type ImpactPrimaryCardLocale = {
  kicker: string
  title: string
  desc: string
  ctaLabel: string
  ctaHref: string
  donut: ImpactDonut
}
type ImpactPrimaryCard = {
  id: string
  colors: ImpactPrimaryCardColors
  locales: { ko: ImpactPrimaryCardLocale; en: ImpactPrimaryCardLocale }
}
type ImpactStatColors = {
  cardBg: string
  label: string
  value: string
  unit: string
  iconBg: string
  iconColor: string
}
type ImpactStatLocale = { label: string; value: string; unit: string }
type ImpactStatItem = {
  id: string
  icon?: string
  colors: ImpactStatColors
  locales: { ko: ImpactStatLocale; en: ImpactStatLocale }
}

export type ImpactStatsDocumentV3 = {
  version: 3
  backgroundImageUrl: string
  introColors: ImpactIntroColors
  intro: { ko: ImpactIntroLocale; en: ImpactIntroLocale }
  primaryCards: ImpactPrimaryCard[]
  stats: ImpactStatItem[]
}

type ImpactStatItemV2 = { id: string; label: string; value: string; unit?: string; icon?: string }
type ImpactStatsLocaleV2 = { donut: ImpactDonut; stats: ImpactStatItemV2[] }
type ImpactStatsDocumentV2 = { version: 2; locales: { ko: ImpactStatsLocaleV2; en: ImpactStatsLocaleV2 } }
type ImpactStatsDocumentV1 = { version: 1; donut: ImpactDonut; stats: ImpactStatItemV2[] }

export type ImpactStatsDocument = ImpactStatsDocumentV3

export type ImpactStatsPublicView = {
  backgroundImageUrl: string
  introColors: ImpactIntroColors
  intro: ImpactIntroLocale
  primaryCards: Array<ImpactPrimaryCardLocale & { id: string; colors: ImpactPrimaryCardColors }>
  stats: Array<ImpactStatLocale & { id: string; icon?: string; colors: ImpactStatColors }>
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function asColor(v: unknown, fallback: string): string {
  const s = asString(v).trim()
  return COLOR_RE.test(s) ? s : fallback
}

function asPercent(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((line): line is string => typeof line === 'string')
}

function asDonut(v: unknown, fallback: ImpactDonut): ImpactDonut {
  if (!isPlainObject(v)) return { ...fallback, labelLines: [...fallback.labelLines] }
  return {
    percent: asPercent(v.percent),
    labelLines: asStringArray(v.labelLines),
  }
}

const DEFAULT_PRIMARY_COLORS: ImpactPrimaryCardColors = {
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

const DEFAULT_STAT_COLORS: ImpactStatColors = {
  cardBg: '#ffffff',
  label: '#555555',
  value: '#b20838',
  unit: '#b20838',
  iconBg: '#d4d4d4',
  iconColor: '#ffffff',
}

const DEFAULT_INTRO_COLORS: ImpactIntroColors = {
  kicker: '#b20838',
  title: '#333333',
  subtitle: '#777777',
  rotator: '#ffffff',
}

function parseIntroLocale(v: unknown, fallback: ImpactIntroLocale): ImpactIntroLocale {
  if (!isPlainObject(v)) return { ...fallback, rotator: [...fallback.rotator] }
  return {
    kicker: asString(v.kicker, fallback.kicker),
    title: asString(v.title, fallback.title),
    subtitle: asString(v.subtitle, fallback.subtitle),
    rotator: asStringArray(v.rotator),
  }
}

function parsePrimaryLocale(v: unknown, fallback: ImpactPrimaryCardLocale): ImpactPrimaryCardLocale {
  if (!isPlainObject(v)) {
    return { ...fallback, donut: { ...fallback.donut, labelLines: [...fallback.donut.labelLines] } }
  }
  return {
    kicker: asString(v.kicker, fallback.kicker),
    title: asString(v.title),
    desc: asString(v.desc),
    ctaLabel: asString(v.ctaLabel, fallback.ctaLabel),
    ctaHref: asString(v.ctaHref),
    donut: asDonut(v.donut, fallback.donut),
  }
}

function parsePrimaryColors(v: unknown): ImpactPrimaryCardColors {
  const src = isPlainObject(v) ? v : {}
  return {
    cardBg: asColor(src.cardBg, DEFAULT_PRIMARY_COLORS.cardBg),
    kicker: asColor(src.kicker, DEFAULT_PRIMARY_COLORS.kicker),
    title: asColor(src.title, DEFAULT_PRIMARY_COLORS.title),
    desc: asColor(src.desc, DEFAULT_PRIMARY_COLORS.desc),
    ctaBg: asColor(src.ctaBg, DEFAULT_PRIMARY_COLORS.ctaBg),
    ctaText: asColor(src.ctaText, DEFAULT_PRIMARY_COLORS.ctaText),
    donutFill: asColor(src.donutFill, DEFAULT_PRIMARY_COLORS.donutFill),
    donutTrack: asColor(src.donutTrack, DEFAULT_PRIMARY_COLORS.donutTrack),
    donutHole: asColor(src.donutHole, DEFAULT_PRIMARY_COLORS.donutHole),
    donutValue: asColor(src.donutValue, DEFAULT_PRIMARY_COLORS.donutValue),
    donutSub: asColor(src.donutSub, DEFAULT_PRIMARY_COLORS.donutSub),
  }
}

function parseStatColors(v: unknown): ImpactStatColors {
  const src = isPlainObject(v) ? v : {}
  return {
    cardBg: asColor(src.cardBg, DEFAULT_STAT_COLORS.cardBg),
    label: asColor(src.label, DEFAULT_STAT_COLORS.label),
    value: asColor(src.value, DEFAULT_STAT_COLORS.value),
    unit: asColor(src.unit, DEFAULT_STAT_COLORS.unit),
    iconBg: asColor(src.iconBg, DEFAULT_STAT_COLORS.iconBg),
    iconColor: asColor(src.iconColor, DEFAULT_STAT_COLORS.iconColor),
  }
}

function parseStatLocale(v: unknown): ImpactStatLocale {
  if (!isPlainObject(v)) return { label: '', value: '', unit: '' }
  return {
    label: asString(v.label),
    value: asString(v.value),
    unit: asString(v.unit),
  }
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

const seed = seedDocument as unknown as ImpactStatsDocumentV3

function migrateV2ToV3(v2: ImpactStatsDocumentV2): ImpactStatsDocumentV3 {
  const koStats = v2.locales.ko.stats
  const enById = new Map(v2.locales.en.stats.map((row) => [row.id, row]))
  return {
    version: 3,
    backgroundImageUrl: '',
    introColors: clone(seed.introColors),
    intro: clone(seed.intro),
    primaryCards: [
      {
        id: 'fund-use',
        colors: clone(DEFAULT_PRIMARY_COLORS),
        locales: {
          ko: {
            ...seed.primaryCards[0].locales.ko,
            donut: clone(v2.locales.ko.donut),
          },
          en: {
            ...seed.primaryCards[0].locales.en,
            donut: clone(v2.locales.en.donut),
          },
        },
      },
    ],
    stats: koStats.map((row) => {
      const en = enById.get(row.id)
      return {
        id: row.id.trim() || `stat-${row.id}`,
        icon: row.icon,
        colors: clone(DEFAULT_STAT_COLORS),
        locales: {
          ko: { label: row.label, value: row.value, unit: row.unit ?? '' },
          en: {
            label: en?.label ?? row.label,
            value: en?.value ?? row.value,
            unit: en?.unit ?? row.unit ?? '',
          },
        },
      }
    }),
  }
}

function migrateV1ToV3(v1: ImpactStatsDocumentV1): ImpactStatsDocumentV3 {
  return migrateV2ToV3({
    version: 2,
    locales: {
      ko: { donut: v1.donut, stats: v1.stats },
      en: clone(seed.primaryCards[0]
        ? {
            donut: seed.primaryCards[0].locales.en.donut,
            stats: seed.stats.map((row) => ({
              id: row.id,
              label: row.locales.en.label,
              value: row.locales.en.value,
              unit: row.locales.en.unit,
              icon: row.icon,
            })),
          }
        : { donut: v1.donut, stats: v1.stats }),
    },
  })
}

function parseDocumentV3(body: unknown): ImpactStatsDocumentV3 | null {
  if (!isPlainObject(body)) return null
  if (body.version !== 3) return null
  if (!isPlainObject(body.intro) || !Array.isArray(body.primaryCards) || !Array.isArray(body.stats)) return null

  const introColorsSrc = isPlainObject(body.introColors) ? body.introColors : {}
  const intro = {
    ko: parseIntroLocale(isPlainObject(body.intro) ? body.intro.ko : null, seed.intro.ko),
    en: parseIntroLocale(isPlainObject(body.intro) ? body.intro.en : null, seed.intro.en),
  }

  const primaryCards: ImpactPrimaryCard[] = []
  for (const raw of body.primaryCards) {
    if (!isPlainObject(raw)) continue
    const id = asString(raw.id).trim()
    if (!id) continue
    const localesRaw = isPlainObject(raw.locales) ? raw.locales : {}
    primaryCards.push({
      id,
      colors: parsePrimaryColors(raw.colors),
      locales: {
        ko: parsePrimaryLocale(localesRaw.ko, seed.primaryCards[0].locales.ko),
        en: parsePrimaryLocale(localesRaw.en, seed.primaryCards[0].locales.en),
      },
    })
  }

  const stats: ImpactStatItem[] = []
  for (const raw of body.stats) {
    if (!isPlainObject(raw)) continue
    const id = asString(raw.id).trim()
    if (!id) continue
    if (raw.icon != null && raw.icon !== '') {
      if (typeof raw.icon !== 'string' || !ICON_NAME_RE.test(raw.icon)) continue
    }
    const localesRaw = isPlainObject(raw.locales) ? raw.locales : {}
    stats.push({
      id,
      icon: typeof raw.icon === 'string' ? raw.icon : undefined,
      colors: parseStatColors(raw.colors),
      locales: {
        ko: parseStatLocale(localesRaw.ko),
        en: parseStatLocale(localesRaw.en),
      },
    })
  }

  return {
    version: 3,
    backgroundImageUrl: asString(body.backgroundImageUrl),
    introColors: {
      kicker: asColor(introColorsSrc.kicker, DEFAULT_INTRO_COLORS.kicker),
      title: asColor(introColorsSrc.title, DEFAULT_INTRO_COLORS.title),
      subtitle: asColor(introColorsSrc.subtitle, DEFAULT_INTRO_COLORS.subtitle),
      rotator: asColor(introColorsSrc.rotator, DEFAULT_INTRO_COLORS.rotator),
    },
    intro,
    primaryCards,
    stats,
  }
}

function isV2(body: unknown): body is ImpactStatsDocumentV2 {
  if (!isPlainObject(body) || body.version !== 2 || !isPlainObject(body.locales)) return false
  const ko = body.locales.ko
  const en = body.locales.en
  return isPlainObject(ko) && isPlainObject(en) && isPlainObject(ko.donut) && Array.isArray(ko.stats)
}

function isV1(body: unknown): body is ImpactStatsDocumentV1 {
  if (!isPlainObject(body) || body.version !== 1) return false
  return isPlainObject(body.donut) && Array.isArray(body.stats)
}

function normalizeDocument(body: unknown): ImpactStatsDocumentV3 {
  const v3 = parseDocumentV3(body)
  if (v3) return v3
  if (isV2(body)) return migrateV2ToV3(body)
  if (isV1(body)) return migrateV1ToV3(body)
  return clone(seed)
}

export function parseImpactLocale(raw: unknown): ImpactLocale {
  return raw === 'en' ? 'en' : 'ko'
}

export async function readImpactStatsDocument(): Promise<ImpactStatsDocumentV3> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    const normalized = normalizeDocument(parsed)
    if (parseDocumentV3(parsed) == null) {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
      await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8')
    }
    return normalized
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') console.warn('[impact-stats] read failed, using seed:', e)
  }
  return clone(seed)
}

export async function readImpactStatsForLocale(locale: ImpactLocale): Promise<ImpactStatsPublicView> {
  const doc = await readImpactStatsDocument()
  const bg = doc.backgroundImageUrl.trim() || DEFAULT_BG
  return {
    backgroundImageUrl: bg,
    introColors: doc.introColors,
    intro: doc.intro[locale],
    primaryCards: doc.primaryCards.map((card) => ({
      id: card.id,
      colors: card.colors,
      ...card.locales[locale],
    })),
    stats: doc.stats.map((row) => ({
      id: row.id,
      icon: row.icon,
      colors: row.colors,
      ...row.locales[locale],
    })),
  }
}

export async function writeImpactStatsDocument(body: unknown): Promise<void> {
  const normalized = parseDocumentV3(body)
  if (!normalized) {
    const err = new Error('Invalid impact stats payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  const previous = await readImpactStatsDocument()
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8')
  await deleteRemovedStoredMedia(previous, normalized)
}
