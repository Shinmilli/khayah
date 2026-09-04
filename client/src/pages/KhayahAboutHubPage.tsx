import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { getStaticPage } from '../constants/pagesContent'
import { useLocale } from '../i18n/LocaleContext'
import {
  KHAYAH_ABOUT_TAB_IDS,
  type KhayahAboutTabId,
  parseAboutTab,
} from '../features/khayah-about/khayahAboutHubTabs'
import { KHAYAH_CI_PAGE_HTML } from '../constants/khayahCiHtml'
import { KHAYAH_CI_PAGE_HTML as KHAYAH_CI_PAGE_HTML_EN } from '../constants/khayahCiHtml.en'
import '../styles/khayah-about-hub.css'
import '../styles/khayah-ci.css'
import '../styles/page.css'

export function KhayahAboutHubPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale, localize, messages } = useLocale()
  const hub = messages.pages.aboutHub
  const aboutPath = localize('/about/khayah')
  const aboutTabs = KHAYAH_ABOUT_TAB_IDS.map((id) => ({ id, label: hub.tabs[id] }))

  const activeTab = useMemo(
    () => parseAboutTab(location.search, location.hash),
    [location.search, location.hash],
  )

  useEffect(() => {
    document.title = messages.pages.documentTitle(hub.tabs[activeTab])
    return () => {
      document.title = messages.pages.defaultTitle
    }
  }, [activeTab, hub.tabs, messages.pages])

  useEffect(() => {
    const h = location.hash.replace(/^#/, '').toLowerCase()
    if (h === 'ci' && !location.search.includes('tab=')) {
      navigate({ pathname: aboutPath, search: '?tab=ci', hash: '' }, { replace: true })
      return
    }
    if (new URLSearchParams(location.search).get('tab') === 'programs') {
      navigate({ pathname: aboutPath }, { replace: true })
      return
    }
    if ((h === 'directors' || h === 'experts' || h === 'org-chart') && activeTab !== 'org') {
      navigate({ pathname: aboutPath, search: '?tab=org', hash: `#${h}` }, { replace: true })
      return
    }
    if (!h) return
    window.setTimeout(() => {
      document.getElementById(h)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [location.hash, location.search, activeTab, navigate, aboutPath])

  const setTab = (id: KhayahAboutTabId) => {
    if (id === 'intro') {
      navigate({ pathname: aboutPath }, { replace: true })
    } else {
      navigate({ pathname: aboutPath, search: `?tab=${id}` }, { replace: true })
    }
  }

  const introHtml = getStaticPage('about/khayah', locale)?.content ?? ''
  const orgBoardMergedHtml = getStaticPage('about/org-chart', locale)?.content ?? ''
  const ciHtml = locale === 'en' ? KHAYAH_CI_PAGE_HTML_EN : KHAYAH_CI_PAGE_HTML

  return (
    <div className="khayah-about-hub">
      <PageHero title={hub.title} showScrollHint={false} />

      <nav className="khayah-about-tabs" aria-label={hub.tabsAria}>
        <div className="khayah-about-tabs__rail" role="tablist">
          {aboutTabs.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                id={`khayah-tab-${t.id}`}
                tabIndex={0}
                className={`khayah-about-tabs__tab${active ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="khayah-about-hub__inner">
        <div
          className="khayah-about-hub__panel"
          role="tabpanel"
          aria-labelledby={`khayah-tab-${activeTab}`}
        >
          {activeTab === 'intro' && (
            <div
              className="the_content_wrapper page-body khayah-about-hub__html"
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          )}
          {activeTab === 'ci' && (
            <div className="the_content_wrapper page-body khayah-about-hub__html" dangerouslySetInnerHTML={{ __html: ciHtml }} />
          )}
          {activeTab === 'org' && (
            <div
              className="the_content_wrapper page-body khayah-about-hub__html"
              dangerouslySetInnerHTML={{ __html: orgBoardMergedHtml }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
