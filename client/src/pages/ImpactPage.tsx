import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useImpactPage } from '../features/impact/useImpactPage'
import { StoryChangeSteps } from '../features/impact/StoryChangeSteps'
import { storyChangeSteps } from '../features/impact/storyHelpers'
import type { ImpactStory } from '../features/impact/impactPageTypes'
import { useLocale } from '../i18n/LocaleContext'
import '../styles/impact-page.css'

const PROGRAMS = [
  { kicker: 'DOMESTIC', title: '국내 진행사업', body: '청소년·청년 진로·미래역량 교육과 청년 해외봉사단 국내 운영', to: '/business/domestic/projects' },
  { kicker: 'OVERSEAS', title: '해외 진행사업', body: '미얀마·키르기스스탄 지부 사업과 긴급구호', to: '/business/overseas/projects' },
  { kicker: 'OVERSEAS EDUCATION', title: '해외 교육 진행사업', body: '기초학습, 진로·STEM 교육, 교사 역량 강화', to: '/business/overseas/education/projects' },
  { kicker: 'VOLUNTEERS', title: '해외봉사단 진행사업', body: '2024~2026년 6개국, 청년 460명 파견', to: '/business/overseas/volunteer/projects' },
  { kicker: 'RESEARCH', title: '연구사업 진행사업', body: '교육모델, 참여형 방법론, 경험 나눔', to: '/business/advocacy/projects' },
  { kicker: 'SOCIAL BUSINESS', title: '소셜비즈니스', body: '카야 아카데미, 컬러앤컴포트', to: '/business/social' },
]

const AXES = [
  {
    axis: '배우는 힘',
    aliases: ['배우는 힘'],
    kicker: '기초학습',
    body: '읽기·쓰기·수리 등 배움을 이어가는 기초 역량',
    metric: '최소 학습수준 도달률',
    programs: '기초역량 강화사업',
    layout: 'prepost' as const,
  },
  {
    axis: '살아가는 힘',
    aliases: ['살아가는 힘'],
    kicker: '사회정서학습 · Life Skills',
    body: '자기이해, 의사소통, 문제해결 등 삶의 과제에 대응하는 역량',
    metric: '자기관리·관계관리 역량 향상 비율',
    programs: '기초역량 강화사업 · 해외봉사단 역량강화교육',
    layout: 'improve' as const,
  },
  {
    axis: '선택하고 나아가는 힘',
    aliases: ['선택하고 나아가는 힘', '선택하는 힘'],
    kicker: '진로교육 · Life Design',
    body: '자신을 이해하고 미래를 설계해 실천으로 옮기는 역량',
    metric: '진로탐색 자기효능감 변화',
    programs: '미래지향 교육 · 청년 해외연수 사전교육',
    layout: 'delta' as const,
  },
]

const FIELDS = ['전체', '교육', '해외봉사단', '긴급구호']
const CHART_YEARS = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

const OVERVIEW_KIND: Record<string, string> = {
  '참여 아동·청소년·청년': 'REACH',
  '참여 교사': 'REACH',
  '해외봉사단 파견': 'OUTPUT',
  '긴급구호 지원': 'OUTPUT',
  '협력기관': 'OUTPUT',
}

function filled(value: string | undefined | null): boolean {
  const text = value?.trim() ?? ''
  return text !== '' && text !== '—' && text !== '-'
}

function displayValue(value: string | undefined | null): string {
  return filled(value) ? String(value).trim() : '—'
}

function storyHref(localize: (path: string) => string, story: ImpactStory): string {
  return localize(`/news/stories/${encodeURIComponent(story.id)}`)
}

