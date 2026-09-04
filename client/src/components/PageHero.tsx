import { Link, useLocation } from 'react-router-dom'
import { splitLocalePath } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import type { Messages } from '../i18n/messages/ko'
import { PATH } from '../i18n/routes'

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

function labelForSlug(seg: string, messages: Messages): string {
  const { nav } = messages
  switch (seg) {
    case 'news':
      return nav.top.news
    case 'inquiry':
      return nav.links.inquiry
    case 'announcements':
      return nav.links.announcements
    case 'activities':
      return nav.links.activities
    case 'newsletter':
      return nav.links.newsletter
    case 'press':
      return nav.links.press
    case 'financial-report':
      return nav.links.financialReport
    case 'stories':
      return nav.links.stories
    case 'about':
      return nav.top.khayah
    case 'khayah':
      return nav.links.aboutKhayah
    case 'greeting':
      return nav.links.greeting
    case 'history':
      return nav.links.history
    case 'location':
      return nav.links.location
    case 'business':
      return nav.top.business
    case 'domestic':
      return nav.links.domestic
    case 'overseas':
      return nav.links.overseas
    case 'advocacy':
      return nav.links.advocacy
    case 'projects':
      return nav.links.projects
    case 'education':
      return nav.links.domesticEducation
    case 'health-care':
      return nav.links.overseasHealth
    case 'support':
      return nav.top.support
    case 'guide':
      return nav.links.supportGuide
    case 'apply':
      return messages.footer.topLinks.donate
    case 'org-chart':
    case 'org':
      return nav.links.org
    case 'directors':
      return nav.links.org
    case 'nepal':
      return messages.pages.projects.regions.nepal
    case 'myanmar':
      return messages.pages.projects.regions.myanmar
    case 'kyrgyzstan':
      return messages.pages.projects.regions.kyrgyzstan
    default:
      return seg
  }
}

