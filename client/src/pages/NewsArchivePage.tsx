import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { normalizePathKey } from '../constants/pagesContent'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { PdfFirstPagePreview } from '../components/PdfFirstPagePreview'
import { Pagination } from '../components/Pagination'
import { paginate } from '../utils/paginate'
import { newsletterYearLabel, parseNewsletterYearSpec } from '../utils/newsletterYear'
import '../styles/page.css'
import '../styles/newsletter.css'
import { PATH } from '../i18n/routes'
import { useLocale } from '../i18n/LocaleContext'
import { toCloudinaryWebpUrl } from '../utils/cloudinaryWebp'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { ListStatus } from '../components/ListStatus'
import { PostCoverThumb } from '../components/PostCoverThumb'
import { postCoverMedia } from '../utils/postMedia'

function formatDate(
  iso: string,
  format: (y: number, m: number, d: number) => string,
): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return format(d.getFullYear(), d.getMonth() + 1, d.getDate())
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

function newsletterCoverageLabel(post: Post): string {
  const spec = parseNewsletterYearSpec(post.meta?.khayah_newsletter_year?.trim() ?? '')
  if (!spec) return ''
  return newsletterYearLabel(spec)
}

/** 호수 표시용 (숫자만 있으면 ○○호 / No. ○○) */
function newsletterIssueLabel(
  raw: string | undefined,
  issueUnit: (n: string) => string,
): string {
  const t = (raw ?? '').replace(/\([^)]*\)/g, '').trim()
  if (!t) return ''
  if (t.includes('호') || /^no\.?\s*/i.test(t)) return t
  const digits = t.replace(/\D/g, '')
  return issueUnit(digits || t)
}

function newsletterPdfUrl(post: Post): string {
  return post.meta?.khayah_pdf_url?.trim() || ''
}

/** 연간소식지·활동소식 등 `meta.khayah_cover_url` 또는 본문 첫 이미지/영상 썸네일 */
function coverMetaUrl(post: Post): string | undefined {
  const media = postCoverMedia(post)
  if (media.kind === 'image') return media.src
  if (media.kind === 'video') return media.poster || media.src
  return undefined
}

function usePathKey(): string {
  const location = useLocation()
  return useMemo(() => normalizePathKey(location.pathname), [location.pathname])
}

