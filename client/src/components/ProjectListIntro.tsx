import { Fragment } from 'react'
import type { ProjectListKind } from '../features/projects/publicProjectSets'
import '../styles/project-list-intro.css'

type Intro = {
  kicker: string
  kickerKo: string
  title: string
  emphasis: string
  lead: string
  align: 'left' | 'center'
  photoSide: 'right' | 'left' | 'none'
  band: 'white' | 'gray'
}

function shownKicker(intro: Intro | undefined, fallback: string, on: boolean) {
  if (!on) return fallback
  const [fallbackEn, ...rest] = fallback.split(' · ')
  const en = intro?.kicker || fallbackEn
  const ko = intro?.kickerKo || rest.join(' · ')
  return [en, ko].filter(Boolean).join(' · ')
}

function bandClass(intro?: Intro, extra = '') {
  return `pli-band${intro?.band === 'white' ? ' pli-band--white' : ''}${extra}`
}

function hasIntro(intro?: Intro) {
  return Boolean(intro && (intro.kicker || intro.kickerKo || intro.title || intro.emphasis || intro.lead))
}

function Title({ text, emphasis }: { text: string; emphasis: string }) {
  const at = emphasis ? text.indexOf(emphasis) : -1
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <span>{emphasis}</span>
      {text.slice(at + emphasis.length)}
    </>
  )
}

function Lead({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  )
}

function SplitHero({
  intro,
  fallback,
  photo,
}: {
  intro?: Intro
  fallback: { kicker: string; title: string; emphasis: string; lead: string }
  photo: { src: string; alt: string }
}) {
  const on = hasIntro(intro)
  const kicker = shownKicker(intro, fallback.kicker, on)
  const title = on ? intro?.title || fallback.title : fallback.title
  const emphasis = on ? intro?.emphasis || fallback.emphasis : fallback.emphasis
  const lead = on ? intro?.lead || fallback.lead : fallback.lead
  const side = intro?.photoSide || 'right'
  const center = side === 'none'
  return (
    <section className={`pli-hero${center ? ' pli-hero--center' : ''}${side === 'left' ? ' pli-hero--photo-left' : ''}`}>
      {center ? (
        <>
          <p className="pli-kicker">{kicker}</p>
          <h2 className="pli-title">
            <Title text={title} emphasis={emphasis} />
          </h2>
          <p className="pli-lead">
            <Lead text={lead} />
          </p>
        </>
      ) : (
        <>
          <div className="pli-copy">
            <p className="pli-kicker">{kicker}</p>
            <h2 className="pli-title">
              <Title text={title} emphasis={emphasis} />
            </h2>
            <p className="pli-lead">
              <Lead text={lead} />
            </p>
          </div>
          <figure className="pli-photo">
            <img src={photo.src} alt={photo.alt} />
          </figure>
        </>
      )}
    </section>
  )
}

function Fact({ value, unit, label, note }: { value: string; unit: string; label: string; note: string }) {
  return (
    <div className="pli-fact">
      <b>
        {value}
        <small>{unit}</small>
      </b>
      <strong>{label}</strong>
      <span>{note}</span>
    </div>
  )
}

