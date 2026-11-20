import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { paginate } from '../utils/paginate'
import { useLocale } from '../i18n/LocaleContext'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { ListStatus } from '../components/ListStatus'
import '../styles/story.css'
import '../styles/page.css'

type StoryCat = 'all' | 'change' | 'expert'

const CAT_LABEL = {
  change: '변화의 이야기',
  expert: '전문가 이야기',
} as const

function parseCat(raw: string | null): StoryCat {
  const v = (raw ?? '').trim()
  if (v === 'change' || v === '변화의 이야기') return 'change'
  if (v === 'expert' || v === '전문가 이야기') return 'expert'
  return 'all'
}

function storyCategory(post: Post): '변화의 이야기' | '전문가 이야기' | null {
  const raw = post.meta?.khayah_story_category ?? ''
  if (raw === '변화의 이야기' || raw === '전문가 이야기') return raw
  return null
}

function formatYmd(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function StoryCategoryPage() {
  const { localize, messages } = useLocale()
  const st = messages.pages.stories
  const [params, setParams] = useSearchParams()
  const cat = parseCat(params.get('cat'))
  const [listPage, setListPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchPostsByKind('스토리', 1, 200)
      .then((res) => {
        if (!cancelled) setPosts(res.posts)
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([])
          setError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => {
    if (cat === 'all') return posts
    const label = CAT_LABEL[cat]
    return posts.filter((p) => storyCategory(p) === label)
  }, [posts, cat])

  const paged = paginate(items, listPage, 12)

  const tabs: Array<{ key: StoryCat; label: string }> = [
    { key: 'all', label: st.all },
    { key: 'change', label: CAT_LABEL.change },
    { key: 'expert', label: CAT_LABEL.expert },
  ]

  const selectCat = (next: StoryCat) => {
    const nextParams = new URLSearchParams(params)
    if (next === 'all') nextParams.delete('cat')
    else nextParams.set('cat', next)
    setParams(nextParams, { replace: true })
    setListPage(1)
  }

  return (
    <div className="page-content-wrapper press-archive-page">
      <PageHero title={st.title} backgroundImageUrl={pageHeroImageForPath(PATH.newsStories)} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <div className="story-archive">
              <header className="story-archive__head">
                <div className="story-archive__title-row">
                  <h2 className="story-archive__title">{st.title}</h2>
                </div>
                <nav className="story-filter" aria-label={st.filterAria}>
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`story-filter__btn${cat === t.key ? ' is-active' : ''}`}
                      onClick={() => selectCat(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </header>

              {loading ? <ListStatus variant="loading" message={messages.pages.archive.loading} lines={5} /> : null}
              {error ? <ListStatus variant="error" message={st.loadError} /> : null}
              {!loading && !error && items.length === 0 ? (
                <ListStatus variant="empty" message={st.empty} />
              ) : null}
              {!loading && !error && items.length > 0 ? (
                <div className="archive-board">
                  <div className="archive-board__head" aria-hidden="true">
                    <span>{messages.pages.archive.colTitle}</span>
                    <span>{messages.pages.archive.colDate}</span>
                    <span className="archive-board__head-action">{messages.pages.archive.colAction}</span>
                  </div>
                  <ul className="press-archive__list" aria-label={st.listAria}>
                    {paged.items.map((p) => {
                      const category = storyCategory(p)
                      const ymd = formatYmd(p.publishedAt)
                      return (
                        <li key={p.id} className="press-archive__item">
                          <div className="press-archive__text">
                            <p className="press-archive__headline">
                              {category ? (
                                <span className="press-archive__source-wrap" aria-label={category}>
                                  <span className="press-archive__bracket">[</span>
                                  <span className="press-archive__source">{category}</span>
                                  <span className="press-archive__bracket">]</span>
                                </span>
                              ) : null}
                              {category ? ' ' : null}
                              <span className="press-archive__article-title">{p.title}</span>
                            </p>
                          </div>
                          <time className="press-archive__ymd" dateTime={ymd}>
                            {ymd}
                          </time>
                          <Link
                            className="press-archive__btn"
                            to={localize(`/posts/${encodeURIComponent(p.slug)}`)}
                            state={{ postKind: '스토리' }}
                          >
                            글 바로보기
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
              {!loading && !error && items.length > 0 ? (
                <div className="story-archive__actions">
                  <Pagination
                    page={paged.page}
                    totalPages={paged.totalPages}
                    onChange={setListPage}
                    label={st.pagination}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
