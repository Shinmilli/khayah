import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { normalizePathKey } from '../constants/pagesContent'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { PdfFirstPagePreview } from '../components/PdfFirstPagePreview'
import { Pagination } from '../components/Pagination'
import { coverIsBlank, pdfOpenHref } from '../utils/pdfAttachments'
import { paginate } from '../utils/paginate'
import {
  newsletterArchiveYearFromPost,
  newsletterIssueKeyFromPost,
  newsletterYearLabel,
  parseNewsletterYearSpec,
} from '../utils/newsletterYear'
import '../styles/page.css'
import '../styles/newsletter.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}년 ${m}월 ${day}일`
}

function pressArticleTitle(post: Post): string {
  return post.meta?.khayah_press_title?.trim() || post.title
}

function pressPublisher(post: Post): string {
  return post.meta?.khayah_press_publisher?.trim() || ''
}

function pressArticleUrl(post: Post): string {
  return post.meta?.khayah_press_url?.trim() || ''
}

/** 기사 날짜 메타(YYYY-MM-DD) 우선, 없으면 게시일 */
function pressDisplayYmd(post: Post): string {
  const raw = post.meta?.khayah_press_date?.trim()
  if (raw && /^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  return post.publishedAt.slice(0, 10)
}

function pressSortKey(post: Post): string {
  return pressDisplayYmd(post)
}

/** 목록·필터용 연도: 범위면 종료 연도에만 표시. 없으면 제목 연도, 마지막으로 게시일 연도 */
function newsletterArchiveYear(post: Post): number {
  return newsletterArchiveYearFromPost(
    post.meta?.khayah_newsletter_year,
    post.title,
    post.publishedAt,
  )
}

function newsletterCoverageLabel(post: Post): string {
  const spec = parseNewsletterYearSpec(post.meta?.khayah_newsletter_year?.trim() ?? '')
  if (!spec) return ''
  return newsletterYearLabel(spec)
}

function newsletterIsPdfMode(post: Post): boolean {
  const m = post.meta?.khayah_newsletter_mode ?? ''
  return m === 'PDF 업로드 모드' || m === 'PDF소식지'
}

/** 호수 표시용 (숫자만 있으면 ○○호) */
function newsletterIssueLabel(raw: string | undefined): string {
  const t = (raw ?? '').replace(/\([^)]*\)/g, '').trim()
  if (!t) return ''
  if (t.includes('호')) return t
  const digits = t.replace(/\D/g, '')
  return digits ? `${digits}호` : `${t}호`
}

function newsletterPdfUrl(post: Post): string {
  return post.meta?.khayah_pdf_url?.trim() || ''
}

/** 연간소식지·활동소식 등 `meta.khayah_cover_url` 기반 썸네일 */
function coverMetaUrl(post: Post): string | undefined {
  const u = post.meta?.khayah_cover_url?.trim()
  return u || undefined
}

function usePathKey(): string {
  const location = useLocation()
  return useMemo(() => normalizePathKey(location.pathname), [location.pathname])
}

