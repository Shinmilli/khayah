import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BusinessSectionNav } from '../components/BusinessSectionNav'
import { ProjectSetList } from '../components/ProjectSetList'
import { ProjectListIntro } from '../components/ProjectListIntro'
import { PageBlocks } from '../features/biz/PageBlocks'
import { useBizSupport } from '../features/biz/useBizSupport'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { fetchPostsByKindAndRegion } from '../services/api'
import type { Post } from '../types/post'
import { paginate } from '../utils/paginate'
import { useLocale } from '../i18n/LocaleContext'
import { PATH, PROJECT_SLUG_TO_REGION, canonicalProjectRegion, projectRegionHref } from '../i18n/routes'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import {
  DOMESTIC_PROJECTS,
  OVERSEAS_PROJECTS,
  RESEARCH_PROJECTS,
  projectsByField,
} from '../features/projects/projectCatalog'
import { PROJECT_FIELDS } from '../features/projects/projectSetTypes'
import { publicSetsFor, type ProjectListKind } from '../features/projects/publicProjectSets'
import { useProjectSets } from '../features/projects/useProjectSets'
import { ListStatus } from '../components/ListStatus'
import { PostCoverThumb } from '../components/PostCoverThumb'
import { postCoverMedia } from '../utils/postMedia'
import '../styles/projects.css'

const REGIONS = ['전체', '해외', '국내', '연구사업'] as const
type Region = (typeof REGIONS)[number]
type FixedRegion = Exclude<Region, '전체'>

function normalizeRegion(param: string | undefined): Region {
  if (!param) return '전체'
  const decoded = decodeURIComponent(param)
  const fromSlug = PROJECT_SLUG_TO_REGION[decoded]
  if (fromSlug && REGIONS.includes(fromSlug as Region)) return fromSlug as Region
  const match = REGIONS.find((r) => r === decoded)
  return match ?? '전체'
}

function projectCoverUrl(post: Post): string | undefined {
  const media = postCoverMedia(post)
  if (media.kind === 'image') return media.src
  if (media.kind === 'video') return media.poster || media.src
  return undefined
}

