import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE_NAME } from '../constants'
import { donateHref, useBizSupport } from '../features/biz/useBizSupport'
import { useImpactPage } from '../features/impact/useImpactPage'
import { pageHeroImageForPath, prefetchPageHeroImage } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { splitLocalePath } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import type { NavLinkKey, NavTopKey } from '../i18n/messages/ko'
import { fetchNavMenuImages } from '../services/api'
import { DEFAULT_NAV_MENU_IMAGES } from '../features/nav/navMenuImagesTypes'
import {
  filterNavColumns,
  NAV_MENU_COLUMNS,
  type NavMenuColumn,
  type NavMenuLinkDef,
} from '../features/nav/navVisibilityTypes'
import { useNavVisibility } from '../features/nav/useNavVisibility'
import { useSiteCommon } from '../features/site/useSiteCommon'
import { toCloudinaryWebpUrl } from '../utils/cloudinaryWebp'
import '../styles/site-header.css'

const LOGO_SRC = '/images/logo/khayah_logo.png'
const FALLBACK_LOGO = '/images/logo/khayah_logo.png'
const LOGO_SLOGAN = '사람을 키우고 섬기는 개발 NGO'

function activeTopKey(pathname: string): NavTopKey | null {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const path = pathnameWithoutLocale.replace(/\/+$/, '') || '/'
  if (path.startsWith('/about')) return 'khayah'
  if (path.startsWith('/business')) return 'business'
  if (path.startsWith('/support')) return 'support'
  if (path.startsWith('/news') || path.startsWith('/stories') || path.startsWith('/together')) return 'news'
  return null
}

function columnAllLinks(col: NavMenuColumn): NavMenuLinkDef[] {
  const base = col.links ?? []
  return base.flatMap((l) => [l, ...(l.children ?? [])])
}

const TOP_LINKS: { key: NavTopKey }[] = [
  { key: 'khayah' },
  { key: 'business' },
  { key: 'support' },
  { key: 'news' },
]

/** 대카테고리 클릭 시 이동할 하위 페이지. 숨김이면 보이는 첫 항목으로 대체 */
const TOP_LANDING_KEY: Record<NavTopKey, NavLinkKey> = {
  khayah: 'aboutKhayah',
  business: 'domestic',
  support: 'supportGuide',
  news: 'activities',
}

function topLandingPath(col: NavMenuColumn | undefined, key: NavTopKey): string | null {
  if (!col) return null
  const links = columnAllLinks(col)
  const preferred = links.find((link) => link.key === TOP_LANDING_KEY[key])
  return (preferred ?? links[0])?.to ?? null
}

function topBannerUrls(key: NavTopKey): string[] {
  const urls =
    key === 'khayah'
      ? [pageHeroImageForPath(PATH.aboutKhayah)]
      : key === 'business'
        ? [
            pageHeroImageForPath(PATH.businessDomestic),
            pageHeroImageForPath(PATH.businessOverseas),
            pageHeroImageForPath(PATH.businessAdvocacy),
            pageHeroImageForPath(PATH.businessProjects),
          ]
        : key === 'support'
          ? [pageHeroImageForPath(PATH.supportGuide)]
          : [pageHeroImageForPath(PATH.newsAnnouncements)]
  return urls.filter((url): url is string => Boolean(url))
}