function parseMetricParts(value: string): { left?: string; right?: string; single?: string } {
  const text = value.trim()
  if (!text) return {}
  const prePost = text.match(/사전\s*([^\s·]+).*사후\s*([^\s·]+)/i)
  if (prePost) return { left: prePost[1], right: prePost[2] }
  const arrow = text.match(/사전\s*→\s*사후[^\d+]*(\+?[^\s]+)/i)
  if (arrow) return { single: `사전 → 사후 향상 ${arrow[1]}` }
  const improve = text.match(/향상[^\d%]*([\d.[\]%]+%?)/i)
  if (improve) return { single: `향상 비율 ${improve[1]}` }
  return { single: text }
}

export function ImpactPage() {
  const doc = useImpactPage()
  const { localize } = useLocale()
  const [tableYear, setTableYear] = useState('누적')
  const [field, setField] = useState('전체')

  const sections = useMemo(
    () => (doc ? [...doc.sections].filter((row) => row.enabled).sort((a, b) => a.order - b.order) : []),
    [doc],
  )
  const changeStories = useMemo(
    () => (doc?.stories ?? []).filter((story) => story.category === '변화의 이야기' && story.featured && story.consent && story.title.trim()),
    [doc],
  )
  const expertStories = useMemo(
    () =>
      (doc?.stories ?? [])
        .filter((story) => story.category === '전문가 이야기' && story.featured && story.consent && story.title.trim())
        .slice(0, 3),
    [doc],
  )
  const years = useMemo(
    () =>
      (doc?.years ?? [])
        .map((item) => ({ ...item, rows: item.rows.filter((row) => filled(row.name)) }))
        .filter((item) => filled(item.year) && item.rows.length > 0)
        .sort((a, b) => Number(b.year) - Number(a.year)),
    [doc],
  )
  const yearTabs = useMemo(() => {
    const fromData = years.map((item) => item.year)
    const fallback = ['2026', '2025', '2024']
    const list = fromData.length ? fromData : fallback
    return ['누적', ...list]
  }, [years])
  const activeYearName = yearTabs.includes(tableYear) ? tableYear : '누적'
  const year = years.find((item) => item.year === activeYearName)
  const yearRows = (year?.rows ?? []).filter((row) => field === '전체' || row.name.includes(field))
  const chartValues = useMemo(() => {
    const byYear = new Map(years.map((item) => [item.year, item]))
    return CHART_YEARS.map((y) => {
      const rows = byYear.get(y)?.rows ?? []
      let sum = 0
      let any = false
      for (const row of rows) {
        for (const raw of [row.child, row.youth, row.real]) {
          const n = Number(String(raw).replace(/[^\d.]/g, ''))
          if (Number.isFinite(n) && n > 0) {
            sum += n
            any = true
          }
        }
      }
      return { year: y, value: any ? sum : 0, has: any }
    })
  }, [years])
  const chartMax = Math.max(1, ...chartValues.map((item) => item.value))

  if (!doc) return null
  if (!doc.public) return <Navigate to="/" replace />

  const lead = changeStories[0]
  const expertSlots: Array<ImpactStory | null> = [
    expertStories[0] ?? null,
    expertStories[1] ?? null,
    expertStories[2] ?? null,
  ]

  return (
    <div className="impact-page">
      <header className="impact-hero">
        <div className="impact-wrap">
          <p className="impact-crumb">사업 › 한눈에 보는 카야</p>
          <p className="impact-hero__kicker">{doc.kicker || 'OUR IMPACT'}</p>
          <h1>{doc.headline}</h1>
          <p className="impact-hero__lead">{doc.message}</p>
          <div className="impact-steps">
            <article>
              <p>01 · REACH</p>
              <strong>도달과 참여</strong>
              <span>얼마나 많은 사람과 함께했는가</span>
            </article>
            <article>
              <p>02 · RESULTS</p>
              <strong>역량과 행동 변화</strong>
              <span>무엇이 달라졌는가</span>
            </article>
            <article>
              <p>03 · CHANGE</p>
              <strong>지속되는 변화</strong>
              <span>변화가 어떻게 이어지는가</span>
            </article>
          </div>
        </div>
      </header>

      {sections.map((section) => {
        if (section.id === 'stories') {
          const steps = lead ? storyChangeSteps(lead) : []
          return (
            <section key={section.id} className="impact-block">
              <div className="impact-wrap">
                <p className="impact-kicker">01 · STORIES OF CHANGE</p>
                <h2>변화의 이야기</h2>
                <p className="impact-lead">숫자 이면의 변화를 한 사람, 한 지역의 이야기로 전합니다.</p>
                <p className="impact-note">임팩트 관리 › 스토리 관리의 &apos;변화의 이야기&apos; 대표 글이 여기에 보입니다.</p>
                <article className="impact-story">
                  <div className="impact-story__photo">
                    {lead?.expertPhoto ? <img src={lead.expertPhoto} alt="" /> : null}
                  </div>
                  <div className="impact-story__copy">
                    <span className="impact-pill">{lead?.project?.trim() || '[국가] · [사업명]'}</span>
                    {lead ? (
                      <h3>
                        <Link to={storyHref(localize, lead)}>{lead.title}</Link>
                      </h3>
                    ) : (
                      <h3>[변화가 드러나는 제목 한 문장]</h3>
                    )}
                    {steps.length > 0 ? (
                      <StoryChangeSteps steps={steps} variant="compact" />
                    ) : (
                      <div className="impact-story__rows" role="list">
                        {(
                          [
                            ['Before', '[참여 전 상황]'],
                            ['Intervention', '[카야가 함께한 활동]'],
                            ['After', '[달라진 점]'],
                            ['Evidence', '[평가 결과 또는 인터뷰 근거]'],
                            ['Sustainability', '[사업 이후에도 이어지는 모습]'],
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label} role="listitem">
                            <b>{label}</b>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
                <Link className="impact-more" to={localize('/news/stories?cat=change')}>
                  스토리에서 변화의 이야기 더 보기 →
                </Link>
              </div>
            </section>
          )
        }

        if (section.id === 'education') {
          return (
            <section key={section.id} className="impact-block impact-block--sand">
              <div className="impact-wrap">
                <p className="impact-kicker">02 · EDUCATION OUTCOMES</p>
                <h2>교육의 변화</h2>
                <p className="impact-lead">카야 교육의 세 가지 축에서 참여자의 변화를 사전·사후 평가로 확인합니다.</p>
                <div className="impact-cards">
                  {AXES.map((axis) => {
                    const row = (doc.evals ?? []).find((item) => axis.aliases.includes(item.axis) && (item.value || item.itemName))
                    const parts = parseMetricParts(row?.value ?? '')
                    return (
                      <article key={axis.axis} className="impact-card">
                        <p className="impact-card__kicker">{axis.kicker}</p>
                        <h3>{axis.axis}</h3>
                        <p>{axis.body}</p>
                        <p className="impact-card__metric-label">{row?.itemName || axis.metric}</p>
                        {axis.layout === 'prepost' ? (
                          <div className="impact-metrics">
                            <div className="impact-metric">
                              <span>사전</span>
                              <b>{parts.left || '[00]%'}</b>
                            </div>
                            <div className="impact-metric">
                              <span>사후</span>
                              <b>{parts.right || '[00]%'}</b>
                            </div>
                          </div>
                        ) : (
                          <div className="impact-metrics">
                            <div className="impact-metric impact-metric--wide">
                              <span>{axis.layout === 'improve' ? '향상 비율' : '사전 → 사후 향상'}</span>
                              <b>
                                {parts.single ||
                                  (axis.layout === 'improve' ? '[00]%' : '+[00]%p')}
                              </b>
                            </div>
                          </div>
                        )}
                        <p className="impact-card__foot">{row?.program || axis.programs}</p>
                        {row?.meta ? <p className="impact-card__meta">{row.meta}</p> : null}
                      </article>
                    )
                  })}
                </div>
                <p className="impact-note">
                  평가 대상, 조사 시점, 응답률, 측정 도구를 함께 표시합니다. 평가 도구가 다른 사업의 결과는 하나로 합치지 않습니다.
                </p>
              </div>
            </section>
          )
        }

        if (section.id === 'experts') {
          return (
            <section key={section.id} className="impact-block">
              <div className="impact-wrap">
                <p className="impact-kicker">03 · EXPERT REVIEW</p>
                <h2>전문가 평가</h2>
                <p className="impact-lead">사업을 함께 살펴본 전문가의 시선으로 변화를 확인합니다.</p>
                <p className="impact-note">임팩트 관리 › 스토리 관리의 &apos;전문가 이야기&apos; 대표 글이 여기에 보입니다.</p>
                <div className="impact-cards">
                  {expertSlots.map((story, index) => {
                    const inner = (
                      <>
                        <span className="impact-pill">{story?.project?.trim() || '[사업명]'}</span>
                        <p className="impact-quote">“</p>
                        <p className="impact-quote-text">{story?.expertLine?.trim() || story?.title || '[전문가 평가 한두 문장]'}</p>
                        <div className="impact-person">
                          {story?.expertPhoto ? <img src={story.expertPhoto} alt="" /> : <i />}
                          <div>
                            <b>{story?.expertName?.trim() || '[이름]'}</b>
                            <span>
                              {story
                                ? [story.expertOrg, story.expertField].filter(Boolean).join(' · ') || '[소속 · 전문 분야]'
                                : '[소속 · 전문 분야]'}
                            </span>
                          </div>
                        </div>
                      </>
                    )
                    return story ? (
                      <Link key={story.id} className="impact-card impact-card--link" to={storyHref(localize, story)}>
                        {inner}
                      </Link>
                    ) : (
                      <article key={`expert-empty-${index}`} className="impact-card">
                        {inner}
                      </article>
                    )
                  })}
                </div>
                <Link className="impact-more" to={localize('/news/stories?cat=expert')}>
                  스토리에서 전문가 이야기 더 보기 →
                </Link>
              </div>
            </section>
          )
        }

        if (section.id === 'overview') {
          return (
            <section key={section.id} className="impact-block impact-block--sand">
              <div className="impact-wrap">
                <p className="impact-kicker">04 · IMPACT OVERVIEW</p>
                <h2>한눈에 보기</h2>
                <p className="impact-lead">{doc.overviewNote || '2016년 설립 이후 지금까지 카야와 함께한 사람과 기관입니다.'}</p>
                <div className="impact-filters">
                  <div role="group" aria-label="연도 선택">
                    {yearTabs.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={item === activeYearName ? 'is-on' : ''}
                        onClick={() => setTableYear(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div role="group" aria-label="사업 선택">
                    {FIELDS.map((item) => (
                      <button key={item} type="button" className={field === item ? 'is-on' : ''} onClick={() => setField(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="impact-numbers">
                  {doc.overview.map((card) => (
                    <article key={card.label} className="impact-number">
                      <div className="impact-number__top">
                        <p className="impact-number__label">{card.label}</p>
                        <span className="impact-number__kind">{OVERVIEW_KIND[card.label] || 'OUTPUT'}</span>
                      </div>
                      <p className="impact-number__value">
                        <b>{displayValue(card.value)}</b>
                        <span>{card.unit}</span>
                      </p>
                      <p className="impact-number__note">{card.note}</p>
                    </article>
                  ))}
                </div>

                <div className="impact-chart">
                  <div className="impact-chart__head">
                    <h3>연도별 참여 아동·청소년·청년 추이</h3>
                    <p>
                      선택: {activeYearName} · {field}
                    </p>
                  </div>
                  <div className="impact-chart__bars" role="img" aria-label="연도별 참여 추이 차트">
                    {chartValues.map((item) => (
                      <div key={item.year} className="impact-chart__col">
                        <div className="impact-chart__track">
                          {item.has ? (
                            <div className="impact-chart__bar" style={{ height: `${Math.max(8, (item.value / chartMax) * 100)}%` }} />
                          ) : (
                            <div className="impact-chart__bar impact-chart__bar--empty" />
                          )}
                        </div>
                        <span>{item.year}</span>
                      </div>
                    ))}
                  </div>
                  <p className="impact-chart__note">
                    2016년 5월 설립 이후 연도별 고유 참여자 수. 검증된 실적이 입력되면 막대가 표시됩니다.
                  </p>
                </div>

                {activeYearName !== '누적' && years.length > 0 ? (
                  yearRows.length > 0 ? (
                    <div className="impact-sheet">
                      <p className="impact-sheet__title">{activeYearName}년 실적</p>
                      <div className="impact-sheet__scroll">
                        <table className="impact-table">
                          <thead>
                            <tr>
                              <th>사업</th>
                              <th className="impact-table__num">실인원</th>
                              <th className="impact-table__num">연인원</th>
                              <th className="impact-table__num">아동·청소년</th>
                              <th className="impact-table__num">청년</th>
                              <th className="impact-table__num">교사</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearRows.map((row) => (
                              <tr key={row.name}>
                                <td className="impact-table__name">{row.name}</td>
                                {([row.real, row.total, row.child, row.youth, row.teacher] as const).map((value, index) => (
                                  <td key={index} className={`impact-table__num${filled(value) ? '' : ' is-empty'}`}>
                                    {displayValue(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="impact-note impact-note--block">이 조건에 해당하는 실적이 없습니다.</p>
                  )
                ) : null}
              </div>
            </section>
          )
        }

        if (section.id === 'offices') {
          return (
            <section key={section.id} className="impact-block">
              <div className="impact-wrap">
                <p className="impact-kicker">05 · OUR OFFICES</p>
                <h2>본부와 지부</h2>
                <p className="impact-lead">한국 본부와 미얀마·키르기스스탄 지부가 각 지역에 맞는 사업을 운영합니다.</p>
                <div className="impact-cards impact-cards--offices">
                  {doc.offices.map((office) => (
                    <article key={office.name} className="impact-office">
                      <div className="impact-office__photo">
                        {office.photo ? <img src={office.photo} alt={office.photoAlt || office.name} /> : `${office.name} 현장 사진`}
                      </div>
                      <div className="impact-office__body">
                        <div className="impact-office__top">
                          <p className="impact-card__kicker">{office.kicker}</p>
                          {office.status ? <span>{office.status}</span> : null}
                        </div>
                        <h3>{office.name}</h3>
                        {filled(office.body) ? <p>{office.body}</p> : null}
                        <div className="impact-office__stats">
                          <div>
                            <p>참여 아동·청소년·청년</p>
                            <b>{displayValue(office.people)} 명</b>
                          </div>
                          <div>
                            <p>협력기관</p>
                            <b>{displayValue(office.partners)} 곳</b>
                          </div>
                        </div>
                        {filled(office.programs) ? <p>주요 사업: {office.programs}</p> : null}
                      </div>
                    </article>
                  ))}
                </div>
                <p className="impact-note">해외봉사단 파견국과 국가별 활동은 해외봉사단 진행사업에서 볼 수 있습니다.</p>
                <p className="impact-note">국가마다 사업 내용이 달라 국가별 숫자는 단순 비교하지 않습니다.</p>
              </div>
            </section>
          )
        }

        return (
          <section key={section.id} className="impact-block impact-block--sand">
            <div className="impact-wrap">
              <p className="impact-kicker">06 · PROGRAMS</p>
              <h2>사업별로 자세히 보기</h2>
              <p className="impact-lead">각 사업의 진행 내용과 성과는 진행사업 페이지에서 볼 수 있습니다.</p>
              <div className="impact-programs">
                {PROGRAMS.map((item) => (
                  <Link key={item.to} className="impact-program" to={localize(item.to)}>
                    <p className="impact-program__kicker">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <p className="impact-program__go">자세히 보기 →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
