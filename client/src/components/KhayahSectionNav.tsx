import { Link, useLocation } from 'react-router-dom'
import {
  getActiveKhayahSection,
  KHAYAH_SECTION_NAV,
} from '../features/khayah-about/khayahAboutHubTabs'
import { useLocale } from '../i18n/LocaleContext'
import { isNavLinkEnabled } from '../features/nav/navVisibilityTypes'
import { useNavVisibility } from '../features/nav/useNavVisibility'
import '../styles/khayah-about-hub.css'

export function KhayahSectionNav() {
  const { localize, messages } = useLocale()
  const location = useLocation()
  const visibility = useNavVisibility()
  const active = getActiveKhayahSection(location.pathname, location.search, location.hash)
  const items = KHAYAH_SECTION_NAV.filter((item) => isNavLinkEnabled(visibility, item.labelKey))

  if (items.length === 0) return null

  return (
    <div className="kaya-subnav">
      <nav className="kaya-subnav__row" aria-label={messages.pages.aboutHub.tabsAria}>
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              to={localize(item.to)}
              className={`kaya-subnav__link${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {messages.nav.links[item.labelKey]}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
