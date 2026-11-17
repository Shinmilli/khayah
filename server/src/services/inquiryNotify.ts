import type { InquiryPublic } from './inquiriesService'

/** SMTP가 있으면 기관 메일로 문의 알림을 보낸다. 설정이 없거나 실패해도 문의 저장은 유지한다. */
export async function notifyInquiry(inquiry: InquiryPublic): Promise<void> {
  const host = process.env.SMTP_HOST?.trim()
  const to = process.env.INQUIRY_NOTIFY_TO?.trim() || 'khayahinternational@gmail.com'
  if (!host) return
  const nodemailer = await import('nodemailer')
  const port = Number(process.env.SMTP_PORT || 587)
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
      : undefined,
  })
  await transporter.sendMail({
    from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER || to,
    to,
    subject: `[카야 문의] ${inquiry.subject}`,
    text: [`유형: ${inquiry.type}`, `이름: ${inquiry.name}`, `연락처: ${inquiry.contact}`, '', inquiry.body].join('\n'),
  })
}
