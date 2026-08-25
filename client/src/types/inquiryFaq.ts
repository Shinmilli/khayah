export type InquiryFaqItem = {
  id: string
  question: string
  answer: string
  published: boolean
  order: number
}

export type InquiryFaqDocument = {
  version: 1
  items: InquiryFaqItem[]
}
