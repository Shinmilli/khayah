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

  const mapNewsSegment = (s: string): string => {
    switch (s) {
      case '카야소식':
        return '활동소식'
      case '소식지':
        return '연간소식지'
      default:
        return s
    }
  }

  const mapNewsToPath = (s: string): string => {
    switch (s) {
      case '카야소식':
        return '활동소식'
      case '소식지':
        return '연간소식지'
      default:
        return s
    }
  }

  // Friendly labels for story routes (avoid showing "stories/domestic" etc.)
  if (parts[0] === 'stories') {
    const mapScope = (s: string): string => {
      switch (s) {
        case 'domestic':
          return '국내'
        case 'overseas':
          return '해외'
        case 'advocacy':
          return '옹호'
        case 'support':
          return '지원'
        default:
          return s
      }
    }
    const crumbs: Array<{ label: string; to: string }> = [{ label: '스토리', to: '/stories' }]
    if (parts[1]) {
      crumbs.push({ label: mapScope(parts[1]), to: `/stories/${encodeURIComponent(parts[1])}` })
    }
    return crumbs
  }

  // Friendly labels for news routes
  if (parts[0] === '소식') {
    const crumbs: Array<{ label: string; to: string }> = [{ label: '소식', to: '/소식' }]
    if (parts[1]) {
      const seg = parts[1]
      crumbs.push({ label: mapNewsSegment(seg), to: `/소식/${encodeURIComponent(mapNewsToPath(seg))}` })
    }
    if (parts[2]) {
      // detail pages keep last segment as-is
      crumbs.push({ label: '상세', to: pathname })
    }
    return crumbs
  }

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
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"
                  fill="currentColor"
                />
              </svg>
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

