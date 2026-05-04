import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { PAGES_STATIC } from '../constants/pagesContent'
import {
  KHAYAH_ABOUT_TABS,
  type KhayahAboutTabId,
  parseAboutTab,
} from '../features/khayah-about/khayahAboutHubTabs'
import { KHAYAH_CI_PAGE_HTML } from '../constants/khayahCiHtml'
import '../styles/khayah-about-hub.css'
import '../styles/khayah-ci.css'
import '../styles/page.css'

function tabTitle(id: KhayahAboutTabId): string {
  switch (id) {
    case 'intro':
      return '카야 소개'
    case 'ci':
      return 'CI'
    case 'programs':
      return '핵심사업'
    case 'org':
      return '조직도 · 이사회 · 전문위원'
    default:
      return '카야 소개'
  }
}

export function KhayahAboutHubPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = useMemo(
    () => parseAboutTab(location.search, location.hash),
    [location.search, location.hash],
  )

  useEffect(() => {
    document.title = `${tabTitle(activeTab)} | 사단법인 카야 인터내셔널`
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [activeTab])

  useEffect(() => {
    const h = location.hash.replace(/^#/, '').toLowerCase()
    if (h === 'ci' && !location.search.includes('tab=')) {
      navigate({ pathname: '/카야/카야소개', search: '?tab=ci', hash: '' }, { replace: true })
      return
    }
    if ((h === 'directors' || h === 'experts' || h === 'org-chart') && activeTab !== 'org') {
      navigate({ pathname: '/카야/카야소개', search: '?tab=org', hash: `#${h}` }, { replace: true })
      return
    }
    if (!h) return
    window.setTimeout(() => {
      document.getElementById(h)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [location.hash, location.search, activeTab, navigate])

  const setTab = (id: KhayahAboutTabId) => {
    if (id === 'intro') {
      navigate({ pathname: '/카야/카야소개' }, { replace: true })
    } else {
      navigate({ pathname: '/카야/카야소개', search: `?tab=${id}` }, { replace: true })
    }
  }

  const introHtml = PAGES_STATIC['카야/카야소개']?.content ?? ''
  const programsHtml = PAGES_STATIC['카야/핵심사업']?.content ?? ''
  const orgBoardMergedHtml = PAGES_STATIC['카야/조직도']?.content ?? ''

  return (
    <div className="khayah-about-hub">
      <PageHero title="카야 소개" showScrollHint={false} />

      <nav className="khayah-about-tabs" aria-label="카야 소개 하위 메뉴">
        <div className="khayah-about-tabs__rail" role="tablist">
          {KHAYAH_ABOUT_TABS.map((t) => {
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
            <div className="the_content_wrapper page-body khayah-about-hub__html" dangerouslySetInnerHTML={{ __html: KHAYAH_CI_PAGE_HTML }} />
          )}
          {activeTab === 'programs' && (
            <div
              className="the_content_wrapper page-body khayah-about-hub__html"
              dangerouslySetInnerHTML={{ __html: programsHtml }}
            />
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
