import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingDonateButton } from './FloatingDonateButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { SitePopup } from './SitePopup'
import { LegacyPathRedirect } from '../i18n/LegacyPathRedirect'
import { PageHeroBannerProvider, usePageHeroBannerImages } from '../features/page-hero/PageHeroBannerProvider'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { splitLocalePath } from '../i18n/locale'
import '../styles/type-readable.css'

/** 메인·재정보고·사업 페이지는 기존 타이포를 유지한다. */
function keepsCompactType(pathname: string): boolean {
  const { pathnameWithoutLocale } = splitLocalePath(pathname)
  const path = pathnameWithoutLocale.replace(/\/+$/, '') || '/'
  if (path === '/') return true
  if (path === '/about/financial-report') return true
  if (path === '/business' || path.startsWith('/business/')) return true
  return false
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <PageHeroBannerProvider>
      <LayoutInner />
    </PageHeroBannerProvider>
  )
}

function LayoutInner() {
  usePageHeroBannerImages()
  useScrollReveal()
  const { pathname } = useLocation()
  const readable = !keepsCompactType(pathname)
  return (
    <div id="Wrapper" className="site">
      <ScrollToTop />
      <LegacyPathRedirect />
      <LegacyPathRedirect />
      <div id="Header_wrapper">
        <header id="Header">
          <Header />
        </header>
      </div>
      <div id="Content" className={readable ? 'type-readable' : undefined}>
        <Outlet />
      </div>
      <SitePopup />
      <FloatingDonateButton />
      <Footer />
    </div>
  )
}
