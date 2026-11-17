import { useMemo, useState } from 'react'
import type { ProjectField, ProjectSet } from '../features/projects/projectSetTypes'
import { PROJECT_FIELDS } from '../features/projects/projectSetTypes'
import '../styles/project-set.css'

const MAX_VISIBLE_YEARS = 4

function filled(value: string | undefined | null): value is string {
  return Boolean(value && value.trim())
}

function ProjectSlides({ item }: { item: ProjectSet }) {
  const slides = item.slides.filter((slide) => filled(slide.src))
  const [index, setIndex] = useState(0)
  if (slides.length === 0) return null
  const current = slides[index % slides.length]
  const several = slides.length > 1
  const go = (delta: number) => setIndex((prev) => (prev + delta + slides.length) % slides.length)

  return (
    <div className="pset-hero">
      <img src={current.src} alt={current.alt} />
      {several ? (
        <>
          <button type="button" className="pset-nav pset-nav--prev" aria-label="이전 사진" onClick={() => go(-1)}>
            ‹
          </button>
          <button type="button" className="pset-nav pset-nav--next" aria-label="다음 사진" onClick={() => go(1)}>
            ›
          </button>
          <span className="pset-count">
            {(index % slides.length) + 1} / {slides.length}
          </span>
        </>
      ) : null}
    </div>
  )
}

function visibleSteps(item: ProjectSet) {
  return item.steps.filter((step) => filled(step.kicker) || filled(step.title) || filled(step.detail))
}

function visibleFacts(item: ProjectSet) {
  return item.facts.filter((fact) => filled(fact.value))
}

export function projectHasVisibleContent(item: ProjectSet): boolean {
  const paragraphs = item.paragraphs.filter(filled)
  return (
    filled(item.eyebrow) ||
    filled(item.title) ||
    filled(item.period) ||
    filled(item.audience) ||
    filled(item.partner) ||
    paragraphs.length > 0 ||
    item.slides.some((slide) => filled(slide.src)) ||
    visibleSteps(item).length > 0 ||
    visibleFacts(item).length > 0 ||
    filled(item.note) ||
    item.photos.some((photo) => filled(photo.src))
  )
}

