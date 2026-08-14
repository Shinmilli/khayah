import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { parsePdfAttachments } from '../utils/pdfAttachments'

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

function heroTitleForKind(kind: string): string {
  if (kind === '활동소식') return '활동소식'
  if (kind === '연간소식지') return '연간소식지'
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

  return (
    <article className="post-board">
      <header className="post-board__head">
        <h1 className="post-board__title">{post.title}</h1>
        <p className="post-board__meta">
          등록일 <time dateTime={post.publishedAt}>{formatDotDate(post.publishedAt)}</time>
        </p>
      </header>

      <div
        className="the_content_wrapper page-body post-board__body"
        dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }}
      />

      {attachments.length > 0 ? (
        <ul className="post-board__files" aria-label="첨부 문서">
          {attachments.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

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

export { heroTitleForKind }
