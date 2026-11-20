import { Link } from 'react-router-dom'
import { useLocale } from '../../../i18n/LocaleContext'
import { useImpactPage } from '../../impact/useImpactPage'

/** 메인 숫자 섹션. 메인 표시가 꺼져 있을 때만 숨긴다. 페이지 공개가 꺼져 있으면 연결 링크만 뺀다. */
export function HomeNumbersSection() {
  const { locale, localize } = useLocale()
  const impact = useImpactPage()
  const shown = impact?.homePublic !== false
  if (!impact || !shown) return null

  const en = locale === 'en'
  const title = (en ? impact.homeTitleEn : impact.homeTitle)?.trim() || ''
  if (!title) return null

  const lead = (en ? impact.homeLeadEn : impact.homeLead)?.trim() || ''
  const note = (en ? impact.homeNoteEn : impact.homeNote)?.trim() || ''

  const cards = impact.homeNumbers
    .filter((item) => item.enabled !== false)
    .map((item) => {
      if (item.source !== 'impact') return item
      return impact.overview.find((row) => row.label === item.impactKey) ?? item
    })
    .map((item) => ({
      ...item,
      label: (en ? item.labelEn || item.label : item.label).trim(),
      note: (en ? item.noteEn || item.note : item.note).trim(),
    }))
    .filter((item) => item.label)

  if (!cards.length) return null

  return (
    <section className="home-numbers" aria-labelledby="home-numbers-title">
      <p className="home-numbers__kicker">KHAYAH IN NUMBERS</p>
      <div className="home-numbers__head">
        <div>
          <h2 id="home-numbers-title">{title}</h2>
          {lead ? <p>{lead}</p> : null}
        </div>
        {impact.public ? (
          <Link to={localize('/business/impact')}>{en ? 'Khayah at a glance →' : '한눈에 보는 카야 →'}</Link>
        ) : null}
      </div>
      <div className="home-numbers__grid">
        {cards.map((item) => (
          <article key={item.label}>
            <p>{item.label}</p>
            <p className="home-numbers__value">
              {item.value}
              <span>{item.unit}</span>
            </p>
            {item.note ? <p>{item.note}</p> : null}
          </article>
        ))}
      </div>
      {note ? <p className="home-numbers__note">{note}</p> : null}
    </section>
  )
}
