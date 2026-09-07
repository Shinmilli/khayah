import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingDonateButton } from './FloatingDonateButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { SitePopup } from './SitePopup'
import { LegacyPathRedirect } from '../i18n/LegacyPathRedirect'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export function Layout() {
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
      <div id="Content">
        <Outlet />
      </div>
      <SitePopup />
      <FloatingDonateButton />
      <Footer />
    </div>
  )
}
