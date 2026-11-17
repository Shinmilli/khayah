import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { donateHref, useBizSupport } from '../../biz/useBizSupport'
import { HERO_BIZ_LINKS, HERO_SLIDE_IMAGES } from '../homeRedesignData'
import type { HeroBannerPublicSlide } from '../heroBannerTypes'
import { useLocale } from '../../../i18n/LocaleContext'
import { fetchHeroBanner } from '../../../services/api'
import { toCloudinaryWebpUrl } from '../../../utils/cloudinaryWebp'

const BIZ_ICONS = ['home', 'public', 'menu_book', 'groups'] as const

const KO_BIZ_SVGS = [
  <svg key="home" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></svg>,
  <svg key="globe" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.6 2.6 14.4 0 17" /><path d="M12 3.5c-2.6 2.6-2.6 14.4 0 17" /></svg>,
  <svg key="book" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5" /><path d="M12 6c2-1.5 5-2 8-1.5V19c-3-.5-6 0-8 1.5" /><path d="M12 6v14.5" /></svg>,
  <svg key="heart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>,
]

const heroSlideCache = new Map<string, HeroBannerPublicSlide[]>()

function sameSlides(a: HeroBannerPublicSlide[], b: HeroBannerPublicSlide[]): boolean {
  if (a.length !== b.length) return false
  return a.every(
    (slide, i) =>
      slide.id === b[i]?.id &&
      slide.image === b[i]?.image &&
      slide.alt === b[i]?.alt &&
      slide.lines.join('\n') === b[i]?.lines.join('\n') &&
      (slide.smallLine ?? '') === (b[i]?.smallLine ?? ''),
  )
}

export function HeroSection() {
  const biz = useBizSupport()
  const { locale, messages, localize } = useLocale()
  const m = messages.home.hero
  const fallbackSlides = useMemo(
    () =>
      HERO_SLIDE_IMAGES.map((image, i) => ({
        id: `fallback-${i}`,
        order: i + 1,
        image,
        alt: m.slides[i]?.alt ?? '',
        lines: m.slides[i]?.lines ?? [],
      })),
    [m.slides],
  )
  const [slides, setSlides] = useState<HeroBannerPublicSlide[] | null>(() => heroSlideCache.get(locale) ?? null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setSlides(heroSlideCache.get(locale) ?? null)
    let cancelled = false
    fetchHeroBanner(locale)
      .then((doc) => {
        if (cancelled) return
        const next = doc.slides.length ? doc.slides : fallbackSlides
        heroSlideCache.set(locale, next)
        setSlides((prev) => (prev && sameSlides(prev, next) ? prev : next))
      })
      .catch(() => {
        if (cancelled || heroSlideCache.has(locale)) return
        setSlides(fallbackSlides)
      })
    return () => {
      cancelled = true
    }
  }, [locale, fallbackSlides])

  useEffect(() => {
    setIndex(0)
  }, [slides])

  const list = slides ?? []

  useEffect(() => {
    if (!list.length) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [list.length])

  return (
    <section className="hero-section" id="home-hero-banner">
      <div className="hero-slider">
        {list.map((slide, i) => (
          <div key={slide.id || slide.image} className={`hero-slide${i === index ? ' active' : ''}`}>
            <picture>
              {slide.mobileImage ? <source media="(max-width: 720px)" srcSet={toCloudinaryWebpUrl(slide.mobileImage)} /> : null}
              <img src={toCloudinaryWebpUrl(slide.image)} alt={slide.alt} />
            </picture>
            <div className="hero-shade" aria-hidden="true" style={{ opacity: slide.dim === 'weak' ? 0.28 : slide.dim === 'strong' ? 0.62 : 0.45 }} />
            <div className="hero-content" style={{ textAlign: slide.align === 'center' ? 'center' : 'left' }}>
              <div className="hero-content-inner">
                <div className="hero-text">
                  {slide.lines.some((line) => line.trim()) ? (
                    <div className="hero-copy">
                      {slide.lines.map((line, li) => (
                        <div key={`${slide.id}-${li}-${line}`} className="hero-text-kr">
                          {line}
                        </div>
                      ))}
                      {(() => {
                        const small =
                          slide.smallLine !== undefined
                            ? slide.smallLine
                            : locale === 'ko'
                              ? '교육으로 사람을 세우는 국제개발협력 NGO, 카야인터내셔널'
                              : ''
                        return small ? <p className="hero-org">{small}</p> : null
                      })()}
                      <div className="hero-text-en" aria-hidden="true" />
                    </div>
                  ) : null}
                </div>

                <a
                  className="hero-cta-btn"
                  href={donateHref(biz)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {m.donate}
                </a>
                {(slide.buttons ?? []).map((button) => (
                  <a key={button.href} className="hero-cta-btn" href={button.href} style={{ marginLeft: 8 }}>
                    {button.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-pagination" aria-label={m.slidesNavAria}>
        {list.map((slide, i) => (
          <button
            key={slide.id || slide.image}
            type="button"
            className={`hero-dot${i === index ? ' active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={m.slideLabel(i + 1)}
          />
        ))}
      </div>

      <nav className="hero-biz-strip" aria-label={m.bizStrip}>
        {HERO_BIZ_LINKS.map((item, i) => {
          const to = locale === 'ko' && i === 3 ? '/business/social' : item.to
          return (
            <Link key={to} to={localize(to)} className="hero-biz-strip__item">
              <span className="hero-biz-strip__icon" aria-hidden="true">
                {locale === 'ko' ? KO_BIZ_SVGS[i] : <span className="material-symbols-outlined">{BIZ_ICONS[i]}</span>}
              </span>
              <span className="hero-biz-strip__label">{m.bizLabels[i]}</span>
            </Link>
          )
        })}
      </nav>
    </section>
  )
}
