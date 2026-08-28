import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DEFAULT_IMPACT_STATS,
  formatImpactPercent,
  visibleImpactStats,
  type ImpactStatsDocument,
} from '../impactStatsTypes'
import { fetchImpactStats } from '../../../services/api'

const ROTATOR_TEXT = [
  '01. 투명하게 증명합니다',
  '02. 현장의 변화를 우선합니다',
  '03. 소중한 마음을 연결합니다',
]

export function ImpactSection() {
  const [idx, setIdx] = useState(0)
  const [content, setContent] = useState<ImpactStatsDocument>(DEFAULT_IMPACT_STATS)
  const visualRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchImpactStats()
      .then((doc) => {
        if (!cancelled) setContent(doc)
      })
      .catch(() => {
        if (!cancelled) setContent(DEFAULT_IMPACT_STATS)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % ROTATOR_TEXT.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const impactBannerBg = bgRef.current
    if (!impactBannerBg) return
    impactBannerBg.style.removeProperty('transform')
  }, [])

  const { donut, stats } = content
  const labelLines = donut.labelLines.map((line) => line.trim()).filter(Boolean)
  const donutLabelText = labelLines.join(' ')
  const statsVisible = visibleImpactStats(stats)

  return (
    <section className="impact-banner" id="support" aria-label="후원금 사용 요약">
      <header className="impact-banner__intro impact-banner__align-col">
        <h2 className="impact-banner__title">나눔의 결실</h2>
        <p className="impact-banner__sub">함께 만든 희망의 열매들</p>
      </header>

      <div ref={visualRef} className="impact-banner__visual">
        <div ref={bgRef} className="impact-banner__bg" aria-hidden="true" />

        <div className="impact-banner__visual-text impact-banner__align-col">
          <div className="impact-banner__rotator" aria-live="polite">
            {ROTATOR_TEXT.map((t, i) => (
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
                <h3 className="impact-card__title">후원금은 이렇게 사용됩니다</h3>
                <p className="impact-card__desc">Khayah는 후원금을 가장 가치 있는 일에 사용하기 위해 노력합니다.</p>
              </div>
            </div>

            <div
              className="donut"
              style={{ '--p': donut.percent } as CSSProperties}
              aria-label={
                donutLabelText
                  ? `후원금의 ${formatImpactPercent(donut.percent).replace('%', '')}%는 ${donutLabelText}에 사용됩니다`
                  : `후원금의 ${formatImpactPercent(donut.percent)}`
              }
            >
              <div className="donut__center">
                <div className="donut__value">{formatImpactPercent(donut.percent)}</div>
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

            <Link className="impact-card__cta" to="/소식/재정보고">
              자세히보기
            </Link>
          </article>

          {statsVisible.length > 0 ? (
            <div className="impact-stats" role="list" aria-label="성과 지표">
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
