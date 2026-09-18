import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NANUM_DONATE_URL } from '../../../constants/nanumDonate'
import { HERO_BIZ_LINKS, HERO_SLIDE_IMAGES } from '../homeRedesignData'
import type { HeroBannerPublicSlide } from '../heroBannerTypes'
import { useLocale } from '../../../i18n/LocaleContext'
import { fetchHeroBanner } from '../../../services/api'

const BIZ_ICONS = ['home', 'public', 'menu_book', 'groups'] as const

export function HeroSection() {
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
  const [slides, setSlides] = useState<HeroBannerPublicSlide[]>(fallbackSlides)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchHeroBanner(locale)
      .then((doc) => {
        if (cancelled) return
        if (doc.slides.length) setSlides(doc.slides)
        else setSlides(fallbackSlides)
      })
      .catch(() => {
        if (!cancelled) setSlides(fallbackSlides)
      })
    return () => {
      cancelled = true
    }
  }, [locale, fallbackSlides])

  useEffect(() => {
    setIndex(0)
  }, [slides])

  useEffect(() => {
    if (!slides.length) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <section className="hero-section" id="home-hero-banner">
      <div className="hero-slider">
        {slides.map((slide, i) => (
          <div key={slide.id || slide.image} className={`hero-slide${i === index ? ' active' : ''}`}>
            <img src={slide.image} alt={slide.alt} />
            <div className="hero-content">
              <div className="hero-content-inner">
                <div className="hero-text">
                  <div className="hero-copy">
                    {slide.lines.map((line, li) => (
                      <div key={`${slide.id}-${li}-${line}`} className="hero-text-kr">
                        {line}
                      </div>
                    ))}
                    <div className="hero-text-en" aria-hidden="true" />
                  </div>

                  <a
                    className="hero-cta-btn"
                    href={NANUM_DONATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.donate}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-pagination" aria-label={m.slidesNavAria}>
        {slides.map((slide, i) => (
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
        {HERO_BIZ_LINKS.map((item, i) => (
          <Link key={item.to} to={localize(item.to)} className="hero-biz-strip__item">
            <span className="hero-biz-strip__icon" aria-hidden="true">
              <span className="material-symbols-outlined">{BIZ_ICONS[i]}</span>
            </span>
            <span className="hero-biz-strip__label">{m.bizLabels[i]}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
