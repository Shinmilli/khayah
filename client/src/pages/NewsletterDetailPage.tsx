import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import '../styles/newsletter.css'

type NewsletterItem = {
  id: string
  title: string
  content: string
  pdfUrl?: string
}

const NEWSLETTER_DETAIL: NewsletterItem[] = [
  {
    id: 'why-compassion-2026',
    title: '[WHY 캠패션] 어린이의 마음이 보이는 사람',
    content:
      '소아우울증으로 고통의 바다에 있는 어린이들을 위해, 비비안나는 어린이센터의 어린이 보호 담당자이자 임상심리사로서 어린이가 마음까지 건강하게 자랄 수 있도록 끝까지 함께 걸고 있습니다.',
    pdfUrl: '/uploads/sample.pdf',
  },
  {
    id: 'yearly-2025',
    title: '2025 연간 소식지',
    content:
      '카야의 2025년 활동을 한 권에 담았습니다. 주요 현장과 변화의 기록을 확인하세요. (PDF 보기 버튼으로 원문을 확인할 수 있습니다.)',
    pdfUrl: '/uploads/sample.pdf',
  },
]

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6 2h8l4 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 2v4h4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14h10M7 18h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function NewsletterDetailPage() {
  const params = useParams()
  const id = params.id ?? ''

  const item = useMemo(() => NEWSLETTER_DETAIL.find((x) => x.id === id) ?? null, [id])

  if (!item) {
    return (
      <div className="page-content-wrapper newsletter-page">
        <PageHero title="연간소식지" />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <p>연간소식지를 찾을 수 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper newsletter-page">
      <PageHero title="연간소식지" />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <article className="newsletter-detail">
              <h1 className="newsletter-detail__title">{item.title}</h1>
              <p className="newsletter-detail__content">{item.content}</p>
              {item.pdfUrl ? (
                <a className="newsletter-pdf-btn" href={item.pdfUrl} target="_blank" rel="noreferrer">
                  <PdfIcon />
                  PDF 보기
                </a>
              ) : null}
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

