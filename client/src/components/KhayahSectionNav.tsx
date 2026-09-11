import { Link, useLocation } from 'react-router-dom'
import {
  getActiveKhayahSection,
  KHAYAH_SECTION_NAV,
} from '../features/khayah-about/khayahAboutHubTabs'
import { useLocale } from '../i18n/LocaleContext'
import '../styles/khayah-about-hub.css'

export function KhayahSectionNav() {
  const { localize, messages } = useLocale()
  const location = useLocation()
  const active = getActiveKhayahSection(location.pathname, location.search, location.hash)

  return (
    <nav className="khayah-about-tabs khayah-about-tabs--sections" aria-label={messages.pages.aboutHub.tabsAria}>
      <div className="khayah-about-tabs__rail">
        {KHAYAH_SECTION_NAV.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              to={localize(item.to)}
              className={`khayah-about-tabs__tab${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {messages.nav.links[item.labelKey]}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
