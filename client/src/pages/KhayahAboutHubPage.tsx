import { useEffect, useMemo, type ReactNode } from 'react'
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
import { kayaSectionOrder, type KayaSectionId } from '../features/kaya/kayaSectionOrder'
import { useKayaPages } from '../features/kaya/useKayaPages'
import { useImpactPage } from '../features/impact/useImpactPage'
import '../styles/khayah-about-hub.css'
import '../styles/khayah-ci.css'
import '../styles/page.css'

const SECTION_ANCHOR: Partial<Record<KayaSectionId, string>> = {
  identity: 'about',
  values: 'value',
  ci: 'ci',
}

function sliceSection(html: string, selector: string): string {
  if (typeof DOMParser === 'undefined') return ''
  return new DOMParser().parseFromString(html, 'text/html').querySelector(selector)?.outerHTML ?? ''
}

export function KhayahAboutHubPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale, localize, messages } = useLocale()
  const impact = useImpactPage()
  const kaya = useKayaPages()
  const kayaFields = kaya?.fields
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

  const introParts = useMemo(() => {
    if (locale !== 'ko') return null
    const intro = sliceSection(introHtml, '.kaya-intro')
    const identity = sliceSection(introHtml, '.kaya-identity')
    const values = sliceSection(introHtml, '.kaya-values')
    if (!intro || !identity || !values) return null
    return { intro, identity, values, ci: ciHtml }
  }, [locale, introHtml, ciHtml])
  const koIntro = locale === 'ko' && activeTab !== 'org'
  const heroHidden = koIntro && kayaFields?.['intro.heroOn'] === '0'
  const heroEyebrow = locale !== 'ko' ? undefined : activeTab === 'org' ? 'ORGANIZATION' : kayaFields?.['intro.heroLabel']?.trim() || 'ABOUT KHAYAH'
  const heroTitle =
    activeTab === 'org'
      ? messages.nav.links.org
      : koIntro
        ? kayaFields?.['intro.heroTitle']?.trim() || messages.nav.links.aboutKhayah
        : messages.nav.links.aboutKhayah
  const introBlocks = introParts
    ? kayaSectionOrder(kayaFields?.['kaya.sectionOrder']).flatMap((id) => {
        const nodes: ReactNode[] = []
        if (id === 'ci') nodes.push(<KhayahNumbers key="kaya-numbers" publicImpact={Boolean(impact?.public)} />)
        if (kayaFields?.[`${id}.on`] === '0') return nodes
        nodes.push(kayaSectionBlock(id, introParts[id], kayaFields))
        return nodes
      })
    : null

  const crumbs = useMemo(() => {
    const about = { label: messages.nav.top.khayah, to: '/about/khayah' }
    const introLabel = locale === 'ko' ? kayaFields?.['intro.heroTitle']?.trim() || messages.nav.links.aboutKhayah : messages.nav.links.aboutKhayah
    const intro = { label: introLabel, to: '/about/khayah' }
    if (activeTab === 'org') {
      return [about, { label: messages.nav.links.org, to: '/about/khayah?tab=org' }]
    }
    return [about, intro]
  }, [activeTab, locale, kayaFields, messages.nav])

  return (
    <div className="khayah-about-hub">
      {heroHidden ? null : (
        <PageHero
          title={heroTitle}
          crumbs={crumbs}
          backgroundImageUrl={pageHeroImageForPath(PATH.aboutKhayah)}
          showScrollHint={false}
          layout={locale === 'ko' ? 'kaya' : 'banner'}
          eyebrow={heroEyebrow}
        />
      )}

      <KhayahSectionNav />

      <div className={`khayah-about-hub__inner${locale === 'ko' ? ' khayah-about-hub__inner--flush' : ''}`}>
        <div className="khayah-about-hub__panel">
          {introView &&
            (locale === 'ko' ? (
              introBlocks ? (
                <>{introBlocks}</>
              ) : (
                <>
                  <KayaBoundHtml className="the_content_wrapper page-body khayah-about-hub__html" html={introHtml} />
                  <KhayahNumbers publicImpact={Boolean(impact?.public)} />
                  <KayaBoundHtml className="the_content_wrapper page-body khayah-about-hub__html khayah-about-hub__ci" html={ciHtml} />
                </>
              )
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

function kayaSectionBlock(id: KayaSectionId, html: string, fields: Record<string, string> | undefined) {
  const src = fields?.[`${id}.mode`] === 'image' ? fields[`${id}.sectionImage`]?.trim() : ''
  if (src) {
    const mobile = fields?.[`${id}.sectionImageMobile`]?.trim()
    const alt = fields?.[`${id}.sectionAlt`] ?? ''
    return (
      <section
        key={id}
        id={SECTION_ANCHOR[id]}
        className={`kaya-section-image${id === 'intro' && fields?.['intro.bg'] === 'gray' ? ' kaya-intro--gray' : ''}`}
      >
        <picture>
          {mobile ? <source media="(max-width: 720px)" srcSet={mobile} /> : null}
          <img src={src} alt={alt} />
        </picture>
      </section>
    )
  }
  return (
    <KayaBoundHtml
      key={id}
      className={`the_content_wrapper page-body khayah-about-hub__html${id === 'ci' ? ' khayah-about-hub__ci' : ''}`}
      html={html}
    />
  )
}

function KhayahNumbers({ publicImpact }: { publicImpact: boolean }) {
  return (
    <section className="kaya-numbers" aria-labelledby="kaya-numbers-title">
      <div className="kaya-numbers__wrap">
        <div className="kaya-numbers__head">
          <div>
            <p className="kaya-numbers__kicker">KHAYAH IN NUMBERS</p>
            <h2 id="kaya-numbers-title">카야가 함께 걸어온 길</h2>
            <p>한 사람의 성장을 믿으며 10년 동안 이어온 걸음을 전합니다.</p>
          </div>
          {publicImpact ? <a href="/business/impact">한눈에 보는 카야 →</a> : null}
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
  )
}
