import { useEffect, useRef, type ReactNode } from 'react'

type AdminViewSwitchProps = {
  active: 'site' | 'admin'
  /** 공개 사이트 헤더 위에 고정한다. */
  fixed?: boolean
  notice?: ReactNode
  /** 모바일에서만 보이는 메뉴 버튼 */
  menu?: ReactNode
}

export function AdminViewSwitch({ active, fixed = false, notice, menu }: AdminViewSwitchProps) {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!fixed) return
    const root = document.documentElement
    root.classList.add('has-admin-switch')
    const el = navRef.current
    const apply = () => {
      if (!el) return
      root.style.setProperty('--admin-switch-height', `${el.offsetHeight}px`)
    }
    apply()
    const observer = el ? new ResizeObserver(apply) : null
    if (el && observer) observer.observe(el)
    return () => {
      observer?.disconnect()
      root.classList.remove('has-admin-switch')
      root.style.removeProperty('--admin-switch-height')
    }
  }, [fixed, Boolean(notice)])

  return (
    <nav
      ref={navRef}
      className={`admin-view-switch${fixed ? ' admin-view-switch--fixed' : ''}${notice ? ' admin-view-switch--with-notice' : ''}`}
      aria-label="화면 전환"
    >
      {menu}
      <a href="/" aria-current={active === 'site' ? 'page' : undefined}>
        홈페이지
      </a>
      <a href="/admin/app" aria-current={active === 'admin' ? 'page' : undefined}>
        관리자 화면
      </a>
      {notice}
    </nav>
  )
}
