import { prisma } from '../utils/prisma'
import { hashPin, verifyPin } from '../utils/pinHash'

export const INQUIRY_TYPES = ['후원 문의', '봉사 참여', '사업 문의', '기타'] as const
export const INQUIRY_STATUSES = ['대기', '처리중', '완료'] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

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

function toPublic(row: {
  id: number
  name: string
  contact: string
  type: string
  subject: string
  body: string
  status: string
  reply: string
  createdAt: Date
  repliedAt: Date | null
}): InquiryPublic {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    type: row.type,
    subject: row.subject,
    body: row.body,
    status: row.status,
    reply: row.reply,
    createdAt: row.createdAt.toISOString(),
    repliedAt: row.repliedAt ? row.repliedAt.toISOString() : null,
  }
}

function toAdmin(row: {
  id: number
  name: string
  contact: string
  type: string
  subject: string
  body: string
  status: string
  reply: string
  memo: string
  createdAt: Date
  updatedAt: Date
  repliedAt: Date | null
}): InquiryAdmin {
  return {
    ...toPublic(row),
    memo: row.memo,
    updatedAt: row.updatedAt.toISOString(),
  }
}

function normalizeContact(raw: string): string {
  return raw.trim().replace(/\s+/g, '').toLowerCase()
}

export function validatePin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}

export const inquiriesService = {
  async create(input: {
    name: string
    contact: string
    pin: string
    type: string
    subject: string
    body: string
  }): Promise<InquiryPublic> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })

    const name = input.name.trim()
    const contact = normalizeContact(input.contact)
    const type = input.type.trim()
    const subject = input.subject.trim()
    const body = input.body.trim()
    const pin = input.pin.trim()

    if (!name || name.length > 80) throw Object.assign(new Error('이름을 확인해 주세요.'), { status: 400 })
    if (!contact || contact.length > 120) throw Object.assign(new Error('연락처(이메일 또는 전화)를 확인해 주세요.'), { status: 400 })
    if (!validatePin(pin)) throw Object.assign(new Error('비밀번호는 숫자 4~6자리여야 합니다.'), { status: 400 })
    if (!INQUIRY_TYPES.includes(type as InquiryType)) {
      throw Object.assign(new Error('문의 유형을 선택해 주세요.'), { status: 400 })
    }
    if (!subject || subject.length > 200) throw Object.assign(new Error('제목을 확인해 주세요.'), { status: 400 })
    if (!body || body.length > 5000) throw Object.assign(new Error('문의 내용을 확인해 주세요.'), { status: 400 })

    const pinHash = await hashPin(pin)
    const created = await prisma.inquiry.create({
      data: { name, contact, pinHash, type, subject, body, status: '대기' },
    })
    return toPublic(created)
  },

  async lookup(input: { name: string; contact: string; pin: string }): Promise<InquiryPublic[]> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })

    const name = input.name.trim()
    const contact = normalizeContact(input.contact)
    const pin = input.pin.trim()
    if (!name || !contact || !validatePin(pin)) {
      throw Object.assign(new Error('이름, 연락처, 비밀번호를 확인해 주세요.'), { status: 400 })
    }

    const candidates = await prisma.inquiry.findMany({
      where: { name, contact },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    const matched: InquiryPublic[] = []
    for (const row of candidates) {
      if (await verifyPin(pin, row.pinHash)) matched.push(toPublic(row))
    }
    return matched
  },

  async listAdmin(
    page = 1,
    perPage = 20,
    filters: { name?: string; contact?: string } = {},
  ): Promise<{ inquiries: InquiryAdmin[]; total: number }> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })
    const skip = Math.max(0, (page - 1) * perPage)
    const take = Math.min(50, Math.max(1, perPage))
    const nameQ = filters.name?.trim() ?? ''
    const contactQ = filters.contact?.trim().replace(/\s+/g, '') ?? ''
    const where: {
      name?: { contains: string; mode: 'insensitive' }
      contact?: { contains: string; mode: 'insensitive' }
    } = {}
    if (nameQ) where.name = { contains: nameQ, mode: 'insensitive' }
    if (contactQ) where.contact = { contains: contactQ.toLowerCase(), mode: 'insensitive' }
    const [total, rows] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ])
    return { inquiries: rows.map(toAdmin), total }
  },

  async getAdmin(id: number): Promise<InquiryAdmin | null> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })
    const row = await prisma.inquiry.findUnique({ where: { id } })
    return row ? toAdmin(row) : null
  },

  async updateAdmin(
    id: number,
    input: { status?: string; reply?: string; memo?: string },
  ): Promise<InquiryAdmin | null> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })
    const existing = await prisma.inquiry.findUnique({ where: { id } })
    if (!existing) return null

    const data: {
      status?: string
      reply?: string
      memo?: string
      repliedAt?: Date | null
    } = {}

    if (input.status != null) {
      const s = input.status.trim()
      if (!INQUIRY_STATUSES.includes(s as InquiryStatus)) {
        throw Object.assign(new Error('처리 상태가 올바르지 않습니다.'), { status: 400 })
      }
      data.status = s
    }
    if (input.reply != null) {
      data.reply = input.reply.trim().slice(0, 5000)
      data.repliedAt = data.reply ? new Date() : null
      if (data.reply && !data.status && existing.status === '대기') data.status = '처리중'
    }
    if (input.memo != null) data.memo = input.memo.trim().slice(0, 5000)

    const updated = await prisma.inquiry.update({ where: { id }, data })
    return toAdmin(updated)
  },

  async removeAdmin(id: number): Promise<boolean> {
    if (!prisma) throw Object.assign(new Error('Database unavailable'), { status: 503 })
    const existing = await prisma.inquiry.findUnique({ where: { id } })
    if (!existing) return false
    await prisma.inquiry.delete({ where: { id } })
    return true
  },
}
