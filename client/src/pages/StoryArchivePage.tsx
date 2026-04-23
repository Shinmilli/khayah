import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import { PageHero } from '../components/PageHero'
import '../styles/story.css'

type StoryScopeKey = 'all' | 'domestic' | 'overseas' | 'advocacy' | 'support'

const scopeLabels: Record<Exclude<StoryScopeKey, 'all'>, string> = {
  domestic: '국내',
  overseas: '해외',
  advocacy: '옹호',
  support: '지원',
}

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

function scopeToChip(scope: Exclude<StoryScopeKey, 'all'>): string {
  switch (scope) {
    case 'domestic':
      return '국내사업'
    case 'overseas':
      return '해외사업'
    case 'advocacy':
      return '옹호사업'
    case 'support':
      return '진행사업'
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
  const initialScope = parseScope(params.scope ?? query.get('scope'))

  const [scope, setScope] = useState<StoryScopeKey>(initialScope)
  const [visibleCount, setVisibleCount] = useState(12)
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
    return posts.filter((p) => (p.meta?.khayah_story_scope ?? '') === meta || (meta === '지원' && (p.meta?.khayah_story_scope ?? '') === '진행'))
  }, [posts, scope])

  const visibleItems = items.slice(0, visibleCount)
  const canLoadMore = visibleCount < items.length

  const scopeTabs: Array<{ key: StoryScopeKey; label: string }> = [
    { key: 'all', label: '전체' },
    { key: 'domestic', label: '국내' },
    { key: 'overseas', label: '해외' },
    { key: 'advocacy', label: '옹호' },
    { key: 'support', label: '지원' },
  ]

  const title = scope === 'all' ? '스토리' : `${scopeLabels[scope]}사업`

  return (
    <div className="page-content-wrapper">
      <PageHero title="스토리" />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <div className="story-archive">
              <header className="story-archive__head">
                <div className="story-archive__title-row">
                  <h2 className="story-archive__title">{title}</h2>
                </div>
                <p className="story-archive__sub">우리들이 전하는 이야기</p>
                <nav className="story-filter" aria-label="스토리 범위 선택">
                  {scopeTabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`story-filter__btn${scope === t.key ? ' is-active' : ''}`}
                      onClick={() => {
                        setScope(t.key)
                        setVisibleCount(12)
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </header>

              <section className="story-archive__grid" aria-label="스토리 목록">
                {visibleItems.map((p) => (
                  <article key={p.id} className="story-archive__item">
                    <div className="story-list-card">
                      <div className="story-list-card__thumb">
                        <img
                          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="story-list-card__body">
                        <h3 className="story-list-card__title">
                          <Link to={`/posts/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
                        </h3>
                        <p className="story-list-card__excerpt">{p.excerpt || ''}</p>
                        <div className="story-list-card__meta">
                          <span className="story-list-card__chip">
                            {scope === 'all'
                              ? (() => {
                                  const s = p.meta?.khayah_story_scope ?? ''
                                  if (s === '국내') return '국내사업'
                                  if (s === '해외') return '해외사업'
                                  if (s === '옹호') return '옹호사업'
                                  if (s === '지원' || s === '진행') return '진행사업'
                                  return '스토리'
                                })()
                              : scopeToChip(scope)}
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
                {canLoadMore ? (
                  <button type="button" className="story-more-btn" onClick={() => setVisibleCount((n) => n + 12)}>
                    스토리 더보기
                  </button>
                ) : (
                  <p className="story-archive__hint" role="status">
                    {scope === 'all' ? '모든 스토리를 확인했습니다.' : `${scopeLabels[scope]} 스토리를 모두 확인했습니다.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

