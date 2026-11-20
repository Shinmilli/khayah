import { useLocale } from '../../../i18n/LocaleContext'
import { useSiteCommon } from '../../site/useSiteCommon'
import { normalizeHref } from '../../../utils/hrefs'

export const PARTNER_LOGOS: { src: string; alt: string }[] = [
  { src: '/images/Home/parteners/partner-1.png', alt: '협력기관 로고 1' },
  { src: '/images/Home/parteners/partner-2.png', alt: '협력기관 로고 2' },
  { src: '/images/Home/parteners/partner-3.png', alt: '바보의나눔' },
  { src: '/images/Home/parteners/partner-4.png', alt: '협력기관 로고 4' },
  { src: '/images/Home/parteners/partner-5.png', alt: '협력기관 로고 5' },
  { src: '/images/Home/parteners/hankook-cns.png', alt: '한국C&S' },
  { src: '/images/Home/parteners/lh.png', alt: 'LH 한국토지주택공사' },
  { src: '/images/Home/parteners/ona-creation.png', alt: 'ONA CREATION' },
  { src: '/images/Home/parteners/nanum-dream.png', alt: '나눔과꿈' },
  { src: '/images/Home/parteners/natural-core.png', alt: '네츄럴코어' },
  { src: '/images/Home/parteners/maepyo.png', alt: '매표화학' },
  { src: '/images/Home/parteners/samsung.png', alt: '삼성' },
  { src: '/images/Home/parteners/seoul.png', alt: '서울특별시' },
  { src: '/images/Home/parteners/juno-hair.png', alt: '준오헤어' },
  { src: '/images/Home/parteners/koica.png', alt: '코이카' },
  { src: '/images/Home/parteners/bishkek.png', alt: '비슈케크' },
  { src: '/images/Home/parteners/ala-too.png', alt: '알라투대학교' },
  { src: '/images/Home/parteners/tongil-nanum.png', alt: '통일과나눔' },
  { src: '/images/Home/parteners/sorsogon.png', alt: '소르소곤 주립대학교' },
  { src: '/images/Home/parteners/happybean.png', alt: '해피빈' },
  { src: '/images/Home/parteners/hwang-namgi.png', alt: '황남기 합격캠프' },
]

export function PartnersSection() {
  const { locale, messages } = useLocale()
  const site = useSiteCommon()
  const m = messages.home.partners
  if (locale === 'ko') {
    const logos = (site?.partners ?? PARTNER_LOGOS.map((logo, i) => ({
      id: logo.src,
      order: i + 1,
      enabled: true,
      logo: logo.src,
      nameKo: logo.alt,
      nameEn: '',
      kind: '',
      href: '',
    })))
      .filter((logo) => logo.enabled && logo.logo)
      .sort((a, b) => a.order - b.order)
    const row = (copy: number) =>
      logos.map((logo) => {
        const img = <img className="partner-logo" src={logo.logo} alt={copy === 0 ? logo.nameKo : ''} />
        const key = `${logo.id}-${copy}`
        return logo.href ? (
          <a
            key={key}
            className="partner-card"
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={copy === 1}
          >
            {img}
          </a>
        ) : (
          <div key={key} className="partner-card" aria-hidden={copy === 1}>
            {img}
          </div>
        )
      })

    return (
      <section className="partners-section partners-section--marquee" aria-label={m.aria}>
        <div className="partners-container">
          <header className="partners-head partners-head--left">
            <h2 className="partners-title">{m.title}</h2>
            <p className="partners-sub">{m.subtitle}</p>
          </header>
          <div className="partners-marquee">
            <div className="partners-track">
              {row(0)}
              {row(1)}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="partners-section" aria-label={m.aria}>
      <div className="partners-container">
        <header className="partners-head">
          <h2 className="partners-title">{m.title}</h2>
          <p className="partners-sub">{m.subtitle}</p>
        </header>

        <div className="partners-marquee">
          <div className="partners-track">
            {PARTNER_LOGOS.map((logo) => (
              <div key={logo.src} className="partner-card">
                <img className="partner-logo" src={logo.src} alt={logo.alt} />
              </div>
            ))}
            {PARTNER_LOGOS.map((logo) => (
              <div key={`${logo.src}-dup`} className="partner-card" aria-hidden="true">
                <img className="partner-logo" src={logo.src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
