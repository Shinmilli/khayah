import { type CSSProperties, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveImpactStatIcon } from '../impactStatIcons'
import {
  DEFAULT_IMPACT_STATS,
  formatImpactPercent,
  impactStatsForLocale,
  visibleImpactStats,
  visiblePrimaryCards,
  type ImpactPrimaryCardView,
  type ImpactStatsPublicView,
} from '../impactStatsTypes'
import { fetchImpactStats } from '../../../services/api'
import { useLocale } from '../../../i18n/LocaleContext'
import { ImpactStack } from './ImpactStack'

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:')
}

function primaryCardStyle(card: ImpactPrimaryCardView): CSSProperties {
  const c = card.colors
  return {
    background: c.cardBg,
    '--impact-kicker': c.kicker,
    '--impact-title': c.title,
    '--impact-desc': c.desc,
    '--impact-cta-bg': c.ctaBg,
    '--impact-cta-text': c.ctaText,
    '--donut-fill': c.donutFill,
    '--donut-track': c.donutTrack,
    '--donut-hole': c.donutHole,
    '--donut-value': c.donutValue,
    '--donut-sub': c.donutSub,
  } as CSSProperties
}

export function ImpactSection() {
  const { locale, messages, localize } = useLocale()
  const m = messages.home.impact
  const [idx, setIdx] = useState(0)
  const [content, setContent] = useState<ImpactStatsPublicView>(() => impactStatsForLocale(DEFAULT_IMPACT_STATS, 'ko'))

  useEffect(() => {
    let cancelled = false
    fetchImpactStats(locale)
      .then((doc) => {
        if (!cancelled) setContent(doc)
      })
      .catch(() => {
        if (!cancelled) setContent(impactStatsForLocale(DEFAULT_IMPACT_STATS, locale))
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  const rotator = content.intro.rotator.map((t) => t.trim()).filter(Boolean)
  const rotatorLen = rotator.length

  useEffect(() => {
    if (rotatorLen < 2) return
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % rotatorLen)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [rotatorLen])

  const primaryCards = visiblePrimaryCards(content.primaryCards)
  const statsVisible = visibleImpactStats(content.stats)
  const compactPrimary = primaryCards.length > 1
  const statsSlot = 3
  const statsVisibleCount = statsVisible.length <= 1 ? 1 : statsSlot
  const intro = content.intro

  return (
    <section className="impact-banner" id="support" aria-label={m.aria}>
      <header className="home-section-intro impact-banner__intro impact-banner__align-col">
        {intro.kicker.trim() ? <p className="home-section-intro__kicker">{intro.kicker}</p> : null}
        {intro.title.trim() ? <h2 className="home-section-intro__title">{intro.title}</h2> : null}
        {intro.subtitle.trim() ? <p className="home-section-intro__sub">{intro.subtitle}</p> : null}
      </header>

      <div className="impact-banner__visual">
        <div
          className="impact-banner__bg"
          aria-hidden="true"
          style={{ backgroundImage: `url(${content.backgroundImageUrl})` }}
        />

        {rotatorLen > 0 ? (
          <div className="impact-banner__visual-text impact-banner__align-col">
            <div className="impact-banner__rotator" aria-live="polite">
              {rotator.map((t, i) => (
                <p
                  key={`${t}-${i}`}
                  className={`impact-rotator__item${i === idx ? ' is-active' : ''}`}
                  style={{ color: content.introColors.rotator }}
                >
                  {t}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className={`impact-banner__inner impact-banner__align-col${
            statsVisible.length === 0 ? ' impact-banner__inner--solo' : ''
          }${primaryCards.length === 0 ? ' impact-banner__inner--stats-only' : ''}`}
        >
          {primaryCards.length > 0 ? (
            <ImpactStack
              className={`impact-primaries${compactPrimary ? ' impact-primaries--compact' : ''}`}
              axis="x"
              items={primaryCards.map((card) => (
                <PrimaryImpactCard key={card.id} card={card} compact={compactPrimary} localize={localize} ariaFn={m.donutAria} />
              ))}
              visible={1}
              ariaLabel={m.aria}
              prevLabel={locale === 'en' ? 'Previous highlight' : '이전 카드'}
              nextLabel={locale === 'en' ? 'Next highlight' : '다음 카드'}
            />
          ) : null}

          {statsVisible.length > 0 ? (
            <ImpactStack
              className="impact-stats"
              axis="y"
              items={statsVisible.map((row) => {
                const unit = row.unit.trim()
                return (
                  <div
                    key={row.id}
                    className="impact-stat"
                    role="listitem"
                    style={{ background: row.colors.cardBg }}
                  >
                    <div className="impact-stat__text">
                      <div className="impact-stat__label" style={{ color: row.colors.label }}>
                        {row.label}
                      </div>
                      <div className="impact-stat__value" style={{ color: row.colors.value }}>
                        <span className="num">{row.value.trim() || '—'}</span>
                        {unit ? (
                          <span className="unit" style={{ color: row.colors.unit }}>
                            {unit}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className="impact-stat__icon"
                      aria-hidden="true"
                      style={{ background: row.colors.iconBg, color: row.colors.iconColor }}
                    >
                      <span className="material-symbols-outlined">
                        {resolveImpactStatIcon(row.icon, row.id)}
                      </span>
                    </div>
                  </div>
                )
              })}
              visible={statsVisibleCount}
              ariaLabel={m.statsAria}
              prevLabel={locale === 'en' ? 'Previous stats' : '이전 지표'}
              nextLabel={locale === 'en' ? 'Next stats' : '다음 지표'}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function PrimaryImpactCard({
  card,
  compact,
  localize,
  ariaFn,
}: {
  card: ImpactPrimaryCardView
  compact: boolean
  localize: (path: string) => string
  ariaFn: (percent: string, label: string) => string
}) {
  const labelLines = card.donut.labelLines.map((line) => line.trim()).filter(Boolean)
  const percentText = formatImpactPercent(card.donut.percent)
  const href = card.ctaHref.trim()
  const ctaLabel = card.ctaLabel.trim()

  return (
    <article
      className={`impact-card impact-card--primary${compact ? ' impact-card--compact' : ''}`}
      style={primaryCardStyle(card)}
      role="listitem"
    >
      {card.kicker.trim() ? <p className="impact-card__kicker">{card.kicker}</p> : null}
      <div className="impact-card__content">
        <div className="impact-card__head">
          {card.title.trim() ? <h3 className="impact-card__title">{card.title}</h3> : null}
          {card.desc.trim() ? <p className="impact-card__desc">{card.desc}</p> : null}
        </div>
      </div>

      <div className="donut" style={{ '--p': card.donut.percent } as CSSProperties} aria-label={ariaFn(percentText, labelLines.join(' '))}>
        <div className="donut__center">
          <div className="donut__value">{percentText}</div>
          {labelLines.length > 0 ? (
            <div className="donut__sub">
              {labelLines.map((line, i) => (
                <span key={`${line}-${i}`}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {href && ctaLabel ? (
        isExternalHref(href) ? (
          <a className="impact-card__cta" href={href} target="_blank" rel="noreferrer">
            {ctaLabel}
          </a>
        ) : (
          <Link className="impact-card__cta" to={localize(href.startsWith('/') ? href : `/${href}`)}>
            {ctaLabel}
          </Link>
        )
      ) : null}
    </article>
  )
}