function ProjectCard({ item }: { item: ProjectSet }) {
  const paragraphs = item.paragraphs.filter(filled)
  const steps = visibleSteps(item)
  const facts = visibleFacts(item)
  const markLast =
    typeof item.emphasizeLast === 'boolean' ? item.emphasizeLast : steps.some((step) => step.emphasis)
  const photos = item.photos.filter((photo) => filled(photo.src))
  const meta = [
    filled(item.period) ? { label: '기간', value: item.period } : null,
    filled(item.audience) ? { label: '대상', value: item.audience } : null,
    filled(item.partner) ? { label: '협력', value: item.partner } : null,
  ].filter((row): row is { label: string; value: string } => row !== null)
  const hasCopy = filled(item.eyebrow) || filled(item.title) || meta.length > 0 || paragraphs.length > 0

  return (
    <article className="pset">
      {hasCopy || item.slides.some((slide) => filled(slide.src)) ? (
        <div className="pset-top">
          {hasCopy ? (
            <div className="pset-copy">
              {filled(item.eyebrow) ? <p className="pset-eyebrow">{item.eyebrow}</p> : null}
              {filled(item.title) ? <h3 className="pset-title">{item.title}</h3> : null}
              {meta.length > 0 ? (
                <p className="pset-meta">
                  {meta.map((row) => (
                    <span key={row.label}>
                      {row.label} <b>{row.value}</b>
                    </span>
                  ))}
                </p>
              ) : null}
              {paragraphs.length > 0 ? (
                <div className="pset-body">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <ProjectSlides item={item} />
        </div>
      ) : null}

      {steps.length > 0 ? (
        <div className="pset-flow">
          {steps.map((step, stepIndex) => (
            <div key={`${step.kicker}-${step.title}`} className="pset-step-slot">
              {item.showArrows && stepIndex > 0 ? (
                <span className="pset-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
              <div className={`pset-step${markLast && stepIndex === steps.length - 1 ? ' is-emphasis' : ''}`}>
                {filled(step.kicker) ? <i>{step.kicker}</i> : null}
                {filled(step.title) ? <b>{step.title}</b> : null}
                {filled(step.detail) ? <span>{step.detail}</span> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {facts.length > 0 ? (
        <div className="pset-facts">
          {facts.map((fact) => (
            <div key={`${fact.value}-${fact.label}`} className="pset-fact">
              {filled(fact.value) ? (
                <span className="pset-fact-value">
                  {fact.value}
                  {filled(fact.unit) ? <small>{fact.unit}</small> : null}
                </span>
              ) : null}
              {filled(fact.label) ? <span className="pset-fact-label">{fact.label}</span> : null}
            </div>
          ))}
        </div>
      ) : null}

      {filled(item.note) ? <p className="pset-note">{item.note}</p> : null}

      {photos.length > 0 ? (
        <div className="pset-photos">
          {photos.map((photo) => (
            <img key={photo.src} src={photo.src} alt={photo.alt} />
          ))}
        </div>
      ) : null}
    </article>
  )
}

export function ProjectSetList({
  items,
  eyebrow,
  recentFromYear,
  fields,
}: {
  items: ProjectSet[]
  eyebrow: string
  /** '전체'에 보여줄 시작 연도. 국내·연구는 2020, 해외는 2024. 그 전 연도는 연도 버튼을 눌렀을 때만. */
  recentFromYear?: number
  /** 해외 진행사업의 분야 버튼. 교육·해외봉사단 페이지는 넘기지 않고 걸러진 목록만 넣는다. */
  fields?: readonly ProjectField[]
}) {
  const shown = useMemo(() => items.filter(projectHasVisibleContent), [items])
  const years = useMemo(
    () =>
      [...new Set(shown.map((item) => item.year).filter((year): year is number => typeof year === 'number'))].sort(
        (a, b) => b - a,
      ),
    [shown],
  )
  const hasUnknownYear = shown.some((item) => item.year == null)
  const [year, setYear] = useState<number | 'all' | 'unknown'>('all')
  const [field, setField] = useState<ProjectField | 'all'>('all')
  const [yearWindowStart, setYearWindowStart] = useState(0)
  const maxYearWindowStart = Math.max(0, years.length - MAX_VISIBLE_YEARS)
  const yearStart = Math.min(yearWindowStart, maxYearWindowStart)
  const visibleYears = years.slice(yearStart, yearStart + MAX_VISIBLE_YEARS)
  const canPageYears = years.length > MAX_VISIBLE_YEARS
  const shiftYearWindow = (delta: number) => {
    setYearWindowStart(Math.max(0, Math.min(maxYearWindowStart, yearStart + delta)))
  }
  const fieldItems = field === 'all' || !fields ? shown : shown.filter((item) => item.field === field)
  const visible =
    year === 'all'
      ? fieldItems.filter((item) => item.year == null || recentFromYear == null || item.year >= recentFromYear)
      : year === 'unknown'
        ? fieldItems.filter((item) => item.year == null)
        : fieldItems.filter((item) => item.year === year)
  const grouped = useMemo(() => {
    const map = new Map<number | null, ProjectSet[]>()
    for (const item of visible) {
      const list = map.get(item.year) ?? []
      list.push(item)
      map.set(item.year, list)
    }
    return [...map.entries()].sort((a, b) => {
      if (a[0] == null) return 1
      if (b[0] == null) return -1
      return b[0] - a[0]
    })
  }, [visible])

  if (shown.length === 0) return null

  return (
    <section className="pset-section">
      <div className="pset-head">
        <div>
          {filled(eyebrow) ? <p className="pset-eyebrow">{eyebrow}</p> : null}
          <h2 className="pset-heading">진행사업</h2>
        </div>
        <div className="pset-filters">
          {years.length > 0 || hasUnknownYear ? (
            <div className={`pset-years${canPageYears ? ' pset-years--paged' : ''}`} role="group" aria-label="연도">
              <button
                type="button"
                className={`pset-year${year === 'all' ? ' is-on' : ''}`}
                aria-pressed={year === 'all'}
                onClick={() => setYear('all')}
              >
                전체
              </button>
              {canPageYears ? (
                <button
                  type="button"
                  className="pset-year pset-year-nav"
                  aria-label="더 최근 연도 보기"
                  disabled={yearStart <= 0}
                  onClick={() => shiftYearWindow(-1)}
                >
                  ‹
                </button>
              ) : null}
              {visibleYears.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`pset-year${year === value ? ' is-on' : ''}`}
                  aria-pressed={year === value}
                  onClick={() => setYear(value)}
                >
                  {value}
                </button>
              ))}
              {canPageYears ? (
                <button
                  type="button"
                  className="pset-year pset-year-nav"
                  aria-label="더 오래된 연도 보기"
                  disabled={yearStart >= maxYearWindowStart}
                  onClick={() => shiftYearWindow(1)}
                >
                  ›
                </button>
              ) : null}
              {hasUnknownYear ? (
                <button
                  type="button"
                  className={`pset-year${year === 'unknown' ? ' is-on' : ''}`}
                  aria-pressed={year === 'unknown'}
                  onClick={() => setYear('unknown')}
                >
                  연도 미정
                </button>
              ) : null}
            </div>
          ) : null}
          {fields && fields.length > 0 ? (
            <div className="pset-years" role="group" aria-label="분야">
              <button
                type="button"
                className={`pset-year${field === 'all' ? ' is-on' : ''}`}
                aria-pressed={field === 'all'}
                onClick={() => setField('all')}
              >
                전체
              </button>
              {PROJECT_FIELDS.filter((value) => fields.includes(value)).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`pset-year${field === value ? ' is-on' : ''}`}
                  aria-pressed={field === value}
                  onClick={() => setField(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {grouped.map(([groupYear, group]) => (
        <div key={groupYear ?? 'unknown'}>
          <h3 className="pset-year-heading">{groupYear == null ? '[연도 확인 필요]' : `${groupYear}년`}</h3>
          {group.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </section>
  )
}