export function ProjectListIntro({
  kind,
  cards = [],
  flow = [],
  intro,
  part = 'all',
}: {
  kind: ProjectListKind
  cards?: Array<{ value: string; unit: string; note: string; source: string }>
  flow?: Array<{ name: string; body: string }>
  intro?: Intro
  part?: 'all' | 'intro' | 'facts' | 'flow'
}) {
  const want = (name: 'intro' | 'facts' | 'flow') => part === 'all' || part === name
  if (kind === 'domestic') {
    const introOn = want('intro') && hasIntro(intro)
    const factsOn = want('facts') && cards.length > 0
    if (!introOn && !factsOn) return null
    return (
      <>
        {introOn ? (
          <section className={`pli-hero${intro?.align === 'left' ? '' : ' pli-hero--center'}`}>
            {intro?.kicker ? <p className="pli-kicker">{intro.kicker}</p> : null}
            {intro?.title ? (
              <h2 className="pli-title">
                <Title text={intro.title} emphasis={intro.emphasis} />
              </h2>
            ) : null}
            {intro?.lead ? (
              <p className="pli-lead">
                <Lead text={intro.lead} />
              </p>
            ) : null}
          </section>
        ) : null}
        {factsOn ? (
          <section className={bandClass(intro)}>
            <div className="pli-wrap">
              <div className="pli-facts">
                {cards.map((card) => (
                  <Fact key={`${card.value}-${card.note}`} value={card.value} unit={card.unit} label={card.note} note={card.source} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </>
    )
  }

  if (kind === 'overseas-education') {
    if (!want('intro')) return null
    const title = intro?.title || '현장에서 운영 중인 해외 교육사업'
    const emphasis = intro?.emphasis || '해외 교육사업'
    const lead = intro?.lead || '기초를 다지고 미래를 여는 교육을 현지와 함께 만듭니다.'
    const highlighted = emphasis && title.includes(emphasis) ? title.replace(emphasis, `\u0000${emphasis}\u0000`).split('\u0000') : [title]
    return (
      <section className={`pli-hero${intro?.align === 'left' ? '' : ' pli-hero--center'}`}>
        <p className="pli-kicker">{intro?.kicker || 'OVERSEAS EDUCATION · 해외 교육사업'}</p>
        <h2 className="pli-title">
          {highlighted.map((part, index) => (part === emphasis ? <span key={index}>{part}</span> : part))}
        </h2>
        {lead ? (
          <p className="pli-lead">
            <Lead text={lead} />
          </p>
        ) : null}
      </section>
    )
  }

  if (kind === 'overseas') {
    if (!want('intro') && !want('facts')) return null
    return (
      <>
        {want('intro') ? <SplitHero
          intro={intro}
          fallback={{
            kicker: 'OVERSEAS · 해외사업',
            title: '현지와 함께 세우는 교육의 내일',
            emphasis: '교육의 내일',
            lead: '카야는 미얀마(2018년~)와 키르기스스탄(2022년~)에 지부를 두고 현지 직원과 함께 사업을 운영합니다.\nKOICA, 사랑의열매, 삼성꿈장학재단, 경기도 등과 협력해 교육 중심의 개발협력 사업을 이어가고 있습니다.',
          }}
          photo={{ src: '/images/business/overseas-intro.jpg', alt: '미얀마 지부 현장' }}
        /> : null}
        {want('facts') ? <section className={bandClass(intro)}>
          <div className="pli-wrap">
            <div className="pli-facts">
              {cards.length
                ? cards.map((card) => <Fact key={`${card.value}-${card.note}`} value={card.value} unit={card.unit} label={card.note} note={card.source} />)
                : (
                  <>
                    <Fact value="2" unit="개" label="해외 지부" note="미얀마 · 키르기스스탄" />
                    <Fact value="2017" unit="년~" label="해외 개발협력사업" note="KOICA·KCOC 민관협력 사업으로 시작" />
                    <Fact value="5" unit="개" label="2026년 진행 중인 해외사업" note="교육 4 · 지진 후속 지원 1" />
                    <Fact value="7,937" unit="명" label="2025 미얀마 지진 긴급구호 지원 주민" note="18개 마을" />
                  </>
                )}
            </div>
          </div>
        </section> : null}
      </>
    )
  }

  if (kind === 'volunteer') {
    if (!want('intro') && !want('facts')) return null
    return (
      <>
        {want('intro') ? <SplitHero
          intro={intro}
          fallback={{
            kicker: 'VOLUNTEERS · 해외봉사단',
            title: '현지 과제에서 출발하는 해외봉사',
            emphasis: '해외봉사',
            lead: '2024년부터 청년 해외봉사단을 운영하고 있습니다.\n모집·교육·파견·성과관리까지 전 과정을 직접 맡아, 3년간 6개국에 청년 460명을 파견했습니다.',
          }}
          photo={{ src: '/images/business/volunteer-field.jpg', alt: '해외봉사단 현지 활동' }}
        /> : null}
        {want('facts') ? <section className={bandClass(intro)}>
          <div className="pli-wrap">
            <div className="pli-facts">
              {cards.length
                ? cards.map((card) => <Fact key={`${card.value}-${card.note}`} value={card.value} unit={card.unit} label={card.note} note={card.source} />)
                : (
                  <>
                    <Fact value="460" unit="명" label="청년 파견 (만 19~39세)" note="2024~2026" />
                    <Fact value="6" unit="개국" label="라오스 · 몽골 · 우즈베키스탄" note="캄보디아 · 키르기스스탄 · 필리핀" />
                    <Fact value="3" unit="주" label="1회 파견 기간" note="하계·동계 연 2회" />
                  </>
                )}
            </div>
          </div>
        </section> : null}
      </>
    )
  }

  if (!want('intro') && !want('flow')) return null
  return (
    <>
      {want('intro') ? <SplitHero
        intro={intro}
        fallback={{
          kicker: 'RESEARCH · 연구사업',
          title: '현장 경험을 배움의 모델로',
          emphasis: '배움의 모델로',
          lead: '카야는 현장에서 쓰는 교육모델과 사업 방법을 직접 연구하고 개발합니다.\n개발한 커리큘럼과 교재는 국내외 사업에 적용하고, 그 결과를 다시 개선에 반영합니다.',
        }}
        photo={{ src: '/images/business/overseas-edu-quality-1.jpg', alt: '교사 연수' }}
      /> : null}
      {want('flow') ? <section className={bandClass(intro, ' pli-band--cycle')}>
        <div className="pli-wrap">
          <div className="pli-cycle-head">
            <div>
              <p className="pli-kicker">RESEARCH CYCLE · 연구의 흐름</p>
              <h2 className="pli-cycle-title">현장에서 시작해 현장으로 돌아갑니다</h2>
            </div>
          </div>
          <div className="pli-steps">
            {flow.length ? (
              flow.map((step, index) => (
                <div key={`${step.name}-${index}`} className={`pli-step${index === flow.length - 1 ? ' is-last' : ''}`}>
                  <i>{index + 1}</i>
                  <b>{step.name}</b>
                  <span>{step.body}</span>
                </div>
              ))
            ) : (
            <>
            <div className="pli-step">
              <i>1</i>
              <b>현장</b>
              <span>사업 현장에서 문제와 질문 발견</span>
            </div>
            <span className="pli-arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <div className="pli-step">
              <i>2</i>
              <b>연구</b>
              <span>참여자·전문가와 원인과 해법 탐구</span>
            </div>
            <span className="pli-arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <div className="pli-step">
              <i>3</i>
              <b>모델화</b>
              <span>커리큘럼·워크북·교재로 정리</span>
            </div>
            <span className="pli-arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <div className="pli-step is-last">
              <i>4</i>
              <b>적용·공유</b>
              <span>국내외 사업에 적용하고 강의로 확산</span>
            </div>
            </>
            )}
          </div>
        </div>
      </section> : null}
    </>
  )
}
