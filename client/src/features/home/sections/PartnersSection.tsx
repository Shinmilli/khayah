import { useRef } from 'react'
import { useLocale } from '../../../i18n/LocaleContext'

const PARTNER_LOGOS: { src: string; alt: string }[] = [
  { src: '/images/Home/parteners/partner-1.png', alt: '협력기관 로고 1' },
  { src: '/images/Home/parteners/partner-2.png', alt: '협력기관 로고 2' },
  { src: '/images/Home/parteners/partner-3.png', alt: '협력기관 로고 3' },
  { src: '/images/Home/parteners/partner-4.png', alt: '협력기관 로고 4' },
  { src: '/images/Home/parteners/partner-5.png', alt: '협력기관 로고 5' },
]

export function PartnersSection() {
  const { messages } = useLocale()
  const m = messages.home.partners
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scrollByStep = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector('.partner-card')
    if (!firstCard) return
    const styles = window.getComputedStyle(track)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    const step = firstCard.getBoundingClientRect().width + gap
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <section className="partners-section" aria-label={m.aria}>
      <div className="partners-container">
        <div className="partners-layout">
          <header className="partners-head">
            <h2 className="partners-title">{m.title}</h2>
            <p className="partners-sub">{m.subtitle}</p>
            <div className="partners-controls" aria-label={m.controls}>
              <button type="button" className="partners-nav partners-nav--prev" aria-label={m.prev} onClick={() => scrollByStep(-1)}>
                <span aria-hidden="true">‹</span>
              </button>
              <button type="button" className="partners-nav partners-nav--next" aria-label={m.next} onClick={() => scrollByStep(1)}>
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </header>

          <div className="partners-slider-wrap">
            <div ref={trackRef} className="partners-slider" role="list" aria-label="협력기관 로고 목록">
              {PARTNER_LOGOS.map((logo) => (
                <div key={logo.src} className="partner-card" role="listitem">
                  <img className="partner-logo" src={logo.src} alt={logo.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

