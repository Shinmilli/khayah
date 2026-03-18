import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE_NAME } from '../constants'

const MENU_ITEMS = [
  { label: '홈', path: '/' },
  { label: '카야소개', path: '/카야/카야소개' },
  { label: '해외사업', path: '/해외사업' },
  { label: '국내사업', path: '/국내사업' },
  { label: '후원가이드', path: '/후원가이드/후원자-가이드' },
  { label: '소식/자료', path: '/소식' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="header_placeholder" />
      <div id="Top_bar" className={`loading${mobileMenuOpen ? ' responsive-open' : ''}`}>
        <div className="container">
          <div className="column one">
            <div className="top_bar_left clearfix">
              <div className="logo_wrapper">
                <Link to="/" id="logo" className="logo_wrapper_link" rel="home">
                  <img
                    src="/images/khayah_logo_dark_2x.png"
                    alt={SITE_NAME}
                    className="scale-with-grid"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const span = target.nextElementSibling
                      if (span) (span as HTMLElement).style.display = 'inline'
                    }}
                  />
                  <span className="logo_fallback" style={{ display: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
                    {SITE_NAME}
                  </span>
                </Link>
              </div>
              <div className="menu_wrapper">
                <nav className="primary-nav">
                  <ul id="menu-primary-menu" className="menu">
                    {MENU_ITEMS.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <a
                  className="responsive-menu-toggle"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen((o) => !o)
                  }}
                  aria-label="메뉴"
                >
                  <span className="icon-menu" aria-hidden>≡</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