export function NewsArchivePage() {
  const pathKey = usePathKey()
  const { localize, messages } = useLocale()
  const ar = messages.pages.archive

  const { kind, title } = useMemo(() => {
    const links = messages.nav.links
    if (pathKey === PATH.newsActivities) return { kind: '활동소식', title: links.activities }
    if (pathKey === PATH.newsNewsletter) return { kind: '연간소식지', title: links.newsletter }
    if (pathKey === PATH.newsPress) return { kind: '언론보도', title: links.press }
    return { kind: '공지사항', title: links.announcements }
  }, [pathKey, messages.nav.links])

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

  const isPress = kind === '언론보도'
  const isNewsletter = kind === '연간소식지'
  const isActivity = kind === '활동소식'

  const perPage = isNewsletter ? Math.max(newsletterSorted.length, 1) : isActivity ? 8 : isPress ? 8 : 10
  const archiveAll = isNewsletter ? newsletterSorted : sortedPosts
  const [listPage, setListPage] = useState(1)

  useEffect(() => {
    setListPage(1)
  }, [kind])

  const paged = paginate(archiveAll, listPage, perPage)

  useEffect(() => {
    document.title = ar.siteTitle(title)
    return () => {
      document.title = ar.siteTitleDefault
    }
  }, [title, ar])

  return (
    <div
      className={`page-content-wrapper notice-archive-page${isPress ? ' press-archive-page' : ''}${
        isNewsletter ? ' yearly-nl-page' : ''
      }${isActivity ? ' activity-archive-page' : ''}`}
    >
      <PageHero title={title} backgroundImageUrl={pageHeroImageForPath(pathKey)} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            {loading ? (
              <ListStatus variant="loading" message={ar.loading} lines={5} />
            ) : null}
            {error ? (
              <ListStatus variant="error" message={ar.loadError} />
            ) : null}

            {!loading && !error && isNewsletter && newsletterSorted.length === 0 ? (
              <ListStatus variant="empty" message={ar.emptyNewsletter} />
            ) : null}
            {!loading && !error && !isNewsletter && sortedPosts.length === 0 ? (
              <ListStatus variant="empty" message={ar.empty} />
            ) : null}

            {!loading && !error && isNewsletter && newsletterSorted.length > 0 && (
              <div className="yearly-nl-archive">
                <div className="yearly-nl-cards" aria-label={ar.listAria(title)}>
                  {paged.items.length === 0 ? (
                    <ListStatus variant="empty" message={ar.emptyFiltered} />
                  ) : (
                    paged.items.map((post) => {
                      const pdf = newsletterPdfUrl(post)
                      const cover = coverMetaUrl(post)
                      const issueRaw = post.meta?.khayah_newsletter_issue?.trim() ?? ''
                      const issueHo = newsletterIssueLabel(issueRaw, ar.issueUnit)
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
                      const detailPath = localize(`/posts/${encodeURIComponent(post.slug)}`)
                      const detailState = { postKind: kind }
                      return (
                        <article key={post.id} className="yearly-nl-card">
                          <div className="yearly-nl-card__text">
                            <div className="yearly-nl-card__text-inner">
                            <h2 className="yearly-nl-card__title">{post.title}</h2>
                            {showYears ? <p className="yearly-nl-card__years">{yearLabel}</p> : null}
                            {showExcerpt ? <p className="yearly-nl-card__desc">{excerpt}</p> : null}
                            <Link className="yearly-nl-cta" to={detailPath} state={detailState}>
                              {ar.viewDetail}
                              <span className="yearly-nl-cta__icon" aria-hidden>
                                →
                              </span>
                            </Link>
                            </div>
                          </div>
                          <div className="yearly-nl-card__cover-wrap">
                            {cover ? (
                              <img className="yearly-nl-card__cover" src={toCloudinaryWebpUrl(cover)} alt="" loading="lazy" />
                            ) : pdf ? (
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
                  label={ar.pagination(title)}
                />
              </div>
            )}

            {!loading && !error && isPress && sortedPosts.length > 0 && (
              <div className="archive-board">
              <div className="archive-board__head" aria-hidden="true">
                <span>{ar.colTitle}</span>
                <span>{ar.colDate}</span>
                <span className="archive-board__head-action">{ar.colAction}</span>
              </div>
              <ul className="press-archive__list" aria-label={ar.listAria(title)}>
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
                            <span className="press-archive__source-wrap" aria-label={ar.mediaAria(pub)}>
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
                          {ar.viewArticle}
                        </a>
                      ) : (
                        <span className="press-archive__btn press-archive__btn--disabled">{ar.noLink}</span>
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
                label={ar.pagination(title)}
              />
            ) : null}

            {!loading && !error && isActivity && sortedPosts.length > 0 && (
              <>
              <ul className="activity-archive__list" aria-label={ar.listAria(title)}>
                {paged.items.map((post) => {
                  const cover = coverMetaUrl(post)
                  return (
                    <li key={post.id} className="activity-archive__item">
                      <Link
                        to={localize(`/posts/${encodeURIComponent(post.slug)}`)}
                        state={{ postKind: kind }}
                        className="activity-archive__link"
                      >
                        <div className="activity-archive__thumb-wrap">
                          {cover ? (
                            <PostCoverThumb post={post} className="activity-archive__thumb" />
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
                            {formatDate(post.publishedAt, ar.date)}
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
                label={ar.pagination(title)}
              />
              </>
            )}

            {!loading && !error && !isPress && !isNewsletter && !isActivity && sortedPosts.length > 0 && (
              <>
              <div className="archive-board">
              <div className="archive-board__head" aria-hidden="true">
                <span>{ar.colTitle}</span>
                <span>{ar.colDate}</span>
              </div>
              <ul className="notice-archive__list" aria-label={ar.listAria(title)}>
                {paged.items.map((post) => (
                  <li key={post.id} className="notice-archive__item">
                    <Link
                      to={localize(`/posts/${encodeURIComponent(post.slug)}`)}
                      state={{ postKind: kind }}
                      className="notice-archive__link"
                    >
                      <h2 className="notice-archive__title">{post.title}</h2>
                      <time className="notice-archive__date" dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt, ar.date)}
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
                label={ar.pagination(title)}
              />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