export function NewsArchivePage() {
  const pathKey = usePathKey()

  const { kind, title } = useMemo(() => {
    if (pathKey === '소식/활동소식') return { kind: '활동소식', title: '활동소식' }
    if (pathKey === '소식/연간소식지') return { kind: '연간소식지', title: '연간소식지' }
    if (pathKey === '소식/언론보도') return { kind: '언론보도', title: '언론보도' }
    return { kind: '공지사항', title: '공지사항' }
  }, [pathKey])

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchPostsByKind(kind, 1, 100)
      .then((res) => {
        if (!cancelled) setPosts(res.posts)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [kind])

  const sortedPosts = useMemo(() => {
    if (kind !== '언론보도') return posts
    return [...posts].sort((a, b) => pressSortKey(b).localeCompare(pressSortKey(a)))
  }, [posts, kind])

  const newsletterSorted = useMemo(() => {
    if (kind !== '연간소식지') return []
    return [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }, [posts, kind])

  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [filterIssue, setFilterIssue] = useState<string>('')

  const newsletterYears = useMemo(() => {
    const ys = new Set<number>()
    for (const p of newsletterSorted) ys.add(newsletterArchiveYear(p))
    return Array.from(ys).sort((a, b) => b - a)
  }, [newsletterSorted])

  useEffect(() => {
    if (kind !== '연간소식지') return
    if (newsletterYears.length === 0) {
      setFilterYear(null)
      return
    }
    setFilterYear((prev) => (prev != null && newsletterYears.includes(prev) ? prev : newsletterYears[0]))
  }, [kind, newsletterYears])

  const newsletterIssueValues = useMemo(() => {
    if (filterYear == null) return [] as string[]
    const pool = newsletterSorted.filter((p) => newsletterArchiveYear(p) === filterYear)
    const keys = new Set<string>()
    for (const p of pool) {
      const key = newsletterIssueKeyFromPost(p.meta?.khayah_newsletter_issue, p.title)
      if (key) keys.add(key)
    }
    return Array.from(keys).sort((a, b) => {
      const na = parseInt(a, 10)
      const nb = parseInt(b, 10)
      if (Number.isFinite(na) && Number.isFinite(nb)) return nb - na
      return b.localeCompare(a, 'ko')
    })
  }, [newsletterSorted, filterYear])

  const newsletterDefaultIssue = useMemo(() => {
    if (filterYear == null) return ''
    const pool = newsletterSorted.filter((p) => newsletterArchiveYear(p) === filterYear)
    for (const p of pool) {
      const key = newsletterIssueKeyFromPost(p.meta?.khayah_newsletter_issue, p.title)
      if (key) return key
    }
    return newsletterIssueValues[0] ?? ''
  }, [newsletterSorted, filterYear, newsletterIssueValues])

  useEffect(() => {
    setFilterIssue((prev) =>
      prev && newsletterIssueValues.includes(prev) ? prev : newsletterDefaultIssue,
    )
  }, [filterYear, newsletterIssueValues, newsletterDefaultIssue])

  const isPress = kind === '언론보도'
  const isNewsletter = kind === '연간소식지'
  const isActivity = kind === '활동소식'

  const newsletterVisible = useMemo(() => {
    return newsletterSorted.filter((p) => {
      if (filterYear == null || newsletterArchiveYear(p) !== filterYear) return false
      if (filterIssue) {
        const issueKey = newsletterIssueKeyFromPost(p.meta?.khayah_newsletter_issue, p.title)
        if (issueKey !== filterIssue) return false
      }
      return true
    })
  }, [newsletterSorted, filterYear, filterIssue])

  const perPage = isNewsletter ? 4 : isActivity ? 8 : isPress ? 8 : 10
  const archiveAll = isNewsletter ? newsletterVisible : sortedPosts
  const [listPage, setListPage] = useState(1)

  useEffect(() => {
    setListPage(1)
  }, [kind, filterYear, filterIssue])

  const paged = paginate(archiveAll, listPage, perPage)

  useEffect(() => {
    document.title = `${title} | 사단법인 카야 인터내셔널`
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [title])

  return (
    <div
      className={`page-content-wrapper notice-archive-page${isPress ? ' press-archive-page' : ''}${
        isNewsletter ? ' yearly-nl-page' : ''
      }${isActivity ? ' activity-archive-page' : ''}`}
    >
      <PageHero title={title} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            {loading && <p className="notice-archive__status">불러오는 중…</p>}
            {error && (
              <p className="notice-archive__status notice-archive__status--error">
                목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}

            {!loading && !error && isNewsletter && newsletterSorted.length === 0 && (
              <p className="notice-archive__status">등록된 소식지가 없습니다.</p>
            )}
            {!loading && !error && !isNewsletter && sortedPosts.length === 0 && (
              <p className="notice-archive__status">등록된 글이 없습니다.</p>
            )}

            {!loading && !error && isNewsletter && newsletterSorted.length > 0 && (
              <div className="yearly-nl-archive">
                <div className="yearly-nl-toolbar" role="search" aria-label="연간소식지 필터">
                  <label className="yearly-nl-filter">
                    <select
                      className="yearly-nl-select"
                      aria-label="연도"
                      value={String(filterYear)}
                      onChange={(e) => setFilterYear(Number(e.currentTarget.value))}
                    >
                      {newsletterYears.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}년
                        </option>
                      ))}
                    </select>
                  </label>
                  {newsletterIssueValues.length > 0 ? (
                    <label className="yearly-nl-filter">
                      <select
                        className="yearly-nl-select"
                        aria-label="호수"
                        value={filterIssue}
                        onChange={(e) => setFilterIssue(e.currentTarget.value)}
                      >
                        {newsletterIssueValues.map((issueKey) => (
                          <option key={issueKey} value={issueKey}>
                            {newsletterIssueLabel(issueKey)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </div>

                <div className="yearly-nl-cards" aria-label="연간소식지 목록">
                  {paged.items.length === 0 ? (
                    <p className="notice-archive__status">선택한 조건에 해당하는 소식지가 없습니다.</p>
                  ) : (
                    paged.items.map((post) => {
                      const pdf = newsletterPdfUrl(post)
                      const isPdf = newsletterIsPdfMode(post)
                      const cover = coverMetaUrl(post)
                      const issueRaw = post.meta?.khayah_newsletter_issue?.trim() ?? ''
                      const issueHo = newsletterIssueLabel(issueRaw)
                      const yearLabel = newsletterCoverageLabel(post)
                      const excerpt = (post.excerpt || '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                      const norm = (s: string) => s.replace(/[–—]/g, '-').replace(/\s+/g, '').trim()
                      const titleNorm = norm(post.title)
                      const showYears = Boolean(yearLabel) && norm(yearLabel) !== titleNorm
                      const showExcerpt =
                        Boolean(excerpt) &&
                        norm(excerpt) !== titleNorm &&
                        (!yearLabel || norm(excerpt) !== norm(yearLabel))
                      const detailPath = `/posts/${encodeURIComponent(post.slug)}`
                      const ctaPdf = isPdf && pdf
                      const pdfFileName = (() => {
                        const original = post.meta?.khayah_pdf_name?.trim()
                        if (original) return original.toLowerCase().endsWith('.pdf') ? original : `${original}.pdf`
                        const title = post.title.trim() || '소식지'
                        return title.toLowerCase().endsWith('.pdf') ? title : `${title}.pdf`
                      })()
                      const pdfHref = pdfOpenHref(pdf, pdfFileName)
                      return (
                        <article key={post.id} className="yearly-nl-card">
                          <div className="yearly-nl-card__text">
                            <div className="yearly-nl-card__text-inner">
                            <h2 className="yearly-nl-card__title">{post.title}</h2>
                            {showYears ? <p className="yearly-nl-card__years">{yearLabel}</p> : null}
                            {showExcerpt ? <p className="yearly-nl-card__desc">{excerpt}</p> : null}
                            {ctaPdf ? (
                              <a
                                className="yearly-nl-cta"
                                href={pdfHref}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                자세히 보기
                                <span className="yearly-nl-cta__icon" aria-hidden>
                                  →
                                </span>
                              </a>
                            ) : (
                              <Link className="yearly-nl-cta" to={detailPath}>
                                자세히 보기
                                <span className="yearly-nl-cta__icon" aria-hidden>
                                  →
                                </span>
                              </Link>
                            )}
                            </div>
                          </div>
                          <div className="yearly-nl-card__cover-wrap">
                            {cover ? (
                              <img className="yearly-nl-card__cover" src={cover} alt="" loading="lazy" />
                            ) : !coverIsBlank(post.meta) && pdf ? (
                              <PdfFirstPagePreview url={pdf} className="yearly-nl-card__cover yearly-nl-card__cover--pdf" />
                            ) : (
                              <div className="yearly-nl-card__cover yearly-nl-card__cover--placeholder" aria-hidden />
                            )}
                            {issueHo ? (
                              <span className="yearly-nl-card__issue">{issueHo}</span>
                            ) : null}
                          </div>
                        </article>
                      )
                    })
                  )}
                </div>
                <Pagination
                  page={paged.page}
                  totalPages={paged.totalPages}
                  onChange={setListPage}
                  label="연간소식지 페이지"
                />
              </div>
            )}

            {!loading && !error && isPress && sortedPosts.length > 0 && (
              <div className="archive-board">
              <div className="archive-board__head" aria-hidden="true">
                <span>제목</span>
                <span>등록일</span>
                <span className="archive-board__head-action">바로보기</span>
              </div>
              <ul className="press-archive__list" aria-label={`${title} 목록`}>
                {paged.items.map((post) => {
                  const url = pressArticleUrl(post)
                  const ymd = pressDisplayYmd(post)
                  const pub = pressPublisher(post)
                  const articleTitle = pressArticleTitle(post)
                  return (
                    <li key={post.id} className="press-archive__item">
                      <div className="press-archive__text">
                        <p className="press-archive__headline">
                          {pub ? (
                            <span className="press-archive__source-wrap" aria-label={`매체 ${pub}`}>
                              <span className="press-archive__bracket">[</span>
                              <span className="press-archive__source">{pub}</span>
                              <span className="press-archive__bracket">]</span>
                            </span>
                          ) : null}
                          {pub ? ' ' : null}
                          <span className="press-archive__article-title">{articleTitle}</span>
                        </p>
                      </div>
                      <time className="press-archive__ymd" dateTime={ymd}>
                        {ymd}
                      </time>
                      {url ? (
                        <a
                          className="press-archive__btn"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          기사 바로보기
                        </a>
                      ) : (
                        <span className="press-archive__btn press-archive__btn--disabled">링크 없음</span>
                      )}
                    </li>
                  )
                })}
              </ul>
              </div>
            )}

            {!loading && !error && isPress && sortedPosts.length > 0 ? (
              <Pagination
                page={paged.page}
                totalPages={paged.totalPages}
                onChange={setListPage}
                label="언론보도 페이지"
              />
            ) : null}

            {!loading && !error && isActivity && sortedPosts.length > 0 && (
              <>
              <ul className="activity-archive__list" aria-label={`${title} 목록`}>
                {paged.items.map((post) => {
                  const cover = coverMetaUrl(post)
                  return (
                    <li key={post.id} className="activity-archive__item">
                      <Link to={`/posts/${encodeURIComponent(post.slug)}`} className="activity-archive__link">
                        <div className="activity-archive__thumb-wrap">
                          {cover ? (
                            <img
                              className="activity-archive__thumb"
                              src={cover}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="activity-archive__thumb activity-archive__thumb--placeholder"
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className="activity-archive__body">
                          <h2 className="activity-archive__title">{post.title}</h2>
                          <time className="activity-archive__date" dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                          </time>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <Pagination
                page={paged.page}
                totalPages={paged.totalPages}
                onChange={setListPage}
                label="활동소식 페이지"
              />
              </>
            )}

            {!loading && !error && !isPress && !isNewsletter && !isActivity && sortedPosts.length > 0 && (
              <>
              <div className="archive-board">
              <div className="archive-board__head" aria-hidden="true">
                <span>제목</span>
                <span>등록일</span>
              </div>
              <ul className="notice-archive__list" aria-label={`${title} 목록`}>
                {paged.items.map((post) => (
                  <li key={post.id} className="notice-archive__item">
                    <Link to={`/posts/${encodeURIComponent(post.slug)}`} className="notice-archive__link">
                      <h2 className="notice-archive__title">{post.title}</h2>
                      <time className="notice-archive__date" dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
              </div>
              <Pagination
                page={paged.page}
                totalPages={paged.totalPages}
                onChange={setListPage}
                label="공지사항 페이지"
              />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

