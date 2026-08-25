export type InquiryStatus = '대기' | '처리중' | '완료'

export type InquiryType = '후원 문의' | '봉사 참여' | '사업 문의' | '기타'

export const INQUIRY_TYPES: InquiryType[] = ['후원 문의', '봉사 참여', '사업 문의', '기타']

export type InquiryPublic = {
  id: number
  name: string
  contact: string
  type: string
  subject: string
  body: string
  status: string
  reply: string
  createdAt: string
  repliedAt: string | null
}

export type InquiryAdmin = InquiryPublic & {
  memo: string
  updatedAt: string
}
