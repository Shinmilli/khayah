import { Link } from 'react-router-dom'
import { useLocale } from '../../../i18n/LocaleContext'
import { useImpactPage } from '../../impact/useImpactPage'

/** 메인 숫자 섹션. 메인 표시(homePublic)가 꺼져 있을 때만 숨긴다. 한눈에 보는 카야 링크는 페이지 공개(public)일 때만 붙인다. */
export function HomeNumbersSection() {
  const { locale, localize } = useLocale()
  const impact = useImpactPage()
  // 관리자 「메인 표시」와 동일: homePublic이 있으면 그것, 없으면 페이지 공개 여부를 따른다.
  const shown = impact ? (typeof impact.homePublic === 'boolean' ? impact.homePublic : impact.public) : false
  if (!impact || !shown) return null

  const en = locale === 'en'
  const title = (en ? impact.homeTitleEn : impact.homeTitle)?.trim() || ''
  if (!title) return null

  const lead = (en ? impact.homeLeadEn : impact.homeLead)?.trim() || ''
  const note = (en ? impact.homeNoteEn : impact.homeNote)?.trim() || ''
  const glanceHref = localize('/business/impact')

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
          <Link to={glanceHref}>{en ? 'Khayah at a glance →' : '한눈에 보는 카야 →'}</Link>
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
