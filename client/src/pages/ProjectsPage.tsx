import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { fetchPostsByKindAndRegion } from '../services/api'
import type { Post } from '../types/post'
import { paginate } from '../utils/paginate'
import '../styles/projects.css'

const REGIONS = ['전체', '네팔', '키르기즈스탄', '미얀마', '국내'] as const
type Region = (typeof REGIONS)[number]

function normalizeRegion(param: string | undefined): Region {
  if (!param) return '전체'
  const decoded = decodeURIComponent(param)
  const match = REGIONS.find((r) => r === decoded)
  return match ?? '전체'
}

export function ProjectsPage() {
  const params = useParams()
  const region = useMemo(() => normalizeRegion(params.region), [params.region])
  const [rows, setRows] = useState<Post[]>([])
  const [listPage, setListPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setListPage(1)
    fetchPostsByKindAndRegion('진행사업', region === '전체' ? null : region, 1, 50)
      .then((res) => {
        if (!cancelled) setRows(res.posts)
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : '목록을 불러오지 못했습니다.'
        if (!cancelled) setError(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [region])

  const paged = paginate(rows, listPage, 6)

  return (
    <div className="projects-page">
      <PageHero title="진행사업" />

      <div className="projects-wrap">
        <nav className="projects-tabs" aria-label="진행사업 지역 필터">
          {REGIONS.map((r) => {
            const active = r === region
            const to = r === '전체' ? '/사업/진행사업' : `/사업/진행사업/${encodeURIComponent(r)}`
            return (
              <Link key={r} to={to} className={`projects-tab${active ? ' is-active' : ''}`}>
                {r}
              </Link>
            )
          })}
        </nav>

        {loading ? (
          <p className="projects-state">불러오는 중…</p>
        ) : error ? (
          <p className="projects-state">{error}</p>
        ) : rows.length === 0 ? (
          <p className="projects-state">등록된 진행사업 콘텐츠가 없습니다.</p>
        ) : (
          <>
          <ul className="projects-list" aria-label="진행사업 목록">
            {paged.items.map((p) => (
              <li key={p.id} className="projects-item">
                <div className="projects-thumb" aria-hidden="true" />
                <div className="projects-meta">
                  <div className="projects-meta__top">
                    <time className="projects-date" dateTime={p.publishedAt}>
                      {new Date(p.publishedAt).toLocaleDateString('ko-KR')}
                    </time>
                    {p.meta?.khayah_project_region ? (
                      <span className="projects-badge">{p.meta.khayah_project_region}</span>
                    ) : null}
                  </div>
                  <Link className="projects-title" to={`/posts/${encodeURIComponent(p.slug)}`}>
                    {p.title}
                  </Link>
                  <p className="projects-excerpt">{p.excerpt}</p>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            page={paged.page}
            totalPages={paged.totalPages}
            onChange={setListPage}
            label="진행사업 페이지"
          />
          </>
        )}
      </div>
    </div>
  )
}

