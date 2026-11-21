import { Link } from 'react-router-dom'
import { useLocale } from '../../../i18n/LocaleContext'
import { useImpactPage } from '../../impact/useImpactPage'
import type { ImpactStory } from '../../impact/impactPageTypes'
import { storyTeaser } from '../../impact/storyHelpers'

export function StorySection() {
  return <HomeStories />
}

function categoryLabel(category: ImpactStory['category'], change: string, expert: string): string {
  return category === '전문가 이야기' ? expert : change
}

function storyListHref(localize: (path: string) => string, category?: ImpactStory['category'] | null): string {
  if (category === '전문가 이야기') return localize('/news/stories?cat=expert')
  if (category === '변화의 이야기') return localize('/news/stories?cat=change')
  return localize('/news/stories')
}

function storyDetailHref(localize: (path: string) => string, story: ImpactStory): string {
  return localize(`/news/stories/${encodeURIComponent(story.id)}`)
}

function storyPublishedTime(story: ImpactStory): number {
  const time = Date.parse(story.publishedAt?.trim() ?? '')
  return Number.isNaN(time) ? 0 : time
}

/** 등록일 최신순. 같은 날이면 문서에 저장된 순서를 유지한다. */
function newestFirst(stories: ImpactStory[]): ImpactStory[] {
  return stories
    .map((story, index) => ({ story, index }))
    .sort((a, b) => {
      const delta = storyPublishedTime(b.story) - storyPublishedTime(a.story)
      return delta !== 0 ? delta : a.index - b.index
    })
    .map((row) => row.story)
}

function HomeStories() {
  const { localize, messages } = useLocale()
  const copy = messages.home.story
  const impact = useImpactPage()
  const published = (impact?.stories ?? []).filter((story) => story.consent && story.title.trim())
  const featured = newestFirst(published.filter((story) => story.featured))[0] ?? null
  const rest = newestFirst(published.filter((story) => story.id !== featured?.id)).slice(0, 3)
  const featuredCategory = featured ? categoryLabel(featured.category, copy.categoryChange, copy.categoryExpert) : null
  const featuredTeaser = featured ? storyTeaser(featured) : ''
  const listHref = localize('/news/stories')
  const featuredHref = featured ? storyDetailHref(localize, featured) : storyListHref(localize, '변화의 이야기')

  return (
    <section className="home-stories" aria-labelledby="home-stories-title">
      <div className="home-stories__head">
        <div>
          <p className="home-stories__kicker">{copy.kicker.toUpperCase()}</p>
          <h2 id="home-stories-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <Link to={listHref}>{copy.viewAll} →</Link>
      </div>
      {featured ? (
        <Link className="home-stories__lead" to={featuredHref}>
          <div className="home-stories__lead-photo">
            {featured.expertPhoto ? (
              <img src={featured.expertPhoto} alt="" />
            ) : (
              <div className="home-stories__slot" aria-hidden="true" />
            )}
          </div>
          <div className="home-stories__lead-copy">
            <span className={featured?.category === '전문가 이야기' ? 'is-expert' : 'is-change'}>
              {featuredCategory ? `${copy.featuredLabel} · ${featuredCategory}` : copy.featuredLabel}
            </span>
            <p className="home-stories__lead-title">{featured.title}</p>
            {featuredTeaser ? <p>{featuredTeaser}</p> : null}
            {featuredCategory ? <p className="home-stories__more">{copy.viewCategory(featuredCategory)} →</p> : null}
          </div>
        </Link>
      ) : published.length === 0 ? (
        <Link className="home-stories__lead" to={storyListHref(localize, '변화의 이야기')}>
          <div className="home-stories__lead-photo home-stories__slot" aria-hidden="true" />
          <div className="home-stories__lead-copy">
            <span className="is-change">{copy.featuredLabel} · {copy.categoryChange}</span>
            <p className="home-stories__lead-title">{copy.emptyLeadTitle}</p>
            <p>{copy.emptyLeadBody}</p>
            <p className="home-stories__more">{copy.viewCategory(copy.categoryChange)} →</p>
          </div>
        </Link>
      ) : null}
      <div className="home-stories__grid">
        {rest.map((story) => (
          <Link key={story.id} to={storyDetailHref(localize, story)}>
            <div className="home-stories__thumb">
              {story.expertPhoto ? <img src={story.expertPhoto} alt="" /> : <div className="home-stories__slot" aria-hidden="true" />}
            </div>
            <p>
              <span className={story.category === '전문가 이야기' ? 'is-expert' : 'is-change'}>
                [{categoryLabel(story.category, copy.categoryChange, copy.categoryExpert)}]
              </span>{' '}
              {story.title}
            </p>
          </Link>
        ))}
        {published.length === 0
          ? Array.from({ length: 3 }, (_, index) => {
              const expert = index === 1
              return (
                <div key={`empty-${index}`} className="home-stories__card">
                  <div className="home-stories__thumb home-stories__slot" aria-hidden="true" />
                  <p>
                    <span className={expert ? 'is-expert' : 'is-change'}>
                      {expert ? `[${copy.categoryExpert}]` : `[${copy.categoryChange}]`}
                    </span>{' '}
                    {expert ? copy.emptyExpert : copy.emptyChange}
                  </p>
                </div>
              )
            })
          : null}
      </div>
    </section>
  )
}
