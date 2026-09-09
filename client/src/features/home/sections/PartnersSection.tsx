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

  return (
    <section className="partners-section" aria-label={m.aria}>
      <div className="partners-container">
        <header className="partners-head">
          <p className="partners-kicker">{m.kicker}</p>
          <h2 className="partners-title">{m.title}</h2>
          <p className="partners-sub">{m.subtitle}</p>
        </header>

        <div className="partners-marquee">
          <div className="partners-track">
            {PARTNER_LOGOS.map((logo) => (
              <div key={logo.src} className="partner-card">
                <img className="partner-logo" src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
            {PARTNER_LOGOS.map((logo) => (
              <div key={`${logo.src}-dup`} className="partner-card" aria-hidden="true">
                <img className="partner-logo" src={logo.src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
