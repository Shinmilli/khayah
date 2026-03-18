import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

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
      <Footer />
    </div>
  )
}
