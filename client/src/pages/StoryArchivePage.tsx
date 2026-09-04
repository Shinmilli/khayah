import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { paginate } from '../utils/paginate'
import { useLocale } from '../i18n/LocaleContext'
import { pageHeroImageForStoryScope } from '../constants/pageHeroImages'
import '../styles/story.css'

type StoryScopeKey = 'all' | 'domestic' | 'overseas' | 'advocacy' | 'support'

function parseScope(raw: string | null | undefined): StoryScopeKey {
  if (!raw) return 'all'
  const v = raw.trim().toLowerCase()
  if (v === 'all' || v === '전체') return 'all'
  if (v === 'domestic' || v === '국내') return 'domestic'
  if (v === 'overseas' || v === '해외') return 'overseas'
  if (v === 'advocacy' || v === '옹호') return 'advocacy'
  if (v === 'support' || v === '지원' || v === '진행') return 'support'
  return 'all'
}

function scopeToMeta(scope: Exclude<StoryScopeKey, 'all'>): string {
  switch (scope) {
    case 'domestic':
      return '국내'
    case 'overseas':
      return '해외'
    case 'advocacy':
      return '옹호'
    case 'support':
      return '지원'
  }
}

function useQuery() {
  const location = useLocation()
  return useMemo(() => new URLSearchParams(location.search), [location.search])
}

function formatDotDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}. ${m}. ${day}.`
}

export function StoryArchivePage() {
  const params = useParams()
  const query = useQuery()
  const { localize, messages } = useLocale()
  const st = messages.pages.stories
  const initialScope = parseScope(params.scope ?? query.get('scope'))

  const [scope, setScope] = useState<StoryScopeKey>(initialScope)
  const [listPage, setListPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let cancelled = false
    fetchPostsByKind('스토리', 1, 200)
      .then((res) => {
        if (!cancelled) setPosts(res.posts)
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => {
    if (scope === 'all') return posts
    const meta = scopeToMeta(scope)
    return posts.filter(
      (p) =>
        (p.meta?.khayah_story_scope ?? '') === meta ||
        (meta === '지원' && (p.meta?.khayah_story_scope ?? '') === '진행'),
    )
  }, [posts, scope])

  const STORY_PER_PAGE = 9
  const paged = paginate(items, listPage, STORY_PER_PAGE)

  const scopeTabs: Array<{ key: StoryScopeKey; label: string }> = [
    { key: 'all', label: st.all },
    { key: 'domestic', label: st.scopes.domestic },
    { key: 'overseas', label: st.scopes.overseas },
    { key: 'advocacy', label: st.scopes.advocacy },
    { key: 'support', label: st.scopes.support },
  ]

  const title =
    scope === 'all' ? st.title : st.scopeTitle(st.scopes[scope as Exclude<StoryScopeKey, 'all'>])

  const chipForMeta = (s: string): string => {
    if (s === '국내') return st.chips.domestic
    if (s === '해외') return st.chips.overseas
    if (s === '옹호') return st.chips.advocacy
    if (s === '지원' || s === '진행') return st.chips.support
    return st.chips.default
  }

  const chipForScope = (s: Exclude<StoryScopeKey, 'all'>): string => {
    switch (s) {
      case 'domestic':
        return st.chips.domestic
      case 'overseas':
        return st.chips.overseas
      case 'advocacy':
        return st.chips.advocacy
      case 'support':
        return st.chips.support
    }
  }

  return (
    <div className="page-content-wrapper">
      <PageHero title={st.title} backgroundImageUrl={pageHeroImageForStoryScope(scope)} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <div className="story-archive">
              <header className="story-archive__head">
                <div className="story-archive__title-row">
                  <h2 className="story-archive__title">{title}</h2>
                </div>
                <p className="story-archive__sub">{st.subtitle}</p>
                <nav className="story-filter" aria-label={st.filterAria}>
                  {scopeTabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`story-filter__btn${scope === t.key ? ' is-active' : ''}`}
                      onClick={() => {
                        setScope(t.key)
                        setListPage(1)
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </header>

              <section className="story-archive__grid" aria-label={st.listAria}>
                {paged.items.map((p) => (
                  <article key={p.id} className="story-archive__item">
                    <div className="story-list-card">
                      <div className="story-list-card__thumb">
                        {p.meta?.khayah_cover_url?.trim() ? (
                          <img src={p.meta.khayah_cover_url.trim()} alt="" loading="lazy" />
                        ) : null}
                      </div>
                      <div className="story-list-card__body">
                        <h3 className="story-list-card__title">
                          <Link to={localize(`/posts/${encodeURIComponent(p.slug)}`)}>{p.title}</Link>
                        </h3>
                        <p className="story-list-card__excerpt">{p.excerpt || ''}</p>
                        <div className="story-list-card__meta">
                          <span className="story-list-card__chip">
                            {scope === 'all'
                              ? chipForMeta(p.meta?.khayah_story_scope ?? '')
                              : chipForScope(scope)}
                          </span>
                          <time className="story-list-card__date" dateTime={p.publishedAt}>
                            {formatDotDate(p.publishedAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <div className="story-archive__actions">
                <Pagination
                  page={paged.page}
                  totalPages={paged.totalPages}
                  onChange={setListPage}
                  label={st.pagination}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
