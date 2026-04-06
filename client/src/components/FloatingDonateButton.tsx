import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const HERO_ID = 'home-hero-banner'

/** 히어로가 뷰포트에 절반 이하만 보일 때부터 플로팅 표시 */
const HERO_SHOW_FAB_RATIO = 0.5
const HERO_IO_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20)

const SOCIAL_LINKS = [
  {
    key: 'kakao',
    href: 'https://pf.kakao.com/_TnWKK',
    label: '카카오톡 채널',
    className: 'site-floating-fab__social site-floating-fab__social--kakao',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M12 3C6.77 3 2.45 6.11 2.45 9.96c0 2.79 1.86 5.23 4.66 6.57-.15.55-.97 3.55-1 3.72-.16.63.23.62.48.45l4.37-3.05c.37.05.75.08 1.14.08 5.23 0 9.55-3.11 9.55-6.96C21.65 6.11 17.33 3 12 3z"
        />
      </svg>
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/khayah_international',
    label: '인스타그램',
    className: 'site-floating-fab__social site-floating-fab__social--instagram',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
  },
  {
    key: 'blog',
    href: 'https://blog.naver.com/khayah',
    label: '네이버 블로그',
    className: 'site-floating-fab__social site-floating-fab__social--blog',
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M4 5h16v2H4V5zm0 6h10v2H4v-2zm0 6h16v2H4v-2zm12-6h4v2h-4v-2z"
        />
      </svg>
    ),
  },
] as const

export function FloatingDonateButton() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showFab, setShowFab] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setShowFab(true)
      return
    }

    const el = document.getElementById(HERO_ID)
    if (!el) {
      setShowFab(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setShowFab(entry.intersectionRatio <= HERO_SHOW_FAB_RATIO)
      },
      { threshold: HERO_IO_THRESHOLDS, rootMargin: '0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isHome, location.pathname])

  return (
    <div
      className={`site-floating-fab${showFab ? ' is-visible' : ''}`}
      aria-hidden={!showFab}
    >
      <div className="site-floating-fab__socials">
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.key}
            href={s.href}
            className={s.className}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            tabIndex={showFab ? 0 : -1}
          >
            {s.icon}
          </a>
        ))}
      </div>
      <Link
        to="/후원가이드/후원신청"
        className="site-floating-fab__donate"
        aria-label="후원하기"
        tabIndex={showFab ? 0 : -1}
      >
        <span className="site-floating-fab__heart" aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </span>
        <span className="site-floating-fab__label">후원하기</span>
      </Link>
    </div>
  )
}
