import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DEFAULT_IMPACT_STATS,
  formatImpactPercent,
  visibleImpactStats,
  type ImpactStatsLocaleContent,
} from '../impactStatsTypes'
import { fetchImpactStats } from '../../../services/api'
import { useLocale } from '../../../i18n/LocaleContext'
import { PATH } from '../../../i18n/routes'

export function ImpactSection() {
  const { locale, messages, localize } = useLocale()
  const m = messages.home.impact
  const [idx, setIdx] = useState(0)
  const [content, setContent] = useState<ImpactStatsLocaleContent>(DEFAULT_IMPACT_STATS.locales.ko)
  const visualRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchImpactStats(locale)
      .then((doc) => {
        if (!cancelled) setContent(doc)
      })
      .catch(() => {
        if (!cancelled) setContent(DEFAULT_IMPACT_STATS.locales[locale])
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % m.rotator.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [m.rotator.length])

  useEffect(() => {
    const impactBannerBg = bgRef.current
    if (!impactBannerBg) return
    impactBannerBg.style.removeProperty('transform')
  }, [])

  const { donut, stats } = content
  const labelLines = donut.labelLines.map((line) => line.trim()).filter(Boolean)
  const donutLabelText = labelLines.join(' ')
  const statsVisible = visibleImpactStats(stats)
  const percentText = formatImpactPercent(donut.percent)

  return (
    <section className="impact-banner" id="support" aria-label={m.aria}>
      <header className="impact-banner__intro impact-banner__align-col">
        <h2 className="impact-banner__title">{m.title}</h2>
        <p className="impact-banner__sub">{m.subtitle}</p>
      </header>

      <div ref={visualRef} className="impact-banner__visual">
        <div ref={bgRef} className="impact-banner__bg" aria-hidden="true" />

        <div className="impact-banner__visual-text impact-banner__align-col">
          <div className="impact-banner__rotator" aria-live="polite">
            {m.rotator.map((t, i) => (
              <p key={t} className={`impact-rotator__item${i === idx ? ' is-active' : ''}`}>
                {t}
              </p>
            ))}
          </div>
        </div>

        <div className="impact-banner__inner">
          <article className="impact-card impact-card--primary">
            <div className="impact-card__content">
              <div className="impact-card__head">
                <h3 className="impact-card__title">{m.cardTitle}</h3>
                <p className="impact-card__desc">{m.cardDesc}</p>
              </div>
            </div>

            <div
              className="donut"
              style={{ '--p': donut.percent } as CSSProperties}
              aria-label={m.donutAria(percentText, donutLabelText)}
            >
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

            <Link className="impact-card__cta" to={localize(`/${PATH.newsFinancialReport}`)}>
              {m.cta}
            </Link>
          </article>

          {statsVisible.length > 0 ? (
            <div className="impact-stats" role="list" aria-label={m.statsAria}>
              {statsVisible.map((row) => {
                const unit = row.unit?.trim() ?? ''
                return (
                  <div key={row.id} className="impact-stat" role="listitem">
                    <div className="impact-stat__text">
                      <div className="impact-stat__label">{row.label}</div>
                      <div className="impact-stat__value">
                        <span className="num">{row.value.trim() || '—'}</span>
                        {unit ? <span className="unit">{unit}</span> : null}
                      </div>
                    </div>
                    <div className="impact-stat__icon" aria-hidden="true" />
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
