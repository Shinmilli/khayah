import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE_NAME } from '../constants'
import { splitLocalePath } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import type { NavLinkKey, NavTopKey } from '../i18n/messages/ko'
import '../styles/site-header.css'

const LOGO_SRC = '/images/logo/khayah_logo.png'
const FALLBACK_LOGO = '/images/logo/khayah_logo.png'

type NavLinkDef = { key: NavLinkKey; to: string; children?: NavLinkDef[] }

type NavColumn = {
  id: string
  topKey: NavTopKey
  links?: NavLinkDef[]
  subColumns?: NavLinkDef[][]
  subRows?: NavLinkDef[][]
}

function columnAllLinks(col: NavColumn): NavLinkDef[] {
  if (col.subRows?.length) return col.subRows.flat()
  if (col.subColumns?.length) return col.subColumns.flat()
  const base = col.links ?? []
  return base.flatMap((l) => [l, ...(l.children ?? [])])
}

const NAV_COLUMNS: NavColumn[] = [
  {
    id: 'khaya-col',
    topKey: 'khayah',
    subRows: [
      [
        { key: 'greeting', to: '/about/greeting' },
        { key: 'history', to: '/about/history' },
        { key: 'location', to: '/about/location' },
        { key: 'financialReport', to: '/news/financial-report' },
      ],
      [
        { key: 'aboutKhayah', to: '/about/khayah' },
        { key: 'ci', to: '/about/khayah?tab=ci' },
        { key: 'org', to: '/about/khayah?tab=org' },
      ],
    ],
  },
  {
    id: 'business-col',
    topKey: 'business',
    links: [
      {
        key: 'domestic',
        to: '/business/domestic',
        children: [{ key: 'domesticEducation', to: '/business/domestic/education' }],
      },
      {
        key: 'overseas',
        to: '/business/overseas',
        children: [
          { key: 'overseasEducation', to: '/business/overseas/education' },
          { key: 'overseasHealth', to: '/business/overseas/health-care' },
        ],
      },
      { key: 'advocacy', to: '/business/advocacy' },
      { key: 'projects', to: '/business/projects' },
    ],
  },
  {
    id: 'support-col',
    topKey: 'support',
    links: [{ key: 'supportGuide', to: '/support/guide' }],
  },
  {
    id: 'news-col',
    topKey: 'news',
    links: [
      { key: 'stories', to: '/stories' },
      { key: 'announcements', to: '/news/announcements' },
      { key: 'activities', to: '/news/activities' },
      { key: 'newsletter', to: '/news/newsletter' },
      { key: 'press', to: '/news/press' },
      { key: 'inquiry', to: '/news/inquiry' },
    ],
  },
]

const TOP_LINKS: { key: NavTopKey; to: string }[] = [
  { key: 'khayah', to: '/about/khayah' },
  { key: 'business', to: '/business/domestic' },
  { key: 'support', to: '/support/guide' },
  { key: 'news', to: '/stories' },
]

const NAV_BY_KEY = new Map(NAV_COLUMNS.map((c) => [c.topKey, c]))

