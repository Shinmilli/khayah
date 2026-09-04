import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { fetchPostsByKindAndRegion } from '../services/api'
import type { Post } from '../types/post'
import { paginate } from '../utils/paginate'
import { useLocale } from '../i18n/LocaleContext'
import { PROJECT_SLUG_TO_REGION, projectRegionHref } from '../i18n/routes'
import '../styles/projects.css'

const REGIONS = ['전체', '네팔', '키르기즈스탄', '미얀마', '국내'] as const
type Region = (typeof REGIONS)[number]

function normalizeRegion(param: string | undefined): Region {
  if (!param) return '전체'
  const decoded = decodeURIComponent(param)
  const fromSlug = PROJECT_SLUG_TO_REGION[decoded]
  if (fromSlug && REGIONS.includes(fromSlug as Region)) return fromSlug as Region
  const match = REGIONS.find((r) => r === decoded)
  return match ?? '전체'
}

export function ProjectsPage() {
  const params = useParams()
  const { locale, localize, messages } = useLocale()
  const pj = messages.pages.projects
  const regionLabels: Record<Region, string> = {
    전체: pj.regions.all,
    네팔: pj.regions.nepal,
    키르기즈스탄: pj.regions.kyrgyzstan,
    미얀마: pj.regions.myanmar,
    국내: pj.regions.domestic,
  }
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
        const msg = e instanceof Error ? e.message : pj.loadError
        if (!cancelled) setError(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [region, pj.loadError])

  const paged = paginate(rows, listPage, 6)

  return (
    <div className="projects-page">
      <PageHero title={pj.title} />

      <div className="projects-wrap">
        <nav className="projects-tabs" aria-label={pj.filterAria}>
          {REGIONS.map((r) => {
            const active = r === region
            const to = projectRegionHref(r, locale)
            return (
              <Link key={r} to={to} className={`projects-tab${active ? ' is-active' : ''}`}>
                {regionLabels[r]}
              </Link>
            )
          })}
        </nav>

        {loading ? (
          <p className="projects-state">{pj.loading}</p>
        ) : error ? (
          <p className="projects-state">{error}</p>
        ) : rows.length === 0 ? (
          <p className="projects-state">{pj.empty}</p>
        ) : (
          <>
          <ul className="projects-list" aria-label={pj.listAria}>
            {paged.items.map((p) => (
              <li key={p.id} className="projects-item">
                <div className="projects-thumb" aria-hidden="true" />
                <div className="projects-meta">
                  <div className="projects-meta__top">
                    <time className="projects-date" dateTime={p.publishedAt}>
                      {new Date(p.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR')}
                    </time>
                    {p.meta?.khayah_project_region ? (
                      <span className="projects-badge">
                        {regionLabels[p.meta.khayah_project_region as Region] ??
                          p.meta.khayah_project_region}
                      </span>
                    ) : null}
                  </div>
                  <Link className="projects-title" to={localize(`/posts/${encodeURIComponent(p.slug)}`)}>
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
            label={pj.pagination}
          />
          </>
        )}
      </div>
    </div>
  )
}

