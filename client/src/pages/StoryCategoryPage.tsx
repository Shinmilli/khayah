import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type { ImpactStory } from '../features/impact/impactPageTypes'
import { StoryChangeSteps } from '../features/impact/StoryChangeSteps'
import { storyChangeSteps, storyTeaser } from '../features/impact/storyHelpers'
import { useImpactPage } from '../features/impact/useImpactPage'
import { PageHero } from '../components/PageHero'
import { Pagination } from '../components/Pagination'
import { paginate } from '../utils/paginate'
import { useLocale } from '../i18n/LocaleContext'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { normalizePathKey } from '../constants/pagesContent'
import { ListStatus } from '../components/ListStatus'
import '../styles/story.css'
import '../styles/page.css'
import '../styles/impact-page.css'

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

function catKey(category: ImpactStory['category']): StoryCat {
  return category === '전문가 이야기' ? 'expert' : 'change'
}

function publishedStories(stories: ImpactStory[] | undefined): ImpactStory[] {
  return (stories ?? []).filter((story) => story.consent && story.title.trim())
}

function storyIdFromPath(pathname: string): string {
  const pathKey = normalizePathKey(pathname)
  if (!pathKey.startsWith(`${PATH.newsStories}/`)) return ''
  return decodeURIComponent(pathKey.slice(`${PATH.newsStories}/`.length).split('/')[0] ?? '').trim()
}

export function StoryCategoryPage() {
  const { localize, messages } = useLocale()
  const st = messages.pages.stories
  const location = useLocation()
  const storyId = storyIdFromPath(location.pathname)
  const [searchParams, setSearchParams] = useSearchParams()
  const cat = parseCat(searchParams.get('cat'))
  const [listPage, setListPage] = useState(1)
  const impact = useImpactPage()
  const loading = impact === null
  const stories = useMemo(() => publishedStories(impact?.stories), [impact])
  const detail = useMemo(
    () => (storyId ? stories.find((item) => item.id === storyId) ?? null : null),
    [stories, storyId],
  )
  const items = useMemo(() => {
    if (cat === 'all') return stories
    const label = CAT_LABEL[cat]
    return stories.filter((story) => story.category === label)
  }, [stories, cat])
  const paged = paginate(items, listPage, 12)

  useEffect(() => {
    setListPage(1)
  }, [cat])

  if (storyId) {
    if (loading) {
      return (
        <div className="page-content-wrapper press-archive-page">
          <PageHero title={st.title} backgroundImageUrl={pageHeroImageForPath(PATH.newsStories)} />
          <div className="section">
            <div className="section_wrapper clearfix">
              <div className="column one">
                <ListStatus variant="loading" message={messages.pages.archive.loading} lines={5} />
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (!detail) {
      return (
        <div className="page-content-wrapper press-archive-page">
          <PageHero title={st.title} backgroundImageUrl={pageHeroImageForPath(PATH.newsStories)} />
          <div className="section">
            <div className="section_wrapper clearfix">
              <div className="column one">
                <ListStatus variant="empty" message={st.empty} />
                <p className="story-detail__back">
                  <Link to={localize('/news/stories')}>{st.title} 목록으로</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    const steps = storyChangeSteps(detail)
    const listTo = localize(`/news/stories?cat=${catKey(detail.category)}`)
    const isExpert = detail.category === '전문가 이야기'
    return (
      <div className="page-content-wrapper press-archive-page">
        <PageHero title={st.title} backgroundImageUrl={pageHeroImageForPath(PATH.newsStories)} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <article className="story-detail">
                <div className="story-detail__hero">
                  <div className="story-detail__photo">
                    {detail.expertPhoto ? <img src={detail.expertPhoto} alt="" /> : <span>현장 사진</span>}
                  </div>
                  <div className="story-detail__intro">
                    <span className={`impact-pill${isExpert ? ' is-expert' : ''}`}>{detail.category}</span>
                    {detail.project ? <p className="story-detail__project">{detail.project}</p> : null}
                    <h1 className="story-detail__title">{detail.title}</h1>
                    {isExpert ? (
                      <>
                        {detail.expertLine ? <p className="impact-quote-text">“{detail.expertLine}”</p> : null}
                        {detail.expertName || detail.expertOrg || detail.expertField ? (
                          <div className="impact-person">
                            {detail.expertPhoto ? <img src={detail.expertPhoto} alt="" /> : <i />}
                            <div>
                              <b>{detail.expertName}</b>
                              <span>{[detail.expertOrg, detail.expertField].filter(Boolean).join(' · ')}</span>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                    {detail.body?.trim() ? (
                      <div className="story-detail__body" dangerouslySetInnerHTML={{ __html: detail.body }} />
                    ) : null}
                  </div>
                </div>
                {!isExpert ? <StoryChangeSteps steps={steps} /> : null}
                <p className="story-detail__back">
                  <Link to={listTo}>{detail.category} 목록으로</Link>
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs: Array<{ key: StoryCat; label: string }> = [
    { key: 'all', label: st.all },
    { key: 'change', label: CAT_LABEL.change },
    { key: 'expert', label: CAT_LABEL.expert },
  ]

  const selectCat = (next: StoryCat) => {
    const nextParams = new URLSearchParams(searchParams)
    if (next === 'all') nextParams.delete('cat')
    else nextParams.set('cat', next)
    setSearchParams(nextParams, { replace: true })
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
              {!loading && items.length === 0 ? <ListStatus variant="empty" message={st.empty} /> : null}
              {!loading && items.length > 0 ? (
                <div className="archive-board">
                  <div className="archive-board__head" aria-hidden="true">
                    <span>{messages.pages.archive.colTitle}</span>
                    <span className="archive-board__head-action">{messages.pages.archive.colAction}</span>
                  </div>
                  <ul className="press-archive__list" aria-label={st.listAria}>
                    {paged.items.map((story) => {
                      const blurb = storyTeaser(story, 120)
                      return (
                        <li key={story.id} className="press-archive__item">
                          <div className="press-archive__text">
                            <p className="press-archive__headline">
                              <span className="press-archive__source-wrap" aria-label={story.category}>
                                <span className="press-archive__bracket">[</span>
                                <span className="press-archive__source">{story.category}</span>
                                <span className="press-archive__bracket">]</span>
                              </span>{' '}
                              <span className="press-archive__article-title">{story.title}</span>
                            </p>
                            {blurb ? <p className="press-archive__summary">{blurb}</p> : null}
                          </div>
                          <Link
                            className="press-archive__btn"
                            to={localize(`/news/stories/${encodeURIComponent(story.id)}`)}
                          >
                            글 바로보기
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
              {!loading && items.length > 0 ? (
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
