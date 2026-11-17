import { Link } from 'react-router-dom'
import { useLocale } from '../../../i18n/LocaleContext'
import { useImpactPage } from '../../impact/useImpactPage'

/** 메인 숫자 섹션. 임팩트 페이지 공개가 꺼져 있거나 메인 표시가 꺼져 있으면 숨긴다. */
export function HomeNumbersSection() {
  const { locale } = useLocale()
  const impact = useImpactPage()
  const shown = Boolean(impact?.public) && impact?.homePublic !== false
  if (locale !== 'ko' || !impact || !shown) return null

  const cards = impact.homeNumbers
    .filter((item) => item.enabled !== false)
    .map((item) => {
      if (item.source !== 'impact') return item
      return impact.overview.find((row) => row.label === item.impactKey) ?? item
    })

  return (
    <section className="home-numbers" aria-labelledby="home-numbers-title">
      <p className="home-numbers__kicker">KHAYAH IN NUMBERS</p>
      <div className="home-numbers__head">
        <div>
          <h2 id="home-numbers-title">{impact.homeTitle}</h2>
          <p>{impact.homeLead}</p>
        </div>
        {impact.public ? <Link to="/business/impact">한눈에 보는 카야 →</Link> : null}
      </div>
      <div className="home-numbers__grid">
        {cards.map((item) => (
          <article key={item.label}>
            <p>{item.label}</p>
            <p className="home-numbers__value">
              {item.value}
              <span>{item.unit}</span>
            </p>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
      <p className="home-numbers__note">{impact.homeNote}</p>
    </section>
  )
}