export function Header() {
  const [atTop, setAtTop] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopMenuKey, setDesktopMenuKey] = useState<NavTopKey | null>(null)
  const desktopMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [menuImages, setMenuImages] = useState(DEFAULT_NAV_MENU_IMAGES.images)
  const navVisibility = useNavVisibility()
  const biz = useBizSupport()
  const impact = useImpactPage()
  const location = useLocation()
  const { locale, localize, swapLocale, messages } = useLocale()
  const nav = messages.nav

  const loc = (to: string) => localize(to)
  const topLabel = (key: NavTopKey) => nav.top[key]
  const linkLabel = (key: NavLinkKey) => nav.links[key]

  const navColumns = useMemo(() => {
    const columns = filterNavColumns(NAV_MENU_COLUMNS, navVisibility)
    const showImpact = locale === 'ko' && impact?.public === true
    const withImpact = (col: (typeof columns)[number]) => {
      if (!showImpact || col.topKey !== 'business') return col
      return { ...col, links: [...col.links, { key: 'impactGlance' as const, to: '/business/impact' }] }
    }
    if (!biz) return columns.map(withImpact)
    const orderOf = (key: string) => biz.menu.find((row) => row.key === key)?.order ?? 0
    const sortLinks = (links: NavMenuLinkDef[]): NavMenuLinkDef[] =>
      [...links]
        .sort((a, b) => orderOf(a.key) - orderOf(b.key))
        .map((link) => ({ ...link, children: link.children ? sortLinks(link.children) : undefined }))
    return columns.map((col) => withImpact(col.topKey === 'business' ? { ...col, links: sortLinks(col.links) } : col))
  }, [navVisibility, biz, impact, locale])
  const navByKey = useMemo(() => new Map(navColumns.map((c) => [c.topKey, c])), [navColumns])
  const visibleTopLinks = useMemo(
    () => TOP_LINKS.filter((item) => navColumns.some((col) => col.topKey === item.key)),
    [navColumns],
  )

  useEffect(() => {
    let cancelled = false
    fetchNavMenuImages()
      .then((doc) => {
        if (!cancelled) setMenuImages(doc.images)
      })
      .catch(() => {
        if (!cancelled) setMenuImages(DEFAULT_NAV_MENU_IMAGES.images)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cancelDesktopMenuTimer = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current)
      desktopMenuCloseTimer.current = null
    }
  }

  const openDesktopMenu = (key: NavTopKey) => {
    cancelDesktopMenuTimer()
    setDesktopMenuKey(key)
    for (const url of topBannerUrls(key)) prefetchPageHeroImage(url)
  }

  const closeDesktopMenu = () => {
    cancelDesktopMenuTimer()
    setDesktopMenuKey(null)
    const active = document.activeElement
    if (active instanceof HTMLElement && active.closest('.site-header')) {
      active.blur()
    }
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
    closeDesktopMenu()
    setMobileOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => () => cancelDesktopMenuTimer(), [])

  const closeMobile = () => setMobileOpen(false)
  const currentTop = activeTopKey(location.pathname)
  const site = useSiteCommon()
  const koSlogans = (site?.logo.slogansKo ?? [{ id: 's1', order: 1, text: LOGO_SLOGAN }])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((row) => row.text.trim())
    .filter(Boolean)
  const enSlogan = site?.logo.sloganEn.trim() ?? ''
  const slogans = locale === 'ko' ? koSlogans : enSlogan ? [enSlogan] : []
  const rotateSlogan = locale === 'ko' ? (site ? site.logo.rotate && slogans.length > 0 : true) : Boolean(enSlogan)
  const intervalSec = site?.logo.intervalSec ?? 3
  const [sloganIndex, setSloganIndex] = useState(0)
  useEffect(() => {
    if (!rotateSlogan || slogans.length < 2) return
    const timer = window.setInterval(() => {
      setSloganIndex((i) => (i + 1) % slogans.length)
    }, intervalSec * 2000)
    return () => window.clearInterval(timer)
  }, [rotateSlogan, intervalSec, slogans.join('\n')])
  const sloganText = slogans[sloganIndex % Math.max(slogans.length, 1)] ?? ''
  const logoSrc = locale === 'ko' ? site?.logo.imageKo || LOGO_SRC : site?.logo.imageEn || LOGO_SRC
  const headerDonateLabel =
    locale === 'ko'
      ? biz?.donate.menuLabel?.trim() || site?.headerDonate.labelKo || messages.home.hero.donate
      : messages.home.hero.donate
  const hideHeaderDonate =
    locale === 'ko' && biz?.donate.menuPin === 'off'
      ? true
      : locale === 'ko' && biz?.donate.menuPin === 'on'
        ? false
        : locale === 'ko' && site
          ? !site.headerDonate.pinned && !atTop
          : false

  const renderLinkList = (links: NavMenuLinkDef[]) => (
    <div className="site-header__submenu-list">
      {links.map((l) => {
        const label = linkLabel(l.key)
        return l.children?.length ? (
          <div key={`${l.to}-${l.key}`} className="site-header__submenu-group">
            <Link to={loc(l.to)} role="menuitem" className="site-header__submenu-group-title" onClick={closeDesktopMenu}>
              {label}
            </Link>
            <div className="site-header__submenu-sublinks" aria-label={nav.aria.subcategory(label)}>
              {l.children.map((c) => (
                <Link
                  key={`${l.to}__${c.to}__${c.key}`}
                  to={loc(c.to)}
                  role="menuitem"
                  className="site-header__submenu-sublink"
                  onClick={closeDesktopMenu}
                >
                  {linkLabel(c.key)}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div key={`${l.to}-${l.key}`} className="site-header__submenu-group site-header__submenu-group--single">
            <Link to={loc(l.to)} role="menuitem" className="site-header__submenu-group-title" onClick={closeDesktopMenu}>
              {label}
            </Link>
          </div>
        )
      })}
    </div>
  )

  const renderMobileLinks = (col: NavMenuColumn) => {
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
        atTop ? ' is-at-top' : ''
      }${desktopMenuKey ? ' is-desktop-menu-open' : ''}`}
    >
      <div className="site-header__bar">
        <div className="site-header__left">
          <Link
            to={loc('/')}
            className={`site-header__logo${rotateSlogan ? '' : ' site-header__logo--still'}`}
            rel="home"
            aria-label={SITE_NAME}
            style={
              rotateSlogan
                ? ({
                    ['--logo-rot']: `${intervalSec * 2}s`,
                    ['--logo-rot-delay']: `${intervalSec}s`,
                  } as CSSProperties)
                : undefined
            }
          >
            <span className="site-header__logo-face site-header__logo-face--mark" aria-hidden>
              <img
                className="site-header__logo-img site-header__logo-img--color"
                src={logoSrc}
                alt=""
                onError={(e) => {
                  const el = e.currentTarget
                  if (el.dataset.fallback === '1') return
                  el.dataset.fallback = '1'
                  el.src = FALLBACK_LOGO
                }}
              />
            </span>
            {rotateSlogan ? (
              <span className="site-header__logo-face site-header__logo-face--slogan" aria-hidden>
                {sloganText}
              </span>
            ) : null}
          </Link>

          <nav aria-label={nav.aria.main}>
            <ul className="site-header__nav">
              {visibleTopLinks.map((item) => {
                const col = navByKey.get(item.key)
                const linksFlat = col ? columnAllLinks(col) : []
                const hasSub = linksFlat.length > 0
                const subOpen = hasSub && desktopMenuKey === item.key
                const sectionLabel = topLabel(item.key)
                const landingPath = topLandingPath(col, item.key)

                return (
                  <li
                    key={item.key}
                    className={`site-header__nav-item${subOpen ? ' is-menu-open' : ''}${
                      currentTop === item.key ? ' is-current' : ''
                    }`}
                    onMouseEnter={(e) => {
                      if (!hasSub) return
                      const focused = document.activeElement
                      if (
                        focused instanceof HTMLElement &&
                        focused.classList.contains('site-header__nav-link') &&
                        !e.currentTarget.contains(focused)
                      ) {
                        focused.blur()
                      }
                      openDesktopMenu(item.key)
                    }}
                    onMouseLeave={() => hasSub && scheduleCloseDesktopMenu()}
                  >
                    {landingPath ? (
                      <Link
                        to={loc(landingPath)}
                        className="site-header__nav-link"
                        aria-expanded={hasSub ? subOpen : undefined}
                        aria-haspopup={hasSub ? 'menu' : undefined}
                        onFocus={() => {
                          if (hasSub) openDesktopMenu(item.key)
                        }}
                        onClick={closeDesktopMenu}
                      >
                        {sectionLabel}
                      </Link>
                    ) : (
                      <span className="site-header__nav-link">{sectionLabel}</span>
                    )}

                    {hasSub && col ? (
                      <div
                        className={`site-header__submenu${subOpen ? ' is-open' : ''}`}
                        role="menu"
                        aria-label={nav.aria.submenu(sectionLabel)}
                        aria-hidden={!subOpen}
                        onMouseEnter={() => openDesktopMenu(item.key)}
                        onMouseLeave={scheduleCloseDesktopMenu}
                        onFocusCapture={() => openDesktopMenu(item.key)}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('a[href]')) closeDesktopMenu()
                        }}
                      >
                        <div
                          className={`site-header__submenu-inner${
                            menuImages[col.topKey] ? '' : ' site-header__submenu-inner--no-visual'
                          }`}
                        >
                          <div className="site-header__submenu-left">
                            <p className="site-header__submenu-title">{topLabel(col.topKey)}</p>
                          </div>
                          <div className="site-header__submenu-right">
                            {renderLinkList(col.links ?? [])}
                          </div>
                          {menuImages[col.topKey] ? (
                            <div className="site-header__submenu-visual" aria-hidden="true">
                              <img src={toCloudinaryWebpUrl(menuImages[col.topKey])} alt="" />
                            </div>
                          ) : null}
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
          <a
            href={donateHref(biz)}
            className={`site-header__donate${hideHeaderDonate ? ' is-hidden' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            hidden={hideHeaderDonate || undefined}
          >
            {headerDonateLabel}
          </a>
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
        {navColumns.map((col) => (
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
