import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { parsePdfAttachments, pdfOpenHref, type PdfAttachment } from '../utils/pdfAttachments'

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

function PostFileBar({ files }: { files: PdfAttachment[] }) {
  if (files.length === 0) return null
  return (
    <ul className="post-board__files" aria-label="첨부 문서">
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
      return '/소식/공지사항'
    case '활동소식':
      return '/소식/활동소식'
    case '연간소식지':
      return '/소식/연간소식지'
    case '언론보도':
      return '/소식/언론보도'
    case '진행사업':
      return '/사업/진행사업'
    case '스토리': {
      const scope = post.meta?.khayah_story_scope
      if (scope === '국내') return '/stories/domestic'
      if (scope === '해외') return '/stories/overseas'
      if (scope === '옹호') return '/stories/advocacy'
      if (scope === '진행') return '/stories/support'
      return '/stories'
    }
    default:
      return '/소식/공지사항'
  }
}

function crumbsForPost(post: Post): Array<{ label: string; to: string }> {
  const kind = post.meta?.khayah_kind ?? ''
  switch (kind) {
    case '공지사항':
      return [
        { label: '소식', to: '/stories' },
        { label: '공지사항', to: '/소식/공지사항' },
      ]
    case '활동소식':
      return [
        { label: '소식', to: '/stories' },
        { label: '활동소식', to: '/소식/활동소식' },
      ]
    case '연간소식지':
      return [
        { label: '소식', to: '/stories' },
        { label: '연간소식지', to: '/소식/연간소식지' },
      ]
    case '언론보도':
      return [
        { label: '소식', to: '/stories' },
        { label: '언론보도', to: '/소식/언론보도' },
      ]
    case '진행사업': {
      const region = post.meta?.khayah_project_region?.trim()
      const crumbs = [
        { label: '사업', to: '/국내사업' },
        { label: '진행사업', to: '/사업/진행사업' },
      ]
      if (region) {
        crumbs.push({ label: region, to: `/사업/진행사업/${encodeURIComponent(region)}` })
      }
      return crumbs
    }
    case '스토리': {
      const scope = post.meta?.khayah_story_scope
      const crumbs = [{ label: '스토리', to: '/stories' }]
      if (scope === '국내') crumbs.push({ label: '국내', to: '/stories/domestic' })
      else if (scope === '해외') crumbs.push({ label: '해외', to: '/stories/overseas' })
      else if (scope === '옹호') crumbs.push({ label: '옹호', to: '/stories/advocacy' })
      else if (scope === '진행' || scope === '지원') crumbs.push({ label: '지원', to: '/stories/support' })
      return crumbs
    }
    default:
      return [{ label: '소식', to: '/stories' }]
  }
}

function heroTitleForKind(kind: string): string {
  if (kind === '공지사항') return '공지사항'
  if (kind === '활동소식') return '활동소식'
  if (kind === '연간소식지') return '연간소식지'
  if (kind === '언론보도') return '언론보도'
  if (kind === '진행사업') return '진행사업'
  if (kind === '스토리') return '스토리'
  return kind || '소식'
}

export function PostDetail({ post }: { post: Post }) {
  const kind = post.meta?.khayah_kind ?? ''
  const listTo = listPathForPost(post)
  const [siblings, setSiblings] = useState<Post[]>([])

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

  return (
    <article className={`post-board${isFeature ? ' post-board--feature' : ''}`}>
      <header className="post-board__head">
        <h1 className="post-board__title">{post.title}</h1>
        <p className="post-board__meta">
          {isFeature ? null : '등록일 '}
          <time dateTime={post.publishedAt}>{formatDotDate(post.publishedAt)}</time>
        </p>
      </header>

      {isFeature ? <PostFileBar files={attachments} /> : null}

      <div
        className="the_content_wrapper page-body post-board__body"
        dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }}
      />

      {!isFeature ? <PostFileBar files={attachments} /> : null}

      <div className="post-board__toolbar">
        <Link className="post-board__list-btn" to={listTo}>
          목록
        </Link>
      </div>

      <nav className="post-board__nav" aria-label="이전글 다음글">
        {newer ? (
          <Link
            className="post-board__nav-row post-board__nav-row--link"
            to={`/posts/${encodeURIComponent(newer.slug)}`}
          >
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--up" aria-hidden />
              다음글
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
              다음글
            </span>
            <span className="post-board__nav-empty">다음글이 존재하지 않습니다.</span>
          </div>
        )}
        {older ? (
          <Link
            className="post-board__nav-row post-board__nav-row--link"
            to={`/posts/${encodeURIComponent(older.slug)}`}
          >
            <span className="post-board__nav-label">
              <span className="post-board__chevron post-board__chevron--down" aria-hidden />
              이전글
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
              이전글
            </span>
            <span className="post-board__nav-empty">이전글이 존재하지 않습니다.</span>
          </div>
        )}
      </nav>
    </article>
  )
}

export { heroTitleForKind, crumbsForPost }
