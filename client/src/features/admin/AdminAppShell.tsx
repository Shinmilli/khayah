import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { isAdminMockLoggedIn, setAdminMockLoggedIn } from './session'

const nav = [
  { to: '/admin/app/content', label: '콘텐츠 관리' },
  { to: '/admin/app/inquiries', label: '1:1 문의' },
  { to: '/admin/app/operations', label: '운영·권한' },
] as const

export function AdminAppShell() {
  const navigate = useNavigate()

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
          {nav.map(({ to, label }) => (
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
