import { Link, useLocation } from 'react-router-dom'

interface PageHeroProps {
  title: string
  /** 배경 이미지 URL. 미지정 시 플레이스홀더 배경을 사용합니다. */
  backgroundImageUrl?: string | null
  /** 배너 아래 현재 위치(Breadcrumb) 표시 */
  showBreadcrumbs?: boolean
  /** 하단 스크롤 유도 라인 애니메이션 */
  showScrollHint?: boolean
  /** 경로 대신 직접 지정 (게시글 상세 등) */
  crumbs?: Array<{ label: string; to: string }>
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function encodePathSegments(segments: string[]): string {
  return '/' + segments.map((s) => encodeURIComponent(s)).join('/')
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

  /** 후원 섹션: 공개 URL은 `/후원/…`. 구 `후원가이드`·`후원자가이드` 경로는 브레드크럼에서 캐논 링크로 표시 */
  if (parts[0] === '후원' || parts[0] === '후원가이드' || parts[0] === '후원자가이드') {
    const supportHub = '/후원/후원-안내'
    const guideLabels: Record<string, string> = {
      '후원-안내': '후원 안내',
      '후원자-가이드': '후원 안내',
      '후원신청': '후원신청',
      '정기후원': '정기후원',
      '일시후원': '일시후원',
      '물품후원': '물품후원',
      '자원봉사': '자원봉사',
    }
    const crumbs: Array<{ label: string; to: string }> = [{ label: '후원', to: supportHub }]
    if (parts[1]) {
      const seg = parts[1]
      const canonicalSeg = seg === '후원자-가이드' ? '후원-안내' : seg
      crumbs.push({
        label: guideLabels[seg] ?? guideLabels[canonicalSeg] ?? seg,
        to: encodePathSegments(['후원', canonicalSeg]),
      })
    }
    return crumbs
  }

  // 소식 하위: 첫 crumb「소식」은 헤더 주요 메뉴와 같이 스토리 허브로 연결
  if (parts[0] === '소식') {
    const crumbs: Array<{ label: string; to: string }> = [{ label: '소식', to: '/stories' }]
    if (parts[1]) {
      const seg = parts[1]
      crumbs.push({
        label: mapNewsSegment(seg),
        to: encodePathSegments(['소식', mapNewsToPath(seg)]),
      })
    }
    if (parts[2]) {
      crumbs.push({ label: '상세', to: pathname })
    }
    return crumbs
  }

  /** 카야: 헤더 상위 메뉴와 동일 「카야」> 하위 (라벨은 헤더 서브메뉴 기준) */
  if (parts[0] === '카야') {
    const khayahHub = '/카야/카야소개'
    const khayahLabels: Record<string, string> = {
      '카야소개': '카야 소개',
      '카야-스토리': '인사말',
      '카야-연혁': '연혁',
      '위치안내': '오시는 길',
      '핵심사업': '핵심사업',
    }
    const crumbs: Array<{ label: string; to: string }> = [{ label: '카야', to: khayahHub }]
    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i]
      crumbs.push({
        label: khayahLabels[seg] ?? seg,
        to: encodePathSegments(parts.slice(0, i + 1)),
      })
    }
    return crumbs
  }

  /** 국내·해외 사업: 첫 crumb「사업」은 국내사업으로 (헤더 주요 메뉴와 동일) */
  if (parts[0] === '국내사업' || parts[0] === '해외사업') {
    const businessHub = '/국내사업'
    const rootLabel = parts[0] === '국내사업' ? '국내사업' : '해외사업'
    const crumbs: Array<{ label: string; to: string }> = [
      { label: '사업', to: businessHub },
      { label: rootLabel, to: encodePathSegments([parts[0]]) },
    ]
    for (let i = 2; i < parts.length; i++) {
      crumbs.push({
        label: parts[i],
        to: encodePathSegments(parts.slice(0, i + 1)),
      })
    }
    return crumbs
  }

  /** /사업/진행사업 등 */
  if (parts[0] === '사업') {
    const crumbs: Array<{ label: string; to: string }> = [{ label: '사업', to: '/국내사업' }]
    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i]
      crumbs.push({
        label: seg,
        to: encodePathSegments(parts.slice(0, i + 1)),
      })
    }
    return crumbs
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
  crumbs: crumbsProp,
}: PageHeroProps) {
  const location = useLocation()
  const crumbs =
    crumbsProp && crumbsProp.length > 0 ? crumbsProp : buildCrumbs(location.pathname)

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
              <span key={`${c.to}-${idx}`} className="page-crumbs__item">
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

