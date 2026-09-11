import { useEffect, useId, useMemo, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { ADMIN_ROLE_LABEL } from './adminRoles'

function isContentAdminPath(pathname: string): boolean {
  return (
    pathname.startsWith('/admin/app/main-banner') ||
    pathname.startsWith('/admin/app/popup') ||
    pathname.startsWith('/admin/app/posts') ||
    pathname.startsWith('/admin/app/financial-reports') ||
    pathname.startsWith('/admin/app/impact-stats') ||
    pathname.startsWith('/admin/app/history') ||
    pathname.startsWith('/admin/app/nav-menu-images') ||
    pathname.startsWith('/admin/app/page-banners') ||
    pathname.startsWith('/admin/app/banner')
  )
}

const contentGroups = [
  {
    label: '화면',
    items: [
      { to: '/admin/app/main-banner', label: '메인 배너' },
      { to: '/admin/app/popup', label: '팝업' },
      { to: '/admin/app/page-banners', label: '페이지 배너' },
      { to: '/admin/app/nav-menu-images', label: '메뉴 이미지' },
    ],
  },
  {
    label: '자료',
    items: [
      { to: '/admin/app/posts', label: '게시글' },
      { to: '/admin/app/history', label: '연혁' },
      { to: '/admin/app/financial-reports', label: '재정보고' },
      { to: '/admin/app/impact-stats', label: '나눔의 결실' },
    ],
  },
] as const

const contentChildren = contentGroups.flatMap((group) => group.items)

const otherNav = [
  { to: '/admin/app/inquiries', label: '고객 문의', roles: ['super', 'inquiry'] },
  { to: '/admin/app/inquiry-faq', label: 'FAQ 관리', roles: ['super', 'content', 'inquiry'] },
  { to: '/admin/app/operations', label: '운영·권한', roles: ['super'] },
] as const

export function AdminAppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { me, loading, logout } = useAdminAuth()
  const contentSubId = useId()
  const [contentOpen, setContentOpen] = useState(() => isContentAdminPath(location.pathname))

  useEffect(() => {
    if (isContentAdminPath(location.pathname)) setContentOpen(true)
  }, [location.pathname])

  const visibleContent = useMemo(() => {
    if (!me || me.role === 'inquiry') return []
    return contentChildren
  }, [me])

  const visibleOther = useMemo(() => {
    if (!me) return []
    return otherNav.filter((item) => (item.roles as readonly string[]).includes(me.role))
  }, [me])

  const contentChildActive = visibleContent.some(
    (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
  )

  if (loading) {
    return (
      <div className="admin-app admin-app--boot">
        <p className="admin-panel__foot">관리자 세션을 확인하는 중…</p>
      </div>
    )
  }

  if (!me) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="admin-app">
      <aside className="admin-app__sidebar" aria-label="관리자 메뉴">
        <div className="admin-app__brand">
          <span className="admin-app__brand-name">Khayah Admin</span>
          <span className="admin-app__badge">{ADMIN_ROLE_LABEL[me.role]}</span>
        </div>
        <p className="admin-app__user">{me.email}</p>
        <nav className="admin-app__nav">
          {visibleContent.length > 0 ? (
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
                  {contentGroups.map((group) => (
                    <div key={group.label} className="admin-app__nav-cluster">
                      <p className="admin-app__nav-subhead">{group.label}</p>
                      {group.items.map(({ to, label }) => (
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
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {visibleOther.map(({ to, label }) => (
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
              void logout().finally(() => {
                navigate('/admin', { replace: true })
              })
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>
      <div className="admin-app__main">
        <header className="admin-app__topbar">
          <p className="admin-app__topbar-meta">
            {me.name ? `${me.name} · ` : ''}
            {ADMIN_ROLE_LABEL[me.role]}
          </p>
        </header>
        <main className="admin-app__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
