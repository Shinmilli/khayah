import { type CSSProperties, useEffect, useRef, useState } from 'react'

const ROTATOR_TEXT = [
  '01. 투명하게 증명합니다',
  '02. 현장의 변화를 우선합니다',
  '03. 소중한 마음을 연결합니다',
]

export function ImpactSection() {
  const [idx, setIdx] = useState(0)
  const visualRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const initialTopRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % ROTATOR_TEXT.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const impactBanner = visualRef.current
    const impactBannerBg = bgRef.current
    if (!impactBanner || !impactBannerBg) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const updateImpactParallax = () => {
      if (reduceMotion) {
        impactBannerBg.style.removeProperty('transform')
        return
      }
      const rect = impactBanner.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        if (initialTopRef.current === null) initialTopRef.current = rect.top
        const scrolled = initialTopRef.current - rect.top
        const raw = scrolled * 0.42
        const ty = Math.max(-52, Math.min(52, raw))
        impactBannerBg.style.transform = `translateY(${ty}px)`
      } else {
        impactBannerBg.style.removeProperty('transform')
      }
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateImpactParallax()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => {
      initialTopRef.current = null
      updateImpactParallax()
    }
    window.addEventListener('resize', onResize)
    updateImpactParallax()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

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

            <div className="donut" style={{ '--p': 85.5 } as CSSProperties} aria-label="후원금의 85.5%는 수혜된 아동의 교육지원에 사용됩니다">
              <div className="donut__center">
                <div className="donut__value">85.5%</div>
                <div className="donut__sub">
                  수혜된 아동의
                  <br />
                  교육지원
                </div>
              </div>
            </div>

            <a className="impact-card__cta" href="#support">
              자세히보기
            </a>
          </article>

          <div className="impact-stats" role="list" aria-label="성과 지표">
            <div className="impact-stat" role="listitem">
              <div className="impact-stat__text">
                <div className="impact-stat__label">사업 참여자 수</div>
                <div className="impact-stat__value">
                  <span className="num">100,000</span>
                  <span className="unit">명</span>
                </div>
              </div>
              <div className="impact-stat__icon" aria-hidden="true" />
            </div>
            <div className="impact-stat" role="listitem">
              <div className="impact-stat__text">
                <div className="impact-stat__label">지원받은 지역/마을 수</div>
                <div className="impact-stat__value">
                  <span className="num">0000</span>
                </div>
              </div>
              <div className="impact-stat__icon" aria-hidden="true" />
            </div>
            <div className="impact-stat" role="listitem">
              <div className="impact-stat__text">
                <div className="impact-stat__label">건설 지원 시설 혹은 제공한 카트 수</div>
                <div className="impact-stat__value">
                  <span className="num">0000</span>
                </div>
              </div>
              <div className="impact-stat__icon" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