export function ProjectsPage({
  fixedRegion,
  projectList,
}: {
  fixedRegion?: FixedRegion
  projectList?: ProjectListKind
}) {
  const params = useParams()
  const { locale, localize, messages } = useLocale()
  const projectSets = useProjectSets()
  const biz = useBizSupport()
  const pj = messages.pages.projects
  const regionLabels: Record<Region, string> = {
    전체: pj.regions.all,
    해외: pj.regions.overseas,
    국내: pj.regions.domestic,
    연구사업: pj.regions.research,
  }
  const region = useMemo(
    () => fixedRegion ?? normalizeRegion(params.region),
    [fixedRegion, params.region],
  )
  const heroPath =
    projectList === 'overseas-education'
      ? PATH.businessOverseasEducationProjects
      : projectList === 'volunteer'
        ? PATH.businessVolunteerProjects
        : region === '국내'
          ? PATH.businessDomesticProjects
          : region === '해외'
            ? PATH.businessOverseasProjects
            : region === '연구사업'
              ? PATH.businessResearchProjects
              : PATH.businessProjects
  const fallbackTitle =
    locale === 'ko' && projectList === 'overseas-education'
      ? '해외 교육 진행사업'
      : locale === 'ko' && projectList === 'volunteer'
        ? '해외봉사단 진행사업'
        : region === '국내'
          ? messages.nav.links.domesticProjects
          : region === '해외'
            ? messages.nav.links.overseasProjects
            : region === '연구사업'
              ? messages.nav.links.researchProjects
              : pj.title
  const live = locale === 'ko' && projectList && projectSets ? publicSetsFor(projectSets, projectList) : null
  const title = live?.title || fallbackTitle
  const catalog =
    live ??
    (locale !== 'ko' || !projectList
      ? null
      : projectList === 'domestic'
        ? { items: DOMESTIC_PROJECTS, eyebrow: 'PROGRAMS · 국내 진행사업', recentFromYear: 2020 }
        : projectList === 'overseas'
          ? {
              items: OVERSEAS_PROJECTS,
              eyebrow: 'PROGRAMS · 해외 진행사업',
              recentFromYear: 2024,
              fields: PROJECT_FIELDS,
            }
          : projectList === 'overseas-education'
            ? {
                items: projectsByField(OVERSEAS_PROJECTS, '교육'),
                eyebrow: 'PROGRAMS · 해외 교육 진행사업',
                recentFromYear: 2024,
              }
            : projectList === 'volunteer'
              ? {
                  items: projectsByField(OVERSEAS_PROJECTS, '해외봉사단'),
                  eyebrow: 'PROGRAMS · 해외봉사단 진행사업',
                  recentFromYear: 2024,
                }
              : {
                  items: RESEARCH_PROJECTS,
                  eyebrow: 'PROGRAMS · 연구사업 진행사업',
                  recentFromYear: 2020,
                })
  const [rows, setRows] = useState<Post[]>([])
  const [listPage, setListPage] = useState(1)
  const [loading, setLoading] = useState(true)
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
  const koBiz = locale === 'ko' && Boolean(projectList)
  const middleId = projectList === 'research' ? 'flow' : projectList === 'overseas-education' ? null : 'cards'
  const coreIds = ['photo', 'intro', ...(middleId ? [middleId] : [])]
  const savedPanels = live?.panels ?? []
  const arranged = koBiz && savedPanels.some((row) => {
    const index = coreIds.indexOf(row.id)
    return index >= 0 && (row.removed === true || row.enabled === false || row.order !== index)
  })
  const ordered = coreIds
    .map((id) => {
      const row = savedPanels.find((item) => item.id === id)
      return { id, order: row?.order ?? coreIds.indexOf(id), enabled: row?.enabled !== false, removed: row?.removed === true }
    })
    .filter((row) => !row.removed)
    .sort((a, b) => a.order - b.order)
  const introFields = live
    ? {
        kicker: live.introKicker,
        kickerKo: live.introKickerKo,
        title: live.introTitle,
        emphasis: live.emphasis,
        lead: live.lead,
        align: live.align,
        photoSide: live.photoSide,
        band: live.band,
      }
    : undefined
  const introNode = (part: 'all' | 'intro' | 'facts' | 'flow') =>
    koBiz && projectList ? (
      <ProjectListIntro kind={projectList} cards={live?.cards} flow={live?.flow} intro={introFields} part={part} />
    ) : null
  const heroNode = (
      <PageHero
        title={title}
        backgroundImageUrl={live?.photo || pageHeroImageForPath(heroPath)}
        layout={
          locale === 'ko' &&
          (projectList === 'domestic' ||
            projectList === 'overseas' ||
            projectList === 'overseas-education' ||
            projectList === 'volunteer' ||
            projectList === 'research')
            ? 'biz'
            : 'banner'
        }
        eyebrow={
          locale === 'ko' && projectList
            ? live?.heroLabel ||
              (projectList === 'domestic'
                ? 'DOMESTIC PROGRAMS'
                : projectList === 'overseas-education'
                  ? 'OVERSEAS · EDUCATION'
                  : projectList === 'volunteer'
                    ? 'OVERSEAS · VOLUNTEERS'
                    : projectList === 'overseas'
                      ? 'OVERSEAS PROGRAMS'
                      : projectList === 'research'
                        ? 'RESEARCH'
                        : undefined)
            : undefined
        }
        showScrollHint={
          !(
            locale === 'ko' &&
            (projectList === 'domestic' ||
              projectList === 'overseas' ||
              projectList === 'overseas-education' ||
              projectList === 'volunteer' ||
              projectList === 'research')
          )
        }
      />
  )

  return (
    <div className="projects-page">
      {arranged ? (
        <>
          {ordered.some((row) => row.id === 'photo' && row.enabled) ? null : <BusinessSectionNav />}
          {ordered.map((row) => {
            if (!row.enabled) return null
            if (row.id === 'photo') return <Fragment key="photo">{heroNode}<BusinessSectionNav /></Fragment>
            if (row.id === 'intro') return <Fragment key="intro">{introNode('intro')}</Fragment>
            return <Fragment key={row.id}>{introNode(row.id === 'flow' ? 'flow' : 'facts')}</Fragment>
          })}
        </>
      ) : (
        <>
          {heroNode}
          <BusinessSectionNav />
          {introNode('all')}
        </>
      )}
      {catalog ? (
        <ProjectSetList
          items={catalog.items}
          eyebrow={catalog.eyebrow}
          recentFromYear={catalog.recentFromYear}
          fields={'fields' in catalog ? catalog.fields : undefined}
        />
      ) : null}
      {locale === 'ko' && projectList ? (
        <PageBlocks blocks={[...(live?.blocks ?? []), ...(biz?.blocks ?? []).filter((block) => block.page === 'common')]} />
      ) : null}
      {locale === 'ko' && projectList === 'research' ? (
        <section className="dom-more dom-more--after">
          <div className="dom-wrap">
            <p className="dom-kicker">MORE · 다른 사업 보기</p>
            <div className="dom-more__row">
              <Link className="dom-go" to={localize('/business/domestic')}>
                국내사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/overseas')}>
                해외사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/social')}>
                소셜비즈니스
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      {locale === 'ko' && projectList === 'overseas' ? (
        <section className="dom-more dom-more--after">
          <div className="dom-wrap">
            <p className="dom-kicker">MORE · 다른 사업 보기</p>
            <div className="dom-more__row">
              <Link className="dom-go" to={localize('/business/domestic')}>
                국내사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/advocacy')}>
                연구사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/social')}>
                소셜비즈니스
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      {locale === 'ko' && projectList === 'volunteer' ? (
        <section className="dom-more dom-more--after">
          <div className="dom-wrap">
            <p className="dom-kicker">MORE · 다른 사업 보기</p>
            <div className="dom-more__row">
              <Link className="dom-go" to={localize('/business/overseas/education')}>
                해외 교육
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/domestic')}>
                국내사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/advocacy')}>
                연구사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      {locale === 'ko' && projectList === 'overseas-education' ? (
        <section className="dom-more dom-more--after">
          <div className="dom-wrap">
            <p className="dom-kicker">MORE · 다른 사업 보기</p>
            <div className="dom-more__row">
              <Link className="dom-go" to={localize('/business/overseas/volunteer')}>
                해외봉사단
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/domestic')}>
                국내사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/advocacy')}>
                연구사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      {locale === 'ko' && projectList === 'domestic' ? (
        <section className="dom-more dom-more--after">
          <div className="dom-wrap">
            <p className="dom-kicker">MORE · 다른 사업 보기</p>
            <div className="dom-more__row">
              <Link className="dom-go" to={localize('/business/overseas')}>
                해외사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/advocacy')}>
                연구사업
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="dom-go" to={localize('/business/social')}>
                소셜비즈니스
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {catalog ? null : (
      <div className="projects-wrap">
        <p className="projects-lead">{pj.lead}</p>
        {fixedRegion ? null : (
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
        )}

        {loading ? (
          <ListStatus variant="loading" message={pj.loading} lines={5} />
        ) : error ? (
          <ListStatus variant="error" message={error || pj.loadError} />
        ) : rows.length === 0 ? (
          <ListStatus variant="empty" message={pj.empty} />
        ) : (
          <>
          <ul className="projects-list" aria-label={pj.listAria}>
            {paged.items.map((p) => {
              const cover = projectCoverUrl(p)
              const detailTo = localize(`/posts/${encodeURIComponent(p.slug)}`)
              return (
              <li key={p.id} className="projects-item">
                <Link
                  to={detailTo}
                  state={{ postKind: '진행사업' }}
                  className={`projects-thumb${cover ? '' : ' projects-thumb--placeholder'}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {cover ? <PostCoverThumb post={p} /> : null}
                </Link>
                <div className="projects-meta">
                  <div className="projects-meta__top">
                    <time className="projects-date" dateTime={p.publishedAt}>
                      {new Date(p.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR')}
                    </time>
                    {p.meta?.khayah_project_region ? (
                      <span className="projects-badge">
                        {regionLabels[canonicalProjectRegion(p.meta.khayah_project_region) as Region] ??
                          canonicalProjectRegion(p.meta.khayah_project_region)}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    className="projects-title"
                    to={detailTo}
                    state={{ postKind: '진행사업' }}
                  >
                    {p.title}
                  </Link>
                  <p className="projects-excerpt">{p.excerpt}</p>
                </div>
              </li>
              )
            })}
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
      )}
    </div>
  )
}

