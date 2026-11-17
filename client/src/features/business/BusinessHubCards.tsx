import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleContext'
import { useBizSupport } from '../biz/useBizSupport'
import { filterNavLinks, NAV_MENU_COLUMNS } from '../nav/navVisibilityTypes'
import { useNavVisibility } from '../nav/useNavVisibility'
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
  const { locale, localize, messages } = useLocale()
  const visibility = useNavVisibility()
  const biz = useBizSupport()
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

  const autoCards =
    locale === 'ko' && biz?.otherBusiness === 'auto'
      ? (NAV_MENU_COLUMNS.find((col) => col.topKey === 'business')
          ?.links.find((link) => link.key === (hub === 'domestic' ? 'domestic' : 'overseas'))
          ?.children ?? []
        ).map((link) => ({
          id: link.key,
          hub,
          title: messages.nav.links[link.key],
          description: '',
          href: link.to,
          buttonLabel: '자세히 보기',
          icon: 'education' as const,
        }))
      : null
  const shown = autoCards ?? cards
  if (shown.length === 0) return null

  if (locale === 'ko' && (hub === 'domestic' || hub === 'overseas')) {
    const others = filterNavLinks(
      NAV_MENU_COLUMNS.find((col) => col.topKey === 'business')?.links ?? [],
      visibility,
    ).filter((section) => section.key !== hub)
    const programsLabel = hub === 'overseas' ? '해외사업 분야' : '국내사업 분야'
    const programCards = cards.length > 0 ? cards : shown
    return (
      <>
        <section className="dom-programs" aria-label={programsLabel}>
          <div className="dom-wrap">
            <p className="dom-kicker">PROGRAMS · {programsLabel}</p>
            <div className="dom-programs__row">
              {programCards.map((card) => {
                const href = card.href.trim()
                const label = (card.buttonLabel || '자세히 보기').replace(/\s*→\s*$/, '')
                const body = (
                  <>
                    <span className="dom-ic__icon" aria-hidden="true">
                      {card.icon === 'education' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10L12 5 2 10l10 5 10-5z" />
                          <path d="M6 12v5c3 2 9 2 12 0v-5" />
                        </svg>
                      ) : card.icon === 'volunteer' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="8" r="3.5" />
                          <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" />
                          <circle cx="17" cy="9" r="2.5" />
                          <path d="M16 14.6c2.6.2 4.6 2 5.3 4.9" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                      )}
                    </span>
                    <span className="dom-ic__title">{card.title}</span>
                    {card.description ? <span className="dom-ic__desc">{card.description}</span> : null}
                    {href ? <span className="dom-ic__more">{label} →</span> : null}
                  </>
                )
                if (!href) {
                  return (
                    <div key={card.id} className="dom-ic">
                      {body}
                    </div>
                  )
                }
                return isExternalHref(href) ? (
                  <a key={card.id} className="dom-ic" href={href} target="_blank" rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <Link key={card.id} className="dom-ic" to={localize(href)}>
                    {body}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
        {others.length > 0 ? (
          <section className="dom-more" aria-label="다른 사업 보기">
            <div className="dom-wrap">
              <p className="dom-kicker">MORE · 다른 사업 보기</p>
              <div className="dom-more__row">
                {others.map((section) => (
                  <Link key={section.key} className="dom-go" to={localize(section.to)}>
                    {messages.nav.links[section.key]}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </>
    )
  }

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
            {shown.map((card) => {
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
