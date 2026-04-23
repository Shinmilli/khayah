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
  <svg key="i3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden>
    <path d="M12.79 21c-.43 0-.84-.17-1.15-.48l-2.55-2.55 1.41-1.41 2.29 2.29 7.39-7.39c.31-.31.72-.48 1.15-.48s.84.17 1.15.48c.63.63.63 1.66 0 2.29l-8.25 8.25c-.31.31-.72.48-1.14.48z" opacity=".0" />
    <path d="M20.47 10.63c-.42-.42-1.1-.42-1.52 0l-4.92 4.92-2.12-2.12c-.42-.42-1.1-.42-1.52 0l-.3.3 3.94 3.94 6.44-6.44c.42-.42.42-1.1 0-1.52z" opacity=".0" />
    <path d="M21.5 11.5l-4.78 4.78-1.06-1.06 3.72-3.72c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0L14.24 13.8l-1.06-1.06 1.76-1.76c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-1.76 1.76-2.27-2.27c-.75-.75-1.77-1.17-2.83-1.17S4.59 8.31 3.83 9.07L2 10.9l1.41 1.41 1.83-1.83c.75-.75 1.77-1.17 2.83-1.17.68 0 1.33.18 1.9.52l-1.5 1.5c-.39.39-.39 1.02 0 1.41.19.19.45.29.71.29s.52-.1.71-.29l1.64-1.64 1.06 1.06-1.64 1.64c-.39.39-.39 1.02 0 1.41.19.19.45.29.71.29s.52-.1.71-.29l1.64-1.64 1.06 1.06-1.5 1.5c.33.57.52 1.22.52 1.9 0 1.06-.41 2.08-1.17 2.83L10.9 22 12.31 23.41l1.83-1.83c.76-.76 1.17-1.78 1.17-2.83 0-.79-.24-1.55-.67-2.2l1.02-1.02 1.06 1.06 1.02-1.02c.65.43 1.41.67 2.2.67 1.05 0 2.07-.41 2.83-1.17L24 12.9 21.5 11.5z" />
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
              {i === 2 ? <span className="material-symbols-outlined">handshake</span> : BIZ_ICONS[i]}
            </span>
            <span className="hero-biz-strip__label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
