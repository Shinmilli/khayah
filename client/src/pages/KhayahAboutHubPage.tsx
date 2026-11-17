import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { KhayahSectionNav } from '../components/KhayahSectionNav'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { getStaticPage } from '../constants/pagesContent'
import { useLocale } from '../i18n/LocaleContext'
import {
  parseAboutTab,
} from '../features/khayah-about/khayahAboutHubTabs'
import { KHAYAH_CI_PAGE_HTML } from '../constants/khayahCiHtml'
import { KHAYAH_CI_PAGE_HTML as KHAYAH_CI_PAGE_HTML_EN } from '../constants/khayahCiHtml.en'
import { KayaBoundHtml } from '../features/kaya/KayaBoundHtml'
import { useImpactPage } from '../features/impact/useImpactPage'
import '../styles/khayah-about-hub.css'
import '../styles/khayah-ci.css'
import '../styles/page.css'

export function KhayahAboutHubPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale, localize, messages } = useLocale()
  const impact = useImpactPage()
  const hub = messages.pages.aboutHub
  const aboutPath = localize('/about/khayah')

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
    if (activeTab !== 'ci') return
    const timer = window.setTimeout(() => {
      document.getElementById('ci')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    const h = location.hash.replace(/^#/, '').toLowerCase()
    if (new URLSearchParams(location.search).get('tab') === 'ci') {
      navigate({ pathname: aboutPath, hash: h === 'ci' ? '#ci' : '' }, { replace: true })
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

  const introHtml = getStaticPage('about/khayah', locale)?.content ?? ''
  const orgBoardMergedHtml = getStaticPage('about/org-chart', locale)?.content ?? ''
  const ciHtml = locale === 'en' ? KHAYAH_CI_PAGE_HTML_EN : KHAYAH_CI_PAGE_HTML
  const introView = activeTab === 'intro' || activeTab === 'ci'

  const crumbs = useMemo(() => {
    const about = { label: messages.nav.top.khayah, to: '/about/khayah' }
    const intro = { label: messages.nav.links.aboutKhayah, to: '/about/khayah' }
    if (activeTab === 'org') {
      return [about, { label: messages.nav.links.org, to: '/about/khayah?tab=org' }]
    }
    return [about, intro]
  }, [activeTab, messages.nav])

  return (
    <div className="khayah-about-hub">
      <PageHero
        title={activeTab === 'org' ? messages.nav.links.org : messages.nav.links.aboutKhayah}
        crumbs={crumbs}
        backgroundImageUrl={pageHeroImageForPath(PATH.aboutKhayah)}
        showScrollHint={false}
        layout={locale === 'ko' ? 'kaya' : 'banner'}
        eyebrow={locale === 'ko' ? (activeTab === 'org' ? 'ORGANIZATION' : 'ABOUT KHAYAH') : undefined}
      />

      <KhayahSectionNav />

      <div className={`khayah-about-hub__inner${locale === 'ko' ? ' khayah-about-hub__inner--flush' : ''}`}>
        <div className="khayah-about-hub__panel">
          {introView &&
            (locale === 'ko' ? (
              <>
                <KayaBoundHtml className="the_content_wrapper page-body khayah-about-hub__html" html={introHtml} />
                <section className="kaya-numbers" aria-labelledby="kaya-numbers-title">
                  <div className="kaya-numbers__wrap">
                    <div className="kaya-numbers__head">
                      <div>
                        <p className="kaya-numbers__kicker">KHAYAH IN NUMBERS</p>
                        <h2 id="kaya-numbers-title">카야가 함께 걸어온 길</h2>
                        <p>한 사람의 성장을 믿으며 10년 동안 이어온 걸음을 전합니다.</p>
                      </div>
                      {impact?.public ? <a href="/business/impact">한눈에 보는 카야 →</a> : null}
                    </div>
                    <div className="kaya-numbers__grid">
                      <article>
                        <p>함께 걸어온 시간</p>
                        <p><b>10<span>년</span></b></p>
                        <p>2016년 5월 설립</p>
                      </article>
                      <article>
                        <p>함께한 사람들</p>
                        <p><b>[0,000]<span>명</span></b></p>
                        <p>국내외 사업에 직접 참여한 사람들</p>
                      </article>
                      <article>
                        <p>함께한 나라</p>
                        <p><b>[0]<span>개국</span></b></p>
                        <p>한국 본부 · 미얀마 · 키르기스스탄 지부</p>
                      </article>
                      <article>
                        <p>함께한 협력기관</p>
                        <p><b>[00]<span>곳</span></b></p>
                        <p>정부 · 학교 · 현지 NGO · 기업</p>
                      </article>
                    </div>
                    <p className="kaya-numbers__note">2026년 ○월 기준 · 설립 이후 누적</p>
                  </div>
                </section>
                <KayaBoundHtml className="the_content_wrapper page-body khayah-about-hub__html khayah-about-hub__ci" html={ciHtml} />
              </>
            ) : (
              <>
                <div
                  className="the_content_wrapper page-body khayah-about-hub__html"
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
                <div
                  className="the_content_wrapper page-body khayah-about-hub__html khayah-about-hub__ci"
                  dangerouslySetInnerHTML={{ __html: ciHtml }}
                />
              </>
            ))}
          {activeTab === 'org' &&
            (locale === 'ko' ? (
              <KayaBoundHtml className="the_content_wrapper page-body khayah-about-hub__html" html={orgBoardMergedHtml} />
            ) : (
              <div
                className="the_content_wrapper page-body khayah-about-hub__html"
                dangerouslySetInnerHTML={{ __html: orgBoardMergedHtml }}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