export function Header() {
  const [atTop, setAtTop] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopMenuKey, setDesktopMenuKey] = useState<NavTopKey | null>(null)
  const desktopMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const { locale, localize, swapLocale, messages } = useLocale()
  const nav = messages.nav

  const loc = (to: string) => localize(to)
  const topLabel = (key: NavTopKey) => nav.top[key]
  const linkLabel = (key: NavLinkKey) => nav.links[key]
  const { pathnameWithoutLocale } = splitLocalePath(location.pathname)
  const isHome = pathnameWithoutLocale === '/'

  const cancelDesktopMenuTimer = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current)
      desktopMenuCloseTimer.current = null
    }
  }

  const openDesktopMenu = (key: NavTopKey) => {
    cancelDesktopMenuTimer()
    setDesktopMenuKey(key)
  }

  /** fixed 드롭다운으로 이동할 때 li에서 잠깐 hover가 끊겨도 패널이 유지되도록 지연 닫기 */
  const scheduleCloseDesktopMenu = () => {
    cancelDesktopMenuTimer()
    desktopMenuCloseTimer.current = setTimeout(() => {
      setDesktopMenuKey(null)
      desktopMenuCloseTimer.current = null
    }, 280)
  }

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1025px)')
    const onChange = () => {
      if (mql.matches) setMobileOpen(false)
      else {
        setDesktopMenuKey(null)
        cancelDesktopMenuTimer()
      }
    }
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setDesktopMenuKey(null)
    cancelDesktopMenuTimer()
  }, [location.pathname])

  useEffect(() => () => cancelDesktopMenuTimer(), [])

  useEffect(() => {
    document.body.classList.toggle('has-overlay-header', isHome)
    document.body.classList.toggle(
      'has-transparent-header',
      isHome && atTop && !mobileOpen && desktopMenuKey === null,
    )
    return () => {
      document.body.classList.remove('has-overlay-header')
      document.body.classList.remove('has-transparent-header')
    }
  }, [isHome, atTop, mobileOpen, desktopMenuKey])

  const closeMobile = () => setMobileOpen(false)

  const renderLinkList = (links: NavLinkDef[]) => (
    <div className="site-header__submenu-columns">
      <div className="site-header__submenu-col">
        {links.map((l) => {
          const label = linkLabel(l.key)
          return l.children?.length ? (
            <div key={`${l.to}-${l.key}`} className="site-header__submenu-group">
              <Link to={loc(l.to)} role="menuitem" className="site-header__submenu-group-title">
                {label}
              </Link>
              <div className="site-header__submenu-sublinks" aria-label={nav.aria.subcategory(label)}>
                {l.children.map((c) => (
                  <Link
                    key={`${l.to}__${c.to}__${c.key}`}
                    to={loc(c.to)}
                    role="menuitem"
                    className="site-header__submenu-sublink"
                  >
                    {linkLabel(c.key)}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div key={`${l.to}-${l.key}`} className="site-header__submenu-group site-header__submenu-group--single">
              <Link to={loc(l.to)} role="menuitem" className="site-header__submenu-group-title">
                {label}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderMobileLinks = (col: NavColumn) => {
    if (!col.links?.length) {
      return columnAllLinks(col).map((l) => (
        <Link key={`${l.to}-${l.key}`} to={loc(l.to)} onClick={closeMobile}>
          {linkLabel(l.key)}
        </Link>
      ))
    }

    return col.links.map((l) => {
      const label = linkLabel(l.key)
      return l.children?.length ? (
        <div key={`${l.to}-${l.key}`} className="site-header__mobile-subgroup">
          <Link to={loc(l.to)} onClick={closeMobile} className="site-header__mobile-subgroup-title">
            {label}
          </Link>
          <div className="site-header__mobile-sublinks" aria-label={nav.aria.subcategory(label)}>
            {l.children.map((c) => (
              <Link key={`${l.to}__${c.to}__${c.key}`} to={loc(c.to)} onClick={closeMobile}>
                {linkLabel(c.key)}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link key={`${l.to}-${l.key}`} to={loc(l.to)} onClick={closeMobile}>
          {label}
        </Link>
      )
    })
  }

  return (
    <header
      className={`site-header${!atTop ? ' is-scrolled' : ''}${mobileOpen ? ' is-mobile-open' : ''}${
        isHome ? ' is-home' : ''
      }${atTop ? ' is-at-top' : ''}${desktopMenuKey ? ' is-desktop-menu-open' : ''}`}
    >
      <div className="site-header__bar">
        <div className="site-header__left">
          <Link to={loc('/')} className="site-header__logo" rel="home">
            <img
              src={LOGO_SRC}
              alt={SITE_NAME}
              onError={(e) => {
                const el = e.currentTarget
                if (el.dataset.fallback === '1') return
                el.dataset.fallback = '1'
                el.src = FALLBACK_LOGO
              }}
            />
          </Link>

          <nav aria-label={nav.aria.main}>
            <ul className="site-header__nav">
              {TOP_LINKS.map((item) => {
                const col = NAV_BY_KEY.get(item.key)
                const linksFlat = col ? columnAllLinks(col) : []
                const hasSub = linksFlat.length > 0
                const subOpen = hasSub && desktopMenuKey === item.key
                const sectionLabel = topLabel(item.key)

                return (
                  <li
                    key={item.to}
                    className={`site-header__nav-item${subOpen ? ' is-menu-open' : ''}`}
                    onMouseEnter={() => hasSub && openDesktopMenu(item.key)}
                    onMouseLeave={() => hasSub && scheduleCloseDesktopMenu()}
                  >
                    <Link
                      to={loc(item.to)}
                      className="site-header__nav-link"
                      aria-expanded={hasSub ? subOpen : undefined}
                      aria-haspopup={hasSub ? 'menu' : undefined}
                    >
                      {sectionLabel}
                    </Link>

                    {hasSub && col ? (
                      <div
                        className={`site-header__submenu${subOpen ? ' is-open' : ''}`}
                        role="menu"
                        aria-label={nav.aria.submenu(sectionLabel)}
                        aria-hidden={!subOpen}
                        onMouseEnter={() => openDesktopMenu(item.key)}
                        onMouseLeave={scheduleCloseDesktopMenu}
                        onFocusCapture={() => openDesktopMenu(item.key)}
                      >
                        <div className="site-header__submenu-inner">
                          <div className="site-header__submenu-left">
                            <p className="site-header__submenu-title">{topLabel(col.topKey)}</p>
                          </div>
                          <div className="site-header__submenu-right">
                            {col.subRows?.length ? (
                              <div className="site-header__submenu-rows">
                                {col.subRows.map((row, ri) => (
                                  <div key={ri} className="site-header__submenu-row">
                                    {row.map((l) => (
                                      <Link
                                        key={`${ri}-${l.to}-${l.key}`}
                                        to={loc(l.to)}
                                        role="menuitem"
                                        className="site-header__submenu-link"
                                      >
                                        {linkLabel(l.key)}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                {col.subColumns ? (
                                  <div
                                    className={`site-header__submenu-columns${
                                      col.subColumns && col.subColumns.length > 1
                                        ? ' site-header__submenu-columns--split'
                                        : ''
                                    }`}
                                  >
                                    {col.subColumns.map((group, gi) => (
                                      <div key={gi} className="site-header__submenu-col">
                                        {group.map((l) => (
                                          <Link
                                            key={`${gi}-${l.to}-${l.key}`}
                                            to={loc(l.to)}
                                            role="menuitem"
                                            className="site-header__submenu-link"
                                          >
                                            {linkLabel(l.key)}
                                          </Link>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  renderLinkList(col.links ?? [])
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="site-header__right">
          <nav className="site-header__locale" aria-label={nav.aria.locale}>
            <Link
              to={swapLocale('ko')}
              className={`site-header__locale-link${locale === 'ko' ? ' is-active' : ''}`}
              aria-current={locale === 'ko' ? 'page' : undefined}
            >
              한국어
            </Link>
            <span className="site-header__locale-sep" aria-hidden>
              |
            </span>
            <Link
              to={swapLocale('en')}
              className={`site-header__locale-link${locale === 'en' ? ' is-active' : ''}`}
              aria-current={locale === 'en' ? 'page' : undefined}
            >
              EN
            </Link>
          </nav>
          <button
            type="button"
            className="site-header__toggle"
            aria-label={mobileOpen ? nav.aria.mobileClose : nav.aria.mobileOpen}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`site-header__mobile${mobileOpen ? ' is-open' : ''}`} id="site-header-mobile-panel">
        {NAV_COLUMNS.map((col) => (
          <details key={col.id} className="site-header__mobile-group" open>
            <summary>{topLabel(col.topKey)}</summary>
            <div className="site-header__mobile-links">
              {renderMobileLinks(col)}
            </div>
          </details>
        ))}
        <Link to={loc('/')} className="site-header__mobile-single" onClick={closeMobile}>
          {nav.home}
        </Link>
      </div>
    </header>
  )
}
