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
    <nav className="khayah-about-tabs khayah-about-tabs--sections" aria-label={messages.pages.aboutHub.tabsAria}>
      <div className="khayah-about-tabs__rail">
        {items.map((item) => {
          const isActive = active === item.id
          const label = messages.nav.links[item.labelKey]
          const stacked = item.id === 'org' ? splitOrgLabel(label) : null
          return (
            <Link
              key={item.id}
              to={localize(item.to)}
              className={`khayah-about-tabs__tab${isActive ? ' is-active' : ''}${stacked ? ' khayah-about-tabs__tab--stack' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {stacked ? (
                <>
                  <span>{stacked[0]}</span>
                  <span>{stacked[1]}</span>
                </>
              ) : (
                label
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/** "조직도 · 이사회 · 전문위원" → 조직도 / 이사회 · 전문위원 */
function splitOrgLabel(label: string): [string, string] | null {
  const sep = ' · '
  const i = label.indexOf(sep)
  if (i <= 0) return null
  return [label.slice(0, i), label.slice(i + sep.length)]
}
