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

export type SiteClickerId = 'kakao' | 'instagram' | 'blog' | 'donate'

export type SiteClicker = {
  id: SiteClickerId
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

export type SiteHomeChannel = { image: string; href: string }

export type SiteCommonDocument = {
  version: 1
  homeStories: {
    featured: string
    rest: 'auto' | 'manual'
    manual: string[]
    blog: SiteHomeChannel
    instagram: SiteHomeChannel
    youtube: SiteHomeChannel
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
