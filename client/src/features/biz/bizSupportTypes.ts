import type { BizPageBlock } from './pageBlockTypes'

export type { BizPageBlock }

export type BizSection = {
  id: string
  page: string
  order: number
  enabled: boolean
}

export type BizMenuItem = {
  key: string
  order: number
  label?: string
  labelEn?: string
  target?: string
  tabs?: string
}

export type BizArchiveItem = {
  id: string
  name: string
  status: string
  memo: string
}

export type BizPanel = {
  id: string
  order: number
  enabled: boolean
  removed?: boolean
}

export type BizSupportDocument = {
  version: 1
  fields: Record<string, string>
  sections: BizSection[]
  menu: BizMenuItem[]
  otherBusiness: 'manual' | 'auto'
  otherTitle: string
  titleLimit: string
  lineLimit: string
  archive: BizArchiveItem[]
  layout?: BizPanel[]
  grantsPublic: boolean
  donate: {
    url: string
    labelKo: string
    menuLabel: string
    receiptNote: string
    inquiry: string
    impactEnabled: boolean
    openBlank?: boolean
    impactTitle?: string
    impactScope?: 'all' | 'country'
    impactCountry?: string
    impactMetrics?: string
    menuPin?: 'on' | 'off' | 'site'
    showFloating?: boolean
  }
  blocks?: BizPageBlock[]
}
