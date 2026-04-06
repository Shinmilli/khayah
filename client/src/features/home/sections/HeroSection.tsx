import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_BIZ_LINKS, HERO_SLIDES } from '../homeRedesignData'

const BIZ_ICONS = [
  <svg key="i1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>,
  <svg key="i2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>,
  <svg key="i3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832a4 4 0 011.985.596l.465.232a4 4 0 001.985.596H18M11 5.882l.348-1.97A1.76 1.76 0 0113.292 3h.416a1.76 1.76 0 011.944 1.912L17 5.882M19 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>,
  <svg key="i4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>,
]

export function HeroSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="hero-section" id="home-hero-banner">
      <div className="hero-slider">
        {HERO_SLIDES.map((slide, i) => (
          <div key={slide.alt} className={`hero-slide${i === index ? ' active' : ''}`}>
            <img src={slide.image} alt={slide.alt} />
            <div className="hero-content">
              <div className="hero-content-inner">
                <div className="hero-text">
                  <div className="hero-copy">
                    {slide.lines.map((line) => (
                      <div key={line} className="hero-text-kr">
                        {line}
                      </div>
                    ))}
                    <div className="hero-text-en" aria-hidden="true" />
                  </div>

                  <a className="hero-cta-btn" href="#support">
                    후원하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-pagination" aria-label="메인 슬라이드">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            className={`hero-dot${i === index ? ' active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번 슬라이드`}
          />
        ))}
      </div>

      <nav className="hero-biz-strip" aria-label="사업 분야">
        {HERO_BIZ_LINKS.map((item, i) => (
          <Link key={item.to} to={item.to} className="hero-biz-strip__item">
            <span className="hero-biz-strip__icon" aria-hidden="true">
              {BIZ_ICONS[i]}
            </span>
            <span className="hero-biz-strip__label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
