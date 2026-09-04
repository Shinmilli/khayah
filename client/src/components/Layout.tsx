import { Outlet } from 'react-router-dom'
import { FloatingDonateButton } from './FloatingDonateButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { SitePopup } from './SitePopup'
import { LegacyPathRedirect } from '../i18n/LegacyPathRedirect'

export function Layout() {
  return (
    <div id="Wrapper" className="site">
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
