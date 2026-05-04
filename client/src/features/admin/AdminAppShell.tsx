import { useEffect, useId, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isAdminMockLoggedIn, setAdminMockLoggedIn } from './session'

function isContentAdminPath(pathname: string): boolean {
  return (
    pathname.startsWith('/admin/app/main-banner') ||
    pathname.startsWith('/admin/app/popup') ||
    pathname.startsWith('/admin/app/posts') ||
    pathname.startsWith('/admin/app/financial-reports') ||
    pathname.startsWith('/admin/app/banner')
  )
}

const contentChildren = [
  { to: '/admin/app/main-banner', label: '메인 배너 관리' },
  { to: '/admin/app/popup', label: '팝업 관리' },
  { to: '/admin/app/posts', label: '게시글 관리' },
  { to: '/admin/app/financial-reports', label: '재정보고' },
] as const

const otherNav = [
  { to: '/admin/app/inquiries', label: '1:1 문의' },
  { to: '/admin/app/operations', label: '운영·권한' },
] as const

export function AdminAppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const contentSubId = useId()
  const [contentOpen, setContentOpen] = useState(() => isContentAdminPath(location.pathname))

  useEffect(() => {
    if (isContentAdminPath(location.pathname)) setContentOpen(true)
  }, [location.pathname])

  const contentChildActive = contentChildren.some(
    (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
  )

  if (!isAdminMockLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="admin-app">
      <aside className="admin-app__sidebar" aria-label="관리자 메뉴">
        <div className="admin-app__brand">
          <span className="admin-app__brand-name">Khayah Admin</span>
          <span className="admin-app__badge">UI 목업</span>
        </div>
        <nav className="admin-app__nav">
          <div className="admin-app__nav-group">
            <button
              type="button"
              className={`admin-app__nav-toggle${contentChildActive ? ' admin-app__nav-toggle--child-active' : ''}`}
              onClick={() => setContentOpen((o) => !o)}
              aria-expanded={contentOpen}
              aria-controls={contentSubId}
            >
              <span className="admin-app__nav-toggle-label">콘텐츠 관리</span>
              <span className="admin-app__nav-chevron" aria-hidden>
                {contentOpen ? '▾' : '▸'}
              </span>
            </button>
            {contentOpen ? (
              <div id={contentSubId} className="admin-app__nav-sub">
                {contentChildren.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `admin-app__nav-link admin-app__nav-link--sub${isActive ? ' admin-app__nav-link--active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>

          {otherNav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-app__nav-link${isActive ? ' admin-app__nav-link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-app__sidebar-foot">
          <button
            type="button"
            className="admin-app__logout"
            onClick={() => {
              setAdminMockLoggedIn(false)
              navigate('/admin', { replace: true })
            }}
          >
            로그아웃(목업)
          </button>
        </div>
      </aside>
      <div className="admin-app__main">
        <header className="admin-app__topbar">
          <p className="admin-app__topbar-meta">
            Google Workspace 계정과 역할 매핑은 운영 정책 확정 후 연동 예정입니다.
          </p>
        </header>
        <main className="admin-app__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
