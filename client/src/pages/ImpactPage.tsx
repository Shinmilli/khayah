import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { fetchPostsByKind } from '../services/api'
import { useImpactPage } from '../features/impact/useImpactPage'
import type { ImpactStory } from '../features/impact/impactPageTypes'
import type { Post } from '../types/post'
import '../styles/impact-page.css'

const PROGRAMS = [
  { kicker: 'DOMESTIC', title: '국내 진행사업', body: '청소년·청년 진로·미래역량 교육과 청년 해외봉사단 국내 운영', to: '/business/domestic/projects' },
  { kicker: 'OVERSEAS', title: '해외 진행사업', body: '미얀마·키르기스스탄 지부 사업과 긴급구호', to: '/business/overseas/projects' },
  { kicker: 'OVERSEAS EDUCATION', title: '해외 교육 진행사업', body: '기초학습, 진로·STEM 교육, 교사 역량 강화', to: '/business/overseas/education/projects' },
  { kicker: 'VOLUNTEERS', title: '해외봉사단 진행사업', body: '2024~2026년 6개국, 청년 460명 파견', to: '/business/overseas/volunteer/projects' },
  { kicker: 'RESEARCH', title: '연구사업 진행사업', body: '교육모델, 참여형 방법론, 경험 나눔', to: '/business/advocacy/projects' },
  { kicker: 'SOCIAL BUSINESS', title: '소셜비즈니스', body: '카야 아카데미, 컬러앤컴포트', to: '/business/social' },
]

function featuredStories(posts: Post[], category: string, limit: number): Post[] {
  return posts
    .filter((post) => post.meta?.khayah_story_category === category && post.meta?.khayah_story_featured === '1' && post.meta?.khayah_story_consent === '1')
    .slice(0, limit)
}

const AXES = [
  { axis: '배우는 힘', kicker: '기초학습', body: '읽기·쓰기·수리 등 배움을 이어가는 기초 역량' },
  { axis: '살아가는 힘', kicker: '사회정서학습 · Life Skills', body: '자기이해, 의사소통, 문제해결 등 삶의 과제에 대응하는 역량' },
  { axis: '선택하는 힘', kicker: '진로교육 · Life Design', body: '자신을 이해하고 미래를 설계해 실천으로 옮기는 역량' },
]

const FIELDS = ['전체', '교육', '해외봉사단', '긴급구호']

function storyRows(story: ImpactStory): Array<[string, string]> {
  return [
    ['Before', story.before],
    ['Intervention', story.intervention],
    ['After', story.after],
    ['Evidence', story.evidence],
    ['Sustainability', story.sustainability],
  ].filter((row): row is [string, string] => Boolean(row[1]?.trim()))
}

