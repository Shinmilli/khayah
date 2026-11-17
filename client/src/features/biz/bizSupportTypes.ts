export type BizSection = {
  id: string
  page: string
  order: number
  enabled: boolean
}

export type BizMenuItem = {
  key: string
  order: number
}

export type BizSupportDocument = {
  version: 1
  fields: Record<string, string>
  sections: BizSection[]
  menu: BizMenuItem[]
  otherBusiness: 'manual' | 'auto'
  grantsPublic: boolean
  donate: { url: string; labelKo: string; menuLabel: string; receiptNote: string; inquiry: string; impactEnabled: boolean }
}
