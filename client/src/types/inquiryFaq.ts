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
  /** 끄면 문의 페이지에서 FAQ 탭 자체가 숨겨진다. 항목 공개와 별개다. */
  enabled: boolean
  locales: {
    ko: InquiryFaqLocaleContent
    en: InquiryFaqLocaleContent
  }
}

/** 공개 API 응답 */
export type InquiryFaqPublicDocument = {
  version: 2
  enabled: boolean
  items: InquiryFaqItem[]
}

export type InquiryFaqEditLocale = 'ko' | 'en'

export const DEFAULT_INQUIRY_FAQ: InquiryFaqDocument = {
  version: 2,
  enabled: false,
  locales: {
    ko: { items: [] },
    en: { items: [] },
  },
}
