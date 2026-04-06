import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE_NAME } from '../constants'
import '../styles/site-header.css'

const LOGO_SRC = '/images/logo/khayah_logo.png'
const FALLBACK_LOGO = '/images/logo/khayah_logo.png'

type NavLink = { label: string; to: string }

type NavColumn = {
  id: string
  /** 데스크톱 서브메뉴 왼쪽 제목 */
  label: string
  /** 단일 세로 열 */
  links?: NavLink[]
  /** 카야: 두 개의 세로 열 */
  subColumns?: NavLink[][]
}

function columnAllLinks(col: NavColumn): NavLink[] {
  if (col.subColumns?.length) return col.subColumns.flat()
  return col.links ?? []
}

const NAV_COLUMNS: NavColumn[] = [
  {
    id: 'khaya-col',
    label: '카야',
    subColumns: [
      [
        { label: '인사말(카야스토리)', to: '/카야/카야-스토리' },
        { label: '연혁', to: '/카야/카야-연혁' },
        { label: '조직도', to: '/카야/조직도' },
        { label: '이사회 / 전문위원', to: '/카야/이사회-전문위원' },
        { label: '오시는 길', to: '/카야/위치안내' },
      ],
      [
        { label: '카야 소개 / CI', to: '/카야/카야소개#ci' },
        { label: '비전/미션', to: '/카야/카야소개#vision' },
        { label: '핵심사업', to: '/카야/핵심사업' },
        { label: '재정보고', to: '/소식/재정보고' },
      ],
    ],
  },
  {
    id: 'business-col',
    label: '사업',
    links: [
      { label: '국내사업', to: '/국내사업' },
      { label: '해외사업', to: '/해외사업' },
      { label: '옹호사업', to: '/사업/옹호사업' },
      { label: '진행사업', to: '/사업/진행사업' },
    ],
  },
  {
    id: 'support-col',
    label: '후원',
    links: [
      { label: '후원안내', to: '/후원가이드/후원자-가이드' },
      { label: '정기후원', to: '/후원가이드/정기후원' },
      { label: '일시후원', to: '/후원가이드/일시후원' },
      { label: '물품후원', to: '/후원가이드/물품후원' },
      { label: '자원봉사', to: '/후원가이드/자원봉사' },
    ],
  },
  {
    id: 'news-col',
    label: '소식',
    links: [
      { label: '공지사항', to: '/소식/공지사항' },
      { label: '활동소식', to: '/소식/카야소식' },
      { label: '연간소식지', to: '/소식/소식지' },
      { label: '언론보도', to: '/소식/언론보도' },
      { label: '1:1문의', to: '/소식/1대1문의' },
    ],
  },
]

const TOP_LINKS = [
  { label: '카야', to: '/카야/카야소개' },
  { label: '사업', to: '/국내사업' },
  { label: '후원', to: '/후원가이드/후원자-가이드' },
  { label: '소식', to: '/소식' },
]

const NAV_BY_LABEL = new Map(NAV_COLUMNS.map((c) => [c.label, c]))

export function Header() {
  const [atTop, setAtTop] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopMenuLabel, setDesktopMenuLabel] = useState<string | null>(null)
  const desktopMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const cancelDesktopMenuTimer = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current)
      desktopMenuCloseTimer.current = null
    }
  }

  const openDesktopMenu = (label: string) => {
    cancelDesktopMenuTimer()
    setDesktopMenuLabel(label)
  }

  /** fixed 드롭다운으로 이동할 때 li에서 잠깐 hover가 끊겨도 패널이 유지되도록 지연 닫기 */
  const scheduleCloseDesktopMenu = () => {
    cancelDesktopMenuTimer()
    desktopMenuCloseTimer.current = setTimeout(() => {
      setDesktopMenuLabel(null)
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
        setDesktopMenuLabel(null)
        cancelDesktopMenuTimer()
      }
    }
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setDesktopMenuLabel(null)
    cancelDesktopMenuTimer()
  }, [location.pathname])

  useEffect(() => () => cancelDesktopMenuTimer(), [])

  useEffect(() => {
    document.body.classList.toggle('has-overlay-header', isHome)
    document.body.classList.toggle(
      'has-transparent-header',
      isHome && atTop && !mobileOpen && desktopMenuLabel === null,
    )
    return () => {
      document.body.classList.remove('has-overlay-header')
      document.body.classList.remove('has-transparent-header')
    }
  }, [isHome, atTop, mobileOpen, desktopMenuLabel])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={`site-header${!atTop ? ' is-scrolled' : ''}${mobileOpen ? ' is-mobile-open' : ''}${
        isHome ? ' is-home' : ''
      }${atTop ? ' is-at-top' : ''}${desktopMenuLabel ? ' is-desktop-menu-open' : ''}`}
    >
      <div className="site-header__bar">
        <div className="site-header__left">
          <Link to="/" className="site-header__logo" rel="home">
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

          <nav aria-label="주요 메뉴">
            <ul className="site-header__nav">
              {TOP_LINKS.map((item) => {
                const col = NAV_BY_LABEL.get(item.label)
                const linksFlat = col ? columnAllLinks(col) : []
                const hasSub = linksFlat.length > 0
                const subOpen = hasSub && desktopMenuLabel === item.label

                return (
                  <li
                    key={item.to}
                    className={`site-header__nav-item${subOpen ? ' is-menu-open' : ''}`}
                    onMouseEnter={() => hasSub && openDesktopMenu(item.label)}
                    onMouseLeave={() => hasSub && scheduleCloseDesktopMenu()}
                  >
                    <Link
                      to={item.to}
                      className="site-header__nav-link"
                      aria-expanded={hasSub ? subOpen : undefined}
                      aria-haspopup={hasSub ? 'menu' : undefined}
                    >
                      {item.label}
                    </Link>

                    {hasSub && col ? (
                      <div
                        className={`site-header__submenu${subOpen ? ' is-open' : ''}`}
                        role="menu"
                        aria-label={`${item.label} 하위 메뉴`}
                        aria-hidden={!subOpen}
                        onMouseEnter={() => openDesktopMenu(item.label)}
                        onMouseLeave={scheduleCloseDesktopMenu}
                        onFocusCapture={() => openDesktopMenu(item.label)}
                      >
                        <div className="site-header__submenu-inner">
                          <div className="site-header__submenu-left">
                            <p className="site-header__submenu-title">{col.label}</p>
                          </div>
                          <div className="site-header__submenu-right">
                            <div
                              className={`site-header__submenu-columns${
                                col.subColumns && col.subColumns.length > 1 ? ' site-header__submenu-columns--split' : ''
                              }`}
                            >
                              {(col.subColumns ?? [col.links ?? []]).map((group, gi) => (
                                <div key={gi} className="site-header__submenu-col">
                                  {group.map((l) => (
                                    <Link
                                      key={`${gi}-${l.to}-${l.label}`}
                                      to={l.to}
                                      role="menuitem"
                                      className="site-header__submenu-link"
                                    >
                                      {l.label}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
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
          <button
            type="button"
            className="site-header__toggle"
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
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
            <summary>{col.label}</summary>
            <div className="site-header__mobile-links">
              {columnAllLinks(col).map((l) => (
                <Link key={`${l.to}-${l.label}`} to={l.to} onClick={closeMobile}>
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        ))}
        <Link to="/" className="site-header__mobile-single" onClick={closeMobile}>
          홈
        </Link>
      </div>
    </header>
  )
}
