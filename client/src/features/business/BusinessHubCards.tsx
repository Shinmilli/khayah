import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleContext'
import { fetchBusinessHubCards } from '../../services/api'
import { BusinessHubCardIcon } from './businessHubCardIcons'
import {
  DEFAULT_BUSINESS_HUB_CARDS,
  isBusinessHubIcon,
  publicCardsFromDocument,
  type BusinessHub,
  type BusinessHubCardPublic,
} from './businessHubCardsTypes'

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:')
}

export function BusinessHubCards({ hub }: { hub: BusinessHub }) {
  const { locale, localize } = useLocale()
  const [cards, setCards] = useState<BusinessHubCardPublic[]>(() =>
    publicCardsFromDocument(DEFAULT_BUSINESS_HUB_CARDS, locale, hub),
  )

  useEffect(() => {
    let cancelled = false
    fetchBusinessHubCards(locale, hub)
      .then((doc) => {
        if (!cancelled) setCards(doc.cards)
      })
      .catch(() => {
        if (!cancelled) setCards(publicCardsFromDocument(DEFAULT_BUSINESS_HUB_CARDS, locale, hub))
      })
    return () => {
      cancelled = true
    }
  }, [locale, hub])

  if (cards.length === 0) return null

  const isOverseas = hub === 'overseas'
  const pageClass = isOverseas ? 'overseas-page' : 'domestic-page'
  const sectionClass = isOverseas ? 'overseas-cta' : 'domestic-cta'
  const wrapClass = isOverseas ? 'ov-wrap' : 'dom-wrap'
  const listClass = isOverseas ? 'overseas-cards' : 'domestic-cards'
  const cardClass = isOverseas ? 'overseas-card' : 'domestic-card'
  const iconClass = isOverseas ? 'overseas-icon' : 'domestic-card__icon'
  const titleClass = isOverseas ? 'overseas-card__title' : 'domestic-card__title'
  const descClass = isOverseas ? 'overseas-card__desc' : 'domestic-card__desc'
  const btnClass = isOverseas ? 'overseas-card__btn' : 'domestic-card__btn'
  const aria =
    hub === 'overseas'
      ? locale === 'en'
        ? 'Overseas program subpages'
        : '해외사업 하위 메뉴'
      : locale === 'en'
        ? 'Domestic program subpages'
        : '국내사업 하위 메뉴'

  return (
    <div className={pageClass}>
      <section className={sectionClass} aria-label={aria}>
        <div className={wrapClass}>
          <div className={listClass} data-count={cards.length}>
            {cards.map((card) => {
              const icon = isBusinessHubIcon(card.icon) ? card.icon : 'education'
              const href = card.href.trim()
              const to = href && !isExternalHref(href) ? localize(href) : href
              return (
                <div key={card.id} className={cardClass}>
                  <div className={iconClass} aria-hidden="true">
                    <BusinessHubCardIcon icon={icon} />
                  </div>
                  <h2 className={titleClass}>{card.title}</h2>
                  {card.description ? <p className={descClass}>{card.description}</p> : null}
                  {href ? (
                    isExternalHref(href) ? (
                      <a className={btnClass} href={href} target="_blank" rel="noreferrer">
                        {card.buttonLabel || (locale === 'en' ? 'Learn more' : '자세히 보기')}
                      </a>
                    ) : (
                      <Link className={btnClass} to={to}>
                        {card.buttonLabel || (locale === 'en' ? 'Learn more' : '자세히 보기')}
                      </Link>
                    )
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