function buildCrumbs(
  pathname: string,
  messages: Messages,
  localize: (path: string) => string,
): Array<{ label: string; to: string }> {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const trimmed = pathnameWithoutLocale.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return []

  const parts = trimmed.split('/').map(safeDecode).filter(Boolean)
  const L = (path: string) => localize(path)

  const mapNewsSegment = (s: string): string => {
    switch (s) {
      case '카야소식':
        return messages.nav.links.activities
      case '소식지':
        return messages.nav.links.newsletter
      case '1대1문의':
      case '고객문의':
        return messages.nav.links.inquiry
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
      case '1대1문의':
        return '고객문의'
      default:
        return s
    }
  }

  if (parts[0] === 'stories') {
    const mapScope = (s: string): string => {
      const scopes = messages.pages.stories.scopes
      switch (s) {
        case 'domestic':
          return scopes.domestic
        case 'overseas':
          return scopes.overseas
        case 'advocacy':
          return scopes.advocacy
        case 'support':
          return scopes.support
        default:
          return s
      }
    }
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.links.stories, to: L('/stories') },
    ]
    if (parts[1]) {
      crumbs.push({ label: mapScope(parts[1]), to: L(`/stories/${encodeURIComponent(parts[1])}`) })
    }
    return crumbs
  }

  if (parts[0] === '후원' || parts[0] === '후원가이드' || parts[0] === '후원자가이드') {
    const supportHub = L(`/${PATH.supportGuide}`)
    const guideLabels: Record<string, string> = {
      '후원-안내': messages.nav.links.supportGuide,
      '후원자-가이드': messages.nav.links.supportGuide,
      후원신청: messages.footer.topLinks.donate,
    }
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.support, to: supportHub },
    ]
    if (parts[1]) {
      const seg = parts[1]
      const canonicalSeg = seg === '후원자-가이드' ? '후원-안내' : seg
      crumbs.push({
        label: guideLabels[seg] ?? guideLabels[canonicalSeg] ?? seg,
        to: L(encodePathSegments(['후원', canonicalSeg])),
      })
    }
    return crumbs
  }

  if (parts[0] === '소식') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.news, to: L('/stories') },
    ]
    if (parts[1]) {
      const seg = parts[1]
      crumbs.push({
        label: mapNewsSegment(seg),
        to: L(encodePathSegments(['소식', mapNewsToPath(seg)])),
      })
    }
    if (parts[2]) {
      crumbs.push({ label: parts[2], to: pathname })
    }
    return crumbs
  }

  if (parts[0] === '카야') {
    const khayahHub = L(`/${PATH.aboutKhayah}`)
    const khayahLabels: Record<string, string> = {
      카야소개: messages.nav.links.aboutKhayah,
      '카야-스토리': messages.nav.links.greeting,
      '카야-연혁': messages.nav.links.history,
      위치안내: messages.nav.links.location,
    }
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.khayah, to: khayahHub },
    ]
    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i]
      crumbs.push({
        label: khayahLabels[seg] ?? seg,
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  if (parts[0] === '국내사업' || parts[0] === '해외사업') {
    const businessHub = L(`/${PATH.businessDomestic}`)
    const rootLabel =
      parts[0] === '국내사업' ? messages.nav.links.domestic : messages.nav.links.overseas
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.business, to: businessHub },
      { label: rootLabel, to: L(encodePathSegments([parts[0]])) },
    ]
    for (let i = 2; i < parts.length; i++) {
      crumbs.push({
        label: parts[i],
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  if (parts[0] === '사업') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.business, to: L(`/${PATH.businessDomestic}`) },
    ]
    for (let i = 1; i < parts.length; i++) {
      crumbs.push({
        label: parts[i],
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  // English slug paths: /news/inquiry, /about/khayah, /business/...
  if (parts[0] === 'news') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.news, to: L('/stories') },
    ]
    if (parts[1]) {
      crumbs.push({
        label: labelForSlug(parts[1], messages),
        to: L(encodePathSegments(parts.slice(0, 2))),
      })
    }
    if (parts[2]) {
      crumbs.push({ label: parts[2], to: L(pathnameWithoutLocale) })
    }
    return crumbs
  }

  if (parts[0] === 'about') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.khayah, to: L(`/${PATH.aboutKhayah}`) },
    ]
    for (let i = 1; i < parts.length; i++) {
      crumbs.push({
        label: labelForSlug(parts[i], messages),
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  if (parts[0] === 'business') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.business, to: L(`/${PATH.businessDomestic}`) },
    ]
    for (let i = 1; i < parts.length; i++) {
      crumbs.push({
        label: labelForSlug(parts[i], messages),
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  if (parts[0] === 'support') {
    const crumbs: Array<{ label: string; to: string }> = [
      { label: messages.nav.top.support, to: L(`/${PATH.supportGuide}`) },
    ]
    for (let i = 1; i < parts.length; i++) {
      crumbs.push({
        label: labelForSlug(parts[i], messages),
        to: L(encodePathSegments(parts.slice(0, i + 1))),
      })
    }
    return crumbs
  }

  const crumbs: Array<{ label: string; to: string }> = []
  let acc = ''
  for (const label of parts) {
    acc += `/${encodeURIComponent(label)}`
    crumbs.push({ label: labelForSlug(label, messages), to: L(acc) })
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
  const { localize, messages } = useLocale()
  const crumbs =
    crumbsProp && crumbsProp.length > 0
      ? crumbsProp.map((c) => ({
          ...c,
          to: c.to.startsWith('http') ? c.to : localize(c.to),
        }))
      : buildCrumbs(location.pathname, messages, localize)

  // 경로 키가 제목으로 남은 경우(예: business/domestic) → 브레드크럼 라벨로 보정
  const displayTitle =
    /^[a-z0-9]+(?:\/[a-z0-9-]+)+$/i.test(title.trim()) && crumbs.length > 0
      ? crumbs[crumbs.length - 1]!.label
      : title

  return (
    <>
      <section className="page-hero" aria-label={displayTitle}>
        <div
          className={`page-hero__bg${backgroundImageUrl ? ' has-image' : ''}`}
          style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')` } : undefined}
          aria-hidden="true"
        />
        <div className="page-hero__inner">
          <h1 className="page-hero__title">{displayTitle}</h1>
        </div>
        {showScrollHint && (
          <div className="page-hero__scroll" aria-hidden="true">
            <div className="page-hero__scroll-line" />
            <span className="page-hero__scroll-label">{messages.pages.scrollHint}</span>
          </div>
        )}
      </section>

      {showBreadcrumbs && (
        <nav className="page-crumbs" aria-label={messages.nav.home}>
          <div className="page-crumbs__inner">
            <Link to={localize('/')} className="page-crumbs__link page-crumbs__home" aria-label={messages.nav.home}>
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
