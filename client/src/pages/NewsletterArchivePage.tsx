import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import '../styles/newsletter.css'

type NewsletterItem = {
  id: string
  title: string
  excerpt: string
  coverImageUrl?: string
  pdfUrl?: string
}

const NEWSLETTERS: NewsletterItem[] = [
  {
    id: 'why-compassion-2026',
    title: '[WHY 캠패션] 어린이의 마음이 보이는 사람',
    excerpt:
      '소아우울증으로 고통의 바다에 있는 어린이들을 위해, 비비안나는 어린이센터의 어린이 보호 담당자이자 임상심리사로서…',
    coverImageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=700&fit=crop',
    pdfUrl: '/uploads/sample.pdf',
  },
  {
    id: 'yearly-2025',
    title: '2025 연간 소식지',
    excerpt: '카야의 2025년 활동을 한 권에 담았습니다. 주요 현장과 변화의 기록을 확인하세요.',
    coverImageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1200&h=700&fit=crop',
    pdfUrl: '/uploads/sample.pdf',
  },
]

export function NewsletterArchivePage() {
  return (
    <div className="page-content-wrapper newsletter-page">
      <PageHero title="연간소식지" />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <div className="newsletter-archive">
              <ul className="newsletter-list" aria-label="연간소식지 목록">
                {NEWSLETTERS.map((n) => (
                  <li key={n.id} className="newsletter-item">
                    <Link to={`/소식/연간소식지/${encodeURIComponent(n.id)}`} className="newsletter-link">
                      <div className="newsletter-thumb" aria-hidden="true">
                        {n.coverImageUrl ? <img src={n.coverImageUrl} alt="" loading="lazy" /> : null}
                      </div>
                      <div className="newsletter-body">
                        <h2 className="newsletter-title">{n.title}</h2>
                        <p className="newsletter-excerpt">{n.excerpt}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="newsletter-hint">업로드 날짜는 표시하지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

