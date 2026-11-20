import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NANUM_DONATE_URL } from '../constants/nanumDonate'
import { donateHref, useBizSupport } from '../features/biz/useBizSupport'
import { useLocale } from '../i18n/LocaleContext'
import { splitLocalePath } from '../i18n/locale'
import { useSiteCommon } from '../features/site/useSiteCommon'
import type { SiteClicker } from '../features/site/siteCommonTypes'

const HERO_ID = 'home-hero-banner'

/** 히어로가 뷰포트에 절반 이하만 보일 때부터 플로팅 표시 */
const HERO_SHOW_FAB_RATIO = 0.5
const HERO_IO_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20)

const SOCIAL_LINKS = [
  {
    key: 'kakao',
    href: 'https://pf.kakao.com/_TnWKK',
    labelKey: 'kakao',
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
    labelKey: 'instagram',
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
    labelKey: 'blog',
    className: 'site-floating-fab__social site-floating-fab__social--blog',
    icon: <span className="site-floating-fab__blog-word">blog</span>,
  },
] as const

const CLICKER_FALLBACK: SiteClicker[] = [
  { id: 'kakao', order: 1, enabled: true, labelKo: '카카오톡', href: 'https://pf.kakao.com/_TnWKK' },
  { id: 'instagram', order: 2, enabled: true, labelKo: '인스타그램', href: 'https://www.instagram.com/khayah_international' },
  { id: 'blog', order: 3, enabled: true, labelKo: '네이버 블로그', href: 'https://blog.naver.com/khayah' },
  { id: 'donate', order: 4, enabled: true, labelKo: '후원하기', href: NANUM_DONATE_URL },
]

export function FloatingDonateButton() {
  const { locale, messages } = useLocale()
  const site = useSiteCommon()
  const biz = useBizSupport()
  const location = useLocation()
  const donateLabel = locale === 'ko' ? site?.headerDonate.labelKo || messages.home.hero.donate : messages.home.hero.donate
  const clickers = (site?.clickers ?? CLICKER_FALLBACK)
    .filter((item) => item.enabled && item.href.trim() && item.href.trim() !== '#')
    .sort((a, b) => a.order - b.order)
  const socialLabels = {
    kakao: messages.footer.topLinks.kakao,
    instagram: messages.footer.topLinks.instagram,
    blog: messages.footer.topLinks.blog,
  } as const
  const { pathnameWithoutLocale } = splitLocalePath(location.pathname)
  const isHome = pathnameWithoutLocale === '/'
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

  if (locale === 'ko' && biz?.donate.showFloating === false) return null

  return (
    <div
      className={`site-floating-fab${showFab ? ' is-visible' : ''}`}
      aria-hidden={!showFab}
    >
      <div className="site-floating-fab__socials">
        {clickers
          .filter((item) => item.id !== 'donate')
          .map((item) => {
            const social = SOCIAL_LINKS.find((s) => s.key === item.id)
            if (!social) return null
            return (
              <a
                key={item.id}
                href={item.href}
                className={social.className}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'ko' ? item.labelKo : socialLabels[social.labelKey]}
                tabIndex={showFab ? 0 : -1}
              >
                {social.icon}
              </a>
            )
          })}
      </div>
      {clickers
        .filter((item) => item.id === 'donate')
        .map((item) => {
          const label = locale === 'ko' ? item.labelKo || donateLabel : donateLabel
          return (
            <a
              key={item.id}
              href={donateHref(biz)}
              className="site-floating-fab__donate"
              aria-label={label}
              tabIndex={showFab ? 0 : -1}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="site-floating-fab__heart" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </span>
              <span className="site-floating-fab__label">{label}</span>
            </a>
          )
        })}
    </div>
  )
}
