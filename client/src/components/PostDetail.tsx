import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import { useLocale } from '../i18n/LocaleContext'
import type { Messages } from '../i18n/messages/ko'
import { PROJECT_REGION_TO_SLUG } from '../i18n/routes'
import type { Post } from '../types/post'
import { parsePdfAttachments, pdfOpenHref, type PdfAttachment } from '../utils/pdfAttachments'
import { PostBody } from './PostBody'
import { PostCoverThumb } from './PostCoverThumb'

function PaperclipIcon() {
  return (
    <svg className="post-board__clip" width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16.5 6.75v7.13a4.5 4.5 0 1 1-9 0V6.2a3 3 0 1 1 6 0v7.18a1.5 1.5 0 1 1-3 0V7.5h-1.5v5.88a3 3 0 1 0 6 0V6.2a4.5 4.5 0 1 0-9 0v7.68a6 6 0 1 0 12 0V6.75H16.5Z"
      />
    </svg>
  )
}

function PostFileBar({ files, ariaLabel }: { files: PdfAttachment[]; ariaLabel: string }) {
  if (files.length === 0) return null
  return (
    <ul className="post-board__files" aria-label={ariaLabel}>
      {files.map((f) => (
        <li key={f.url}>
          <a href={pdfOpenHref(f.url, f.name)} target="_blank" rel="noopener noreferrer">
            <PaperclipIcon />
            <span>{f.name}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function formatDotDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function listPathForPost(post: Post): string {
  const kind = post.meta?.khayah_kind ?? ''
  switch (kind) {
    case '공지사항':
      return '/news/announcements'
    case '활동소식':
      return '/news/activities'
    case '연간소식지':
      return '/news/newsletter'
    case '언론보도':
      return '/news/press'
    case '진행사업':
      return '/business/projects'
    case '스토리': {
      const scope = post.meta?.khayah_story_scope
      if (scope === '국내') return '/stories/domestic'
      if (scope === '해외') return '/stories/overseas'
      if (scope === '옹호') return '/stories/advocacy'
      if (scope === '진행') return '/stories/support'
      return '/stories'
    }
    default:
      return '/news/announcements'
  }
}

function regionLabel(region: string, messages: Messages): string {
  const slug = PROJECT_REGION_TO_SLUG[region]
  if (slug === 'nepal') return messages.pages.projects.regions.nepal
  if (slug === 'myanmar') return messages.pages.projects.regions.myanmar
  if (slug === 'kyrgyzstan') return messages.pages.projects.regions.kyrgyzstan
  if (slug === 'domestic') return messages.pages.projects.regions.domestic
  return region
}

function crumbsForKind(kind: string, messages: Messages): Array<{ label: string; to: string }> {
  const { nav, pages } = messages
  switch (kind) {
    case '공지사항':
      return [
        { label: nav.top.news, to: '/stories' },
        { label: nav.links.announcements, to: '/news/announcements' },
      ]
    case '활동소식':
      return [
        { label: nav.top.news, to: '/stories' },
        { label: nav.links.activities, to: '/news/activities' },
      ]
    case '연간소식지':
      return [
        { label: nav.top.news, to: '/stories' },
        { label: nav.links.newsletter, to: '/news/newsletter' },
      ]
    case '언론보도':
      return [
        { label: nav.top.news, to: '/stories' },
        { label: nav.links.press, to: '/news/press' },
      ]
    case '진행사업':
      return [
        { label: nav.top.business, to: '/business/domestic' },
        { label: nav.links.projects, to: '/business/projects' },
      ]
    case '스토리':
      return [{ label: pages.stories.title, to: '/stories' }]
    default:
      return [{ label: nav.top.news, to: '/stories' }]
  }
}

function crumbsForPost(post: Post, messages: Messages): Array<{ label: string; to: string }> {
  const kind = post.meta?.khayah_kind ?? ''
  const crumbs = crumbsForKind(kind, messages)
  if (kind === '진행사업') {
    const region = post.meta?.khayah_project_region?.trim()
    if (region) {
      const slug = PROJECT_REGION_TO_SLUG[region] ?? encodeURIComponent(region)
      crumbs.push({ label: regionLabel(region, messages), to: `/business/projects/${slug}` })
    }
  } else if (kind === '스토리') {
    const scope = post.meta?.khayah_story_scope
    const { pages } = messages
    if (scope === '국내') crumbs.push({ label: pages.stories.scopes.domestic, to: '/stories/domestic' })
    else if (scope === '해외') crumbs.push({ label: pages.stories.scopes.overseas, to: '/stories/overseas' })
    else if (scope === '옹호') crumbs.push({ label: pages.stories.scopes.advocacy, to: '/stories/advocacy' })
    else if (scope === '진행' || scope === '지원') {
      crumbs.push({ label: pages.stories.scopes.support, to: '/stories/support' })
    }
  }
  return crumbs
}

function heroTitleForKind(kind: string, messages: Messages): string {
  const { nav, pages } = messages
  if (kind === '공지사항') return nav.links.announcements
  if (kind === '활동소식') return nav.links.activities
  if (kind === '연간소식지') return nav.links.newsletter
  if (kind === '언론보도') return nav.links.press
  if (kind === '진행사업') return nav.links.projects
  if (kind === '스토리') return pages.stories.title
  return kind || pages.postDetail.fallbackTitle
}

function storyScopeChip(scope: string | undefined, messages: Messages): string | null {
  switch (scope) {
    case '국내':
      return messages.pages.stories.chips.domestic
    case '해외':
      return messages.pages.stories.chips.overseas
    case '옹호':
      return messages.pages.stories.chips.advocacy
    case '지원':
    case '진행':
      return messages.pages.stories.chips.support
    default:
      return null
  }
}

export function PostDetail({ post }: { post: Post }) {
  const { localize, messages } = useLocale()
  const pd = messages.pages.postDetail
  const kind = post.meta?.khayah_kind ?? ''
  const listTo = localize(listPathForPost(post))
  const [siblings, setSiblings] = useState<Post[]>([])
  const storyChip = kind === '스토리' ? storyScopeChip(post.meta?.khayah_story_scope, messages) : null

  useEffect(() => {
    if (!kind) {
      setSiblings([])
      return
    }
    let cancelled = false
    fetchPostsByKind(kind, 1, 100)
      .then((res) => {
        if (!cancelled) setSiblings(res.posts)
      })
      .catch(() => {
        if (!cancelled) setSiblings([])
      })
    return () => {
      cancelled = true
    }
  }, [kind, post.id])

  const attachments = useMemo(() => parsePdfAttachments(post.meta), [post.meta])

  const { newer, older } = useMemo(() => {
    const ordered = [...siblings].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    const idx = ordered.findIndex((p) => p.id === post.id)
    if (idx < 0) return { newer: null as Post | null, older: null as Post | null }
    return {
      newer: ordered[idx - 1] ?? null,
      older: ordered[idx + 1] ?? null,
    }
  }, [siblings, post.id])

  const isFeature = kind === '활동소식' || kind === '연간소식지' || kind === '스토리'
  const isStory = kind === '스토리'

  const storyNavCard = (side: 'prev' | 'next', target: Post | null) => {
    const isPrev = side === 'prev'
    const label = isPrev ? pd.prev : pd.next
    const empty = isPrev ? pd.prevEmpty : pd.nextEmpty
    if (!target) {
      return (
        <div className={`story-post-nav__card story-post-nav__card--${side} is-empty`}>
          <div className="story-post-nav__media" aria-hidden />
          <div className="story-post-nav__copy">
            <span className="story-post-nav__label">{label}</span>
            <span className="story-post-nav__empty">{empty}</span>
          </div>
        </div>
      )
    }
    return (
      <Link
        className={`story-post-nav__card story-post-nav__card--${side}`}
        to={localize(`/posts/${encodeURIComponent(target.slug)}`)}
        state={{ postKind: kind }}
      >
        <div className="story-post-nav__media">
          <PostCoverThumb post={target} />
        </div>
        <div className="story-post-nav__copy">
          <span className="story-post-nav__label">{label}</span>
          <span className="story-post-nav__title">{target.title}</span>
        </div>
      </Link>
    )
  }

  return (
    <article className={`post-board${isFeature ? ' post-board--feature' : ''}`}>
      <header className="post-board__head">
        {storyChip ? <p className="post-board__scope">{storyChip}</p> : null}
        <h1 className="post-board__title">{post.title}</h1>
        <p className="post-board__meta">
          {isFeature ? null : pd.publishedPrefix}
          <time dateTime={post.publishedAt}>{formatDotDate(post.publishedAt)}</time>
        </p>
      </header>

      {isFeature ? <PostFileBar files={attachments} ariaLabel={pd.filesAria} /> : null}

      <PostBody html={post.content || post.excerpt || ''} />

      {!isFeature ? <PostFileBar files={attachments} ariaLabel={pd.filesAria} /> : null}

      <div className="post-board__toolbar">
        <Link className="post-board__list-btn" to={listTo}>
          {pd.list}
        </Link>
      </div>

      {isStory ? (
        <nav className="story-post-nav" aria-label={pd.navAria}>
          {storyNavCard('next', newer)}
          {storyNavCard('prev', older)}
        </nav>
      ) : (
      <nav className="post-board__nav" aria-label={pd.navAria}>
        {newer ? (
          <Link
            className="post-board__nav-row post-board__nav-row--link"
            to={localize(`/posts/${encodeURIComponent(newer.slug)}`)}
            state={{ postKind: kind }}
          >
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--up" aria-hidden />
              {pd.next}
            </span>
            <span className="post-board__nav-main">
              <span className="post-board__nav-title">{newer.title}</span>
              <time className="post-board__nav-date" dateTime={newer.publishedAt}>
                {formatDotDate(newer.publishedAt)}
              </time>
            </span>
          </Link>
        ) : (
          <div className="post-board__nav-row">
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--up" aria-hidden />
              {pd.next}
            </span>
            <span className="post-board__nav-empty">{pd.nextEmpty}</span>
          </div>
        )}
        {older ? (
          <Link
            className="post-board__nav-row post-board__nav-row--link"
            to={localize(`/posts/${encodeURIComponent(older.slug)}`)}
            state={{ postKind: kind }}
          >
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--down" aria-hidden />
              {pd.prev}
            </span>
            <span className="post-board__nav-main">
              <span className="post-board__nav-title">{older.title}</span>
              <time className="post-board__nav-date" dateTime={older.publishedAt}>
                {formatDotDate(older.publishedAt)}
              </time>
            </span>
          </Link>
        ) : (
          <div className="post-board__nav-row">
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--down" aria-hidden />
              {pd.prev}
            </span>
            <span className="post-board__nav-empty">{pd.prevEmpty}</span>
          </div>
        )}
      </nav>
      )}
    </article>
  )
}

export { heroTitleForKind, crumbsForKind, crumbsForPost, listPathForPost }
