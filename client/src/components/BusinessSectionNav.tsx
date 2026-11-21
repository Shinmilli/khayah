import { Link, useLocation } from 'react-router-dom'
import { filterNavLinks, NAV_MENU_COLUMNS, type NavMenuLinkDef } from '../features/nav/navVisibilityTypes'
import { useNavVisibility } from '../features/nav/useNavVisibility'
import { useLocale } from '../i18n/LocaleContext'
import { splitLocalePath } from '../i18n/locale'
import type { NavLinkKey } from '../i18n/messages/ko'
import '../styles/khayah-about-hub.css'
import '../styles/business-domestic.css'

const INTRO_LABEL: Partial<Record<NavLinkKey, string>> = {
  domestic: '국내사업 소개',
  overseas: '해외사업 소개',
  advocacy: '연구사업 소개',
  researchSocial: '소셜비즈니스 소개',
}

const INTRO_LABEL_EN: Partial<Record<NavLinkKey, string>> = {
  domestic: 'About domestic programs',
  overseas: 'About overseas programs',
  advocacy: 'About research',
  researchSocial: 'About social business',
}

function sectionLinks(): NavMenuLinkDef[] {
  return NAV_MENU_COLUMNS.find((col) => col.topKey === 'business')?.links ?? []
}

export function BusinessSectionNav() {
  const { pathname } = useLocation()
  const { localize, locale, messages } = useLocale()
  const visibility = useNavVisibility()
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const path = pathnameWithoutLocale.replace(/\/+$/, '') || '/'
  if (!path.startsWith('/business')) return null

  const sections = filterNavLinks(sectionLinks(), visibility)
  const current =
    [...sections].reverse().find((section) => path === section.to || path.startsWith(`${section.to}/`)) ??
    sections[0]
  if (!current) return null

  const sub = filterNavLinks(
    [{ key: current.key, to: current.to }, ...(current.children ?? [])],
    visibility,
  )

  const labelFor = (key: NavLinkKey, isIntro: boolean) => {
    const intro = locale === 'en' ? INTRO_LABEL_EN[key] : INTRO_LABEL[key]
    if (isIntro && intro) return intro
    return messages.nav.links[key]
  }

  return (
      <>
        <div className="biz-nav">
          <nav className="biz-nav__row" aria-label="사업 메뉴">
            {sections.map((section) => {
              const active = section.key === current.key
              return (
                <Link
                  key={section.key}
                  to={localize(section.to)}
                  className={`biz-nav__link${active ? ' is-on' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {messages.nav.links[section.key]}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="biz-subnav">
          <nav className="biz-nav__row" aria-label="사업 하위 메뉴">
            {sub.map((item, index) => {
              const activeItem = [...sub].reverse().find((entry) => path === entry.to || path.startsWith(`${entry.to}/`))
              const active = activeItem?.to === item.to
              return (
                <Link
                  key={item.key}
                  to={localize(item.to)}
                  className={`biz-subnav__link${active ? ' is-on' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {labelFor(item.key, index === 0)}
                </Link>
              )
            })}
          </nav>
        </div>
      </>
  )
}
