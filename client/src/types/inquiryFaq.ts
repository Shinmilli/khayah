export type InquiryFaqItem = {
  id: string
  question: string
  answer: string
  published: boolean
  order: number
}

export type InquiryFaqLocaleContent = {
  items: InquiryFaqItem[]
}

export type InquiryFaqDocument = {
  version: 2
  locales: {
    ko: InquiryFaqLocaleContent
    en: InquiryFaqLocaleContent
  }
}

/** 공개 API 응답 */
export type InquiryFaqPublicDocument = {
  version: 2
  items: InquiryFaqItem[]
}

export type InquiryFaqEditLocale = 'ko' | 'en'

export const DEFAULT_INQUIRY_FAQ: InquiryFaqDocument = {
  version: 2,
  locales: {
    ko: { items: [] },
    en: { items: [] },
  },
}