export function ImpactPage() {
  const doc = useImpactPage()
  const [posts, setPosts] = useState<Post[]>([])
  const [period, setPeriod] = useState('누적')
  const [field, setField] = useState('전체')

  useEffect(() => {
    if (!doc?.public) return
    fetchPostsByKind('스토리', 1, 30)
      .then((res) => setPosts(res.posts))
      .catch(() => setPosts([]))
  }, [doc?.public])

  if (!doc) return null
  if (!doc.public) return <Navigate to="/" replace />

  const sections = [...doc.sections].filter((row) => row.enabled).sort((a, b) => a.order - b.order)
  const stories = featuredStories(posts, '변화의 이야기', 1)
  const experts = featuredStories(posts, '전문가 이야기', 3)

  const changeFromDoc = (doc.stories ?? []).filter((story) => story.category === '변화의 이야기' && story.featured && story.consent)
  const expertFromDoc = (doc.stories ?? []).filter((story) => story.category === '전문가 이야기' && story.featured && story.consent).slice(0, 3)
  const years = doc.years ?? []
  const year = years.find((item) => item.year === period)
  const yearRows = (year?.rows ?? []).filter((row) => field === '전체' || row.name.includes(field))

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
          const lead = changeFromDoc[0]
          return (
            <section key={section.id} className="impact-block">
              <div className="impact-wrap">
                <p className="impact-kicker">01 · STORIES OF CHANGE</p>
                <h2>변화의 이야기</h2>
                <p className="impact-lead">숫자 이면의 변화를 한 사람, 한 지역의 이야기로 전합니다.</p>
                <p className="impact-note">스토리 게시판의 '변화의 이야기' 글 중 대표 글이 여기에 보입니다.</p>
                {lead ? (
                  <article className="impact-story">
                    <div className="impact-story__photo">대표 사례 현장 사진</div>
                    <div className="impact-story__copy">
                      {lead.project ? <span className="impact-pill">{lead.project}</span> : null}
                      <h3>{lead.title}</h3>
                      <div className="impact-story__rows">
                        {storyRows(lead).map(([label, value]) => (
                          <div key={label}>
                            <b>{label}</b>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ) : (
                  stories.map((post) => (
                    <article key={post.id} className="impact-story">
                      <div className="impact-story__copy">
                        <h3>
                          <Link to={`/posts/${encodeURIComponent(post.slug)}`}>{post.title}</Link>
                        </h3>
                      </div>
                    </article>
                  ))
                )}
                <Link className="impact-more" to="/news/stories?cat=change">스토리에서 변화의 이야기 더 보기 →</Link>
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
                    const rows = (doc.evals ?? []).filter((item) => item.axis === axis.axis && (item.value || item.itemName))
                    return (
                      <article key={axis.axis} className="impact-card">
                        <p className="impact-card__kicker">{axis.kicker}</p>
                        <h3>{axis.axis}</h3>
                        <p>{axis.body}</p>
                        {rows.map((row) => (
                          <div key={row.id}>
                            <p>{row.itemName || row.program}</p>
                            <div className="impact-metrics">
                              <div className="impact-metric">
                                <span>{row.mode}</span>
                                <b>{row.value}</b>
                              </div>
                            </div>
                            {row.meta ? <p>{row.meta}</p> : null}
                          </div>
                        ))}
                      </article>
                    )
                  })}
                </div>
                <p className="impact-note">평가 대상, 조사 시점, 응답률, 측정 도구를 함께 표시합니다. 평가 도구가 다른 사업의 결과는 하나로 합치지 않습니다.</p>
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
                <p className="impact-note">스토리 게시판의 '전문가 이야기' 글 중 대표 글이 여기에 보입니다.</p>
                <div className="impact-cards">
                  {expertFromDoc.map((story) => (
                    <article key={story.id} className="impact-card">
                      {story.project ? <span className="impact-pill">{story.project}</span> : null}
                      <p className="impact-quote">“</p>
                      <p className="impact-quote-text">{story.expertLine || story.title}</p>
                      <div className="impact-person">
                        {story.expertPhoto ? <img src={story.expertPhoto} alt="" /> : <i />}
                        <div>
                          <b>{story.expertName}</b>
                          <span>{[story.expertOrg, story.expertField].filter(Boolean).join(' · ')}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                  {expertFromDoc.length === 0
                    ? experts.map((post) => (
                        <article key={post.id} className="impact-card">
                          <p className="impact-quote">“</p>
                          <p className="impact-quote-text">{post.meta?.khayah_story_expert_quote || post.title}</p>
                          <div className="impact-person">
                            <i />
                            <div>
                              <b>{post.meta?.khayah_story_expert_name}</b>
                              <span>{post.meta?.khayah_story_expert_org}</span>
                            </div>
                          </div>
                        </article>
                      ))
                    : null}
                </div>
                <Link className="impact-more" to="/news/stories?cat=expert">스토리에서 전문가 이야기 더 보기 →</Link>
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
                  <div role="group" aria-label="기간 선택">
                    {['누적', ...years.map((item) => item.year).filter(Boolean)].map((item) => (
                      <button key={item} type="button" className={period === item ? 'is-on' : ''} onClick={() => setPeriod(item)}>{item}</button>
                    ))}
                  </div>
                  <div role="group" aria-label="사업 선택">
                    {FIELDS.map((item) => (
                      <button key={item} type="button" className={field === item ? 'is-on' : ''} onClick={() => setField(item)}>{item}</button>
                    ))}
                  </div>
                </div>
                <div className="impact-numbers">
                  {period === '누적'
                    ? doc.overview.map((card) => (
                        <article key={card.label} className="impact-number">
                          <p className="impact-card__kicker">{card.label}</p>
                          <b>{card.value}{card.unit}</b>
                          <p>{card.note}</p>
                        </article>
                      ))
                    : yearRows.map((row) => (
                        <article key={row.name} className="impact-number">
                          <p className="impact-card__kicker">{row.name}</p>
                          <b>{row.real || row.total}</b>
                          <p>{[row.child && `아동·청소년 ${row.child}`, row.youth && `청년 ${row.youth}`, row.teacher && `교사 ${row.teacher}`].filter(Boolean).join(' · ')}</p>
                        </article>
                      ))}
                </div>
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
                <div className="impact-cards">
                  {doc.offices.map((office) => (
                    <article key={office.name} className="impact-office">
                      <div className="impact-office__photo">
                        {office.photo ? <img src={office.photo} alt={office.photoAlt} /> : `${office.name} 현장 사진`}
                      </div>
                      <div className="impact-office__body">
                        <div className="impact-office__top">
                          <p className="impact-card__kicker">{office.kicker}</p>
                          {office.status ? <span>{office.status}</span> : null}
                        </div>
                        <h3>{office.name}</h3>
                        <p>{office.body}</p>
                        <div className="impact-office__stats">
                          <div>
                            <p>참여 아동·청소년·청년</p>
                            <b>{office.people || '—'} 명</b>
                          </div>
                          <div>
                            <p>협력기관</p>
                            <b>{office.partners || '—'} 곳</b>
                          </div>
                        </div>
                        <p>주요 사업: {office.programs}</p>
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
                  <Link key={item.to} className="impact-program" to={item.to}>
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
