import type { ReactNode } from 'react'
import { FloatingDonateButton } from './FloatingDonateButton'
import { Footer } from './Footer'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div id="Wrapper" className="site">
      <div id="Header_wrapper">
        <header id="Header">
          <Header />
        </header>
      </div>
      <div id="Content">{children}</div>
      <FloatingDonateButton />
      <Footer />
    </div>
  )
}
