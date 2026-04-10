import { Link, useLocation } from 'react-router-dom'

interface PageHeroProps {
  title: string
  /** 배경 이미지 URL. 미지정 시 플레이스홀더 배경을 사용합니다. */
  backgroundImageUrl?: string | null
  /** 배너 아래 현재 위치(Breadcrumb) 표시 */
  showBreadcrumbs?: boolean
  /** 하단 스크롤 유도 라인 애니메이션 */
  showScrollHint?: boolean
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function buildCrumbs(pathname: string): Array<{ label: string; to: string }> {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return []

  const parts = trimmed.split('/').map(safeDecode).filter(Boolean)

  // 게시글 상세(/posts/:slug)는 slug가 의미 없는 경우가 많아 제목 대신 "상세"로 표시
  if (parts[0] === 'posts') {
    const base = [{ label: 'posts', to: '/posts' }]
    if (parts.length > 1) base.push({ label: '상세', to: pathname })
    return base
  }

  const crumbs: Array<{ label: string; to: string }> = []
  let acc = ''
  for (const label of parts) {
    acc += `/${encodeURIComponent(label)}`
    crumbs.push({ label, to: acc })
  }
  return crumbs
}

export function PageHero({
  title,
  backgroundImageUrl = null,
  showBreadcrumbs = true,
  showScrollHint = true,
}: PageHeroProps) {
  const location = useLocation()
  const crumbs = buildCrumbs(location.pathname)

  return (
    <>
      <section className="page-hero" aria-label="페이지 상단 배너">
        <div
          className={`page-hero__bg${backgroundImageUrl ? ' has-image' : ''}`}
          style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')` } : undefined}
          aria-hidden="true"
        />
        <div className="page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
        </div>
        {showScrollHint && (
          <div className="page-hero__scroll" aria-hidden="true">
            <div className="page-hero__scroll-line" />
            <span className="page-hero__scroll-label">Scroll</span>
          </div>
        )}
      </section>

      {showBreadcrumbs && (
        <nav className="page-crumbs" aria-label="현재 위치">
          <div className="page-crumbs__inner">
            <Link to="/" className="page-crumbs__link page-crumbs__home" aria-label="홈">
              H
            </Link>
            {crumbs.map((c, idx) => (
              <span key={c.to} className="page-crumbs__item">
                <span className="page-crumbs__sep" aria-hidden="true">
                  ›
                </span>
                {idx === crumbs.length - 1 ? (
                  <span className="page-crumbs__current" aria-current="page">
                    {c.label}
                  </span>
                ) : (
                  <Link to={c.to} className="page-crumbs__link">
                    {c.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
        </nav>
      )}
    </>
  )
}

