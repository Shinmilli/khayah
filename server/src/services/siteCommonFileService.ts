import { readDrafted, writeDrafted, type SaveMode } from './documentDraft'
import { readJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'site-common'
const NANUM = 'https://www.ihappynanum.com/Nanum/B/RAA98AKVRQ'

export type SiteOrg = {
  nameKo: string
  nameEn: string
  representative: string
  registrationNo: string
  addressKo: string
  addressEn: string
  phoneFax: string
  email: string
  accounts: string
}

export type SiteFooterLink = {
  id: string
  order: number
  enabled: boolean
  labelKo: string
  labelEn: string
  href: string
}

export type SitePartner = {
  id: string
  order: number
  enabled: boolean
  logo: string
  nameKo: string
  nameEn: string
  kind: string
  href: string
}

export type SiteClicker = {
  id: 'kakao' | 'instagram' | 'blog' | 'donate'
  order: number
  enabled: boolean
  labelKo: string
  href: string
}

export type SiteSlogan = {
  id: string
  order: number
  text: string
}

export type SiteCommonDocument = {
  version: 1
  homeStories: {
    featured: string
    rest: 'auto' | 'manual'
    manual: string[]
    blog: { image: string; href: string }
    instagram: { image: string; href: string }
    youtube: { image: string; href: string }
  }
  org: SiteOrg
  footerLinks: SiteFooterLink[]
  partners: SitePartner[]
  clickers: SiteClicker[]
  headerDonate: { labelKo: string; pinned: boolean }
  logo: {
    imageKo: string
    imageEn: string
    rotate: boolean
    intervalSec: number
    slogansKo: SiteSlogan[]
    sloganEn: string
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function text(v: unknown, fallback = '', max = 400): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : fallback
}

function flag(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

const PARTNERS: Array<Omit<SitePartner, 'order' | 'enabled' | 'nameEn' | 'kind' | 'href'>> = [
  { id: 'p1', logo: '/images/Home/parteners/partner-1.png', nameKo: '협력기관 로고 1' },
  { id: 'p2', logo: '/images/Home/parteners/partner-2.png', nameKo: '협력기관 로고 2' },
  { id: 'p3', logo: '/images/Home/parteners/partner-3.png', nameKo: '바보의나눔' },
  { id: 'p4', logo: '/images/Home/parteners/partner-4.png', nameKo: '협력기관 로고 4' },
  { id: 'p5', logo: '/images/Home/parteners/partner-5.png', nameKo: '협력기관 로고 5' },
  { id: 'p6', logo: '/images/Home/parteners/hankook-cns.png', nameKo: '한국C&S' },
  { id: 'p7', logo: '/images/Home/parteners/lh.png', nameKo: 'LH 한국토지주택공사' },
  { id: 'p8', logo: '/images/Home/parteners/ona-creation.png', nameKo: 'ONA CREATION' },
  { id: 'p9', logo: '/images/Home/parteners/nanum-dream.png', nameKo: '나눔과꿈' },
  { id: 'p10', logo: '/images/Home/parteners/natural-core.png', nameKo: '네츄럴코어' },
  { id: 'p11', logo: '/images/Home/parteners/maepyo.png', nameKo: '매표화학' },
  { id: 'p12', logo: '/images/Home/parteners/samsung.png', nameKo: '삼성' },
  { id: 'p13', logo: '/images/Home/parteners/seoul.png', nameKo: '서울특별시' },
  { id: 'p14', logo: '/images/Home/parteners/juno-hair.png', nameKo: '준오헤어' },
  { id: 'p15', logo: '/images/Home/parteners/koica.png', nameKo: '코이카' },
  { id: 'p16', logo: '/images/Home/parteners/bishkek.png', nameKo: '비슈케크' },
  { id: 'p17', logo: '/images/Home/parteners/ala-too.png', nameKo: '알라투대학교' },
  { id: 'p18', logo: '/images/Home/parteners/tongil-nanum.png', nameKo: '통일과나눔' },
  { id: 'p19', logo: '/images/Home/parteners/sorsogon.png', nameKo: '소르소곤 주립대학교' },
  { id: 'p20', logo: '/images/Home/parteners/happybean.png', nameKo: '해피빈' },
  { id: 'p21', logo: '/images/Home/parteners/hwang-namgi.png', nameKo: '황남기 합격캠프' },
]

export function defaultSiteCommonDocument(): SiteCommonDocument {
  return {
    version: 1,
    homeStories: {
      featured: '',
      rest: 'auto',
      manual: ['', '', ''],
      blog: { image: '', href: '' },
      instagram: { image: '', href: '' },
      youtube: { image: '', href: '' },
    },
    org: {
      nameKo: '사단법인 카야인터내셔널',
      nameEn: '',
      representative: '최순태',
      registrationNo: '',
      addressKo: '경기도 성남시 분당구 이매동 81-3 (방아로 38) 3층',
      addressEn: '',
      phoneFax: 'T 070.5121.2198 | F 070.8650.3639',
      email: 'khayahinternational@gmail.com',
      accounts:
        '우리 1005-403-029492\n농협 301-1122-4444-01\n국민 584101-01-286346\n신한 100-034-744590\n예금주 (사)카야인터내셔널',
    },
    footerLinks: [
      { id: 'donate', order: 1, enabled: true, labelKo: '후원신청', labelEn: '', href: NANUM },
      { id: 'projects', order: 2, enabled: true, labelKo: '사업소개', labelEn: '', href: '/business/domestic' },
      { id: 'location', order: 3, enabled: true, labelKo: '위치안내', labelEn: '', href: '/about/location' },
      { id: 'instagram', order: 4, enabled: true, labelKo: '인스타그램', labelEn: '', href: 'https://www.instagram.com/khayah_international' },
      { id: 'blog', order: 5, enabled: true, labelKo: '블로그', labelEn: '', href: 'https://blog.naver.com/khayah' },
      { id: 'kakao', order: 6, enabled: true, labelKo: '카카오채널', labelEn: '', href: 'https://pf.kakao.com/_TnWKK' },
      { id: 'acrc', order: 7, enabled: true, labelKo: '국민권익위원회', labelEn: '', href: 'https://www.acrc.go.kr/' },
    ],
    partners: PARTNERS.map((p, i) => ({
      ...p,
      order: i + 1,
      enabled: true,
      nameEn: '',
      kind: '',
      href: '',
    })),
    clickers: [
      { id: 'kakao', order: 1, enabled: true, labelKo: '카카오톡', href: 'https://pf.kakao.com/_TnWKK' },
      { id: 'instagram', order: 2, enabled: true, labelKo: '인스타그램', href: 'https://www.instagram.com/khayah_international' },
      { id: 'blog', order: 3, enabled: true, labelKo: '네이버 블로그', href: 'https://blog.naver.com/khayah' },
      { id: 'donate', order: 4, enabled: true, labelKo: '후원하기', href: NANUM },
    ],
    headerDonate: { labelKo: '후원하기', pinned: true },
    logo: {
      imageKo: '/images/logo/khayah_logo.png',
      imageEn: '',
      rotate: true,
      intervalSec: 3,
      slogansKo: [{ id: 's1', order: 1, text: '사람을 키우고 섬기는 개발 NGO' }],
      sloganEn: '',
    },
  }
}

function normalize(body: unknown): SiteCommonDocument {
  const base = defaultSiteCommonDocument()
  if (!isPlainObject(body)) return base
  const stories = isPlainObject(body.homeStories) ? body.homeStories : {}
  const channel = (value: unknown, fallback: { image: string; href: string }) => {
    const row = isPlainObject(value) ? value : {}
    return { image: text(row.image, fallback.image, 400), href: text(row.href, fallback.href, 400) }
  }
  base.homeStories = {
    featured: text(stories.featured, '', 120),
    rest: stories.rest === 'manual' ? 'manual' : 'auto',
    manual: (Array.isArray(stories.manual) ? stories.manual : ['', '', '']).slice(0, 3).map((row) => text(row, '', 120)),
    blog: channel(stories.blog, base.homeStories.blog),
    instagram: channel(stories.instagram, base.homeStories.instagram),
    youtube: channel(stories.youtube, base.homeStories.youtube),
  }
  const org = isPlainObject(body.org) ? body.org : {}
  base.org = {
    nameKo: text(org.nameKo, base.org.nameKo, 80),
    nameEn: text(org.nameEn, '', 80),
    representative: text(org.representative, base.org.representative, 40),
    registrationNo: text(org.registrationNo, '', 40),
    addressKo: text(org.addressKo, base.org.addressKo, 200),
    addressEn: text(org.addressEn, '', 200),
    phoneFax: text(org.phoneFax, base.org.phoneFax, 80),
    email: text(org.email, base.org.email, 120),
    accounts: text(org.accounts, base.org.accounts, 800),
  }
  if (Array.isArray(body.footerLinks)) {
    base.footerLinks = body.footerLinks.slice(0, 20).map((row, i) => {
      const item = isPlainObject(row) ? row : {}
      return {
        id: text(item.id, `fl-${i + 1}`, 40) || `fl-${i + 1}`,
        order: num(item.order, i + 1),
        enabled: flag(item.enabled, true),
        labelKo: text(item.labelKo, '', 40),
        labelEn: text(item.labelEn, '', 80),
        href: text(item.href, '', 400),
      }
    })
  }
  if (Array.isArray(body.partners)) {
    base.partners = body.partners.slice(0, 40).map((row, i) => {
      const item = isPlainObject(row) ? row : {}
      return {
        id: text(item.id, `p-${i + 1}`, 40) || `p-${i + 1}`,
        order: num(item.order, i + 1),
        enabled: flag(item.enabled, true),
        logo: text(item.logo, '', 400),
        nameKo: text(item.nameKo, '', 80),
        nameEn: text(item.nameEn, '', 80),
        kind: text(item.kind, '', 80),
        href: text(item.href, '', 400),
      }
    })
  }
  const clickerIds = ['kakao', 'instagram', 'blog', 'donate'] as const
  const incoming = Array.isArray(body.clickers) ? body.clickers : []
  base.clickers = clickerIds.map((id, i) => {
    const found = incoming.find((row) => isPlainObject(row) && row.id === id)
    const item = isPlainObject(found) ? found : {}
    const fallback = base.clickers.find((c) => c.id === id)!
    return {
      id,
      order: num(item.order, fallback.order ?? i + 1),
      enabled: flag(item.enabled, fallback.enabled),
      labelKo: text(item.labelKo, fallback.labelKo, 40),
      href: text(item.href, fallback.href, 400),
    }
  })
  const header = isPlainObject(body.headerDonate) ? body.headerDonate : {}
  base.headerDonate = {
    labelKo: text(header.labelKo, base.headerDonate.labelKo, 20) || base.headerDonate.labelKo,
    pinned: flag(header.pinned, true),
  }
  const logo = isPlainObject(body.logo) ? body.logo : {}
  const slogans = Array.isArray(logo.slogansKo) ? logo.slogansKo : base.logo.slogansKo
  base.logo = {
    imageKo: text(logo.imageKo, base.logo.imageKo, 400),
    imageEn: text(logo.imageEn, '', 400),
    rotate: flag(logo.rotate, true),
    intervalSec: Math.min(30, Math.max(1, Math.round(num(logo.intervalSec, 3)))),
    slogansKo: slogans.slice(0, 8).map((row, i) => {
      const item = isPlainObject(row) ? row : {}
      return {
        id: text(item.id, `s-${i + 1}`, 40) || `s-${i + 1}`,
        order: num(item.order, i + 1),
        text: text(item.text, '', 20),
      }
    }),
    sloganEn: text(logo.sloganEn, '', 20),
  }
  return base
}

export async function readSiteCommonDocument(): Promise<SiteCommonDocument> {
  try {
    const parsed = await readJsonDocument(DOCUMENT_KEY)
    return normalize(parsed)
  } catch (e) {
    const status = (e as Error & { status?: number }).status
    if (status === 404) return defaultSiteCommonDocument()
    throw e
  }
}

export function readSiteCommonState(preferDraft: boolean) {
  return readDrafted(DOCUMENT_KEY, readSiteCommonDocument, preferDraft)
}

export async function writeSiteCommonDocument(body: unknown, mode: SaveMode = 'publish'): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid site common payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeDrafted(DOCUMENT_KEY, normalize(body), mode)
}
