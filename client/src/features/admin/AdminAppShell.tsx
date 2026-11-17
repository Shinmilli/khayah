import { useEffect, useId, useMemo, useState } from 'react'

import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AdminViewSwitch } from './AdminViewSwitch'
import { useAdminAuth } from './AdminAuthContext'
import '../../styles/admin-view-switch.css'
import { ADMIN_ROLE_LABEL } from './adminRoles'
import { MaintenanceModeNotice } from '../maintenance/MaintenanceModeNotice'
import { useMaintenanceEnabled } from '../maintenance/useMaintenanceEnabled'

type AdminNavItem = {
  to: string
  label: string
  roles: readonly string[]
}

type AdminNavCluster = {
  label: string
  items: readonly AdminNavItem[]
}

type AdminNavSection = {
  label: string
  clusters: readonly AdminNavCluster[]
}

type AdminNavGroup = {
  label: string
  items?: readonly AdminNavItem[]
  sections?: readonly AdminNavSection[]
}

const navGroups: readonly AdminNavGroup[] = [
  {
    label: '메인·공통',
    sections: [
      {
        label: '메인·사이트 공통',
        clusters: [
          {
            label: '메인',
            items: [
              { to: '/admin/app/main-banner', label: '메인 배너', roles: ['super', 'content'] },
              { to: '/admin/app/impact-stats', label: '숫자 섹션', roles: ['super', 'content'] },
              { to: '/admin/app/site-common#stories', label: '스토리·현장의 기록', roles: ['super', 'content'] },
              { to: '/admin/app/site-common#partners', label: '협력기관 로고', roles: ['super', 'content'] },
            ],
          },
          {
            label: '사이트 설정',
            items: [
              { to: '/admin/app/site-common#org', label: '기관 정보·푸터', roles: ['super', 'content'] },
              { to: '/admin/app/site-common#clicker', label: '클릭커·후원하기 버튼', roles: ['super', 'content'] },
              { to: '/admin/app/nav-visibility', label: '메뉴 표시', roles: ['super', 'content'] },
              { to: '/admin/app/page-banners', label: '페이지 배너', roles: ['super', 'content'] },
              { to: '/admin/app/nav-menu-images', label: '메뉴 이미지', roles: ['super', 'content'] },
              { to: '/admin/app/popup', label: '팝업', roles: ['super', 'content'] },
            ],
          },
        ],
      },
      {
        label: '임팩트 관리',
        clusters: [
          {
            label: '화면',
            items: [
              { to: '/admin/app/impact#impact-screen', label: '화면 설정', roles: ['super', 'content'] },
              { to: '/admin/app/impact#impact-projects', label: '사업 관리', roles: ['super', 'content'] },
              { to: '/admin/app/impact#impact-years', label: '연도별 실적', roles: ['super', 'content'] },
              { to: '/admin/app/impact#impact-evals', label: '평가 결과', roles: ['super', 'content'] },
              { to: '/admin/app/impact#impact-stories', label: '스토리 관리', roles: ['super', 'content'] },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '카야',
    items: [
      { to: '/admin/app/kaya?tab=intro', label: '카야 소개·CI', roles: ['super', 'content'] },
      { to: '/admin/app/kaya?tab=greet', label: '인사말', roles: ['super', 'content'] },
      { to: '/admin/app/history', label: '연혁', roles: ['super', 'content'] },
      { to: '/admin/app/kaya?tab=org', label: '조직도·이사회·전문위원', roles: ['super', 'content'] },
      { to: '/admin/app/kaya?tab=trans', label: '투명경영', roles: ['super', 'content'] },
      { to: '/admin/app/financial-reports', label: '재정보고', roles: ['super', 'content'] },
    ],
  },
  {
    label: '사업',
    items: [
      { to: '/admin/app/biz-support?tab=common', label: '사업 공통 설정', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=dom', label: '국내사업 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=dedu', label: '국내교육 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=ovs', label: '해외사업 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=oedu', label: '해외 교육 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=vol', label: '해외봉사단 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=intro&page=res', label: '연구사업 소개', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=sets', label: '진행사업 관리', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=domestic', label: '국내 진행사업', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=overseas', label: '해외 진행사업', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=education', label: '해외 교육 진행사업', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=volunteer', label: '해외봉사단 진행사업', roles: ['super', 'content'] },
      { to: '/admin/app/projects?tab=research', label: '연구사업 진행사업', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=social', label: '소셜비즈니스 소개', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=academy', label: '카야 아카데미', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=cnc', label: '컬러앤컴포트', roles: ['super', 'content'] },
      { to: '/admin/app/business-hub-cards', label: '국내·해외 카드', roles: ['super', 'content'] },
    ],
  },
  {
    label: '후원',
    items: [
      { to: '/admin/app/biz-support?tab=guide', label: '후원 안내', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=method', label: '후원 방법', roles: ['super', 'content'] },
      { to: '/admin/app/biz-support?tab=settings', label: '후원 공통 설정', roles: ['super', 'content'] },
    ],
  },
  {
    label: '소식',
    items: [{ to: '/admin/app/posts', label: '게시글', roles: ['super', 'content'] }],
  },
  {
    label: '운영',
    items: [
      { to: '/admin/app/inquiries', label: '고객 문의', roles: ['super', 'inquiry'] },
      { to: '/admin/app/inquiry-faq', label: 'FAQ 관리', roles: ['super', 'content', 'inquiry'] },
      { to: '/admin/app/maintenance', label: '점검 모드', roles: ['super'] },
      { to: '/admin/app/operations', label: '운영·권한', roles: ['super'] },
    ],
  },
]

function groupItems(group: AdminNavGroup): AdminNavItem[] {
  if (group.items) return [...group.items]
  return (group.sections ?? []).flatMap((section) => section.clusters.flatMap((cluster) => cluster.items))
}

function isNavItemActive(pathname: string, search: string, hash: string, to: string): boolean {
  const url = new URL(to, 'http://khayah.local')
  if (pathname !== url.pathname) return false
  if (url.hash && hash !== url.hash) return false
  const current = new URLSearchParams(search)
  for (const [key, value] of url.searchParams) {
    let have = current.get(key)
    if (!have && key === 'tab') {
      have = url.pathname.endsWith('/kaya')
        ? 'intro'
        : url.pathname.endsWith('/biz-support')
          ? 'common'
          : url.pathname.endsWith('/projects')
            ? 'sets'
            : ''
    }
    if (have !== value) return false
  }
  return true
}

export function AdminAppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { me, loading, logout } = useAdminAuth()
  const maintenanceOn = useMaintenanceEnabled()
  const navId = useId()
  const visibleGroups = useMemo(() => {
    if (!me) return []
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items?.filter((item) => item.roles.includes(me.role)),
        sections: group.sections
          ?.map((section) => ({
            ...section,
            clusters: section.clusters
              .map((cluster) => ({
                ...cluster,
                items: cluster.items.filter((item) => item.roles.includes(me.role)),
              }))
              .filter((cluster) => cluster.items.length > 0),
          }))
          .filter((section) => section.clusters.length > 0),
      }))
      .filter((group) => (group.items?.length ?? 0) > 0 || (group.sections?.length ?? 0) > 0)
  }, [me])
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((group) => [group.label, true])),
  )
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({})
  const [clusterOpen, setClusterOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const active = (to: string) => isNavItemActive(location.pathname, location.search, location.hash, to)
    setGroupOpen((prev) => {
      const next = { ...prev }
      for (const group of navGroups) {
        if (groupItems(group).some((item) => active(item.to))) next[group.label] = true
      }
      return next
    })
    setSectionOpen((prev) => {
      const next = { ...prev }
      for (const group of navGroups) {
        for (const section of group.sections ?? []) {
          if (section.clusters.some((cluster) => cluster.items.some((item) => active(item.to)))) {
            next[`${group.label}/${section.label}`] = true
          }
        }
      }
      return next
    })
    setClusterOpen((prev) => {
      const next = { ...prev }
      for (const group of navGroups) {
        for (const section of group.sections ?? []) {
          for (const cluster of section.clusters) {
            if (cluster.items.some((item) => active(item.to))) {
              next[`${group.label}/${section.label}/${cluster.label}`] = true
            }
          }
        }
      }
      return next
    })
  }, [location.pathname, location.search, location.hash])

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
    <div className="admin-shell">
      <AdminViewSwitch active="admin" notice={maintenanceOn ? <MaintenanceModeNotice /> : null} />
      <div className="admin-app">
      <aside className="admin-app__sidebar" aria-label="관리자 메뉴">
        <div className="admin-app__brand">
          <span className="admin-app__brand-name">KHAYAH 관리자</span>
          <span className="admin-app__badge">{ADMIN_ROLE_LABEL[me.role]}</span>
        </div>
        <p className="admin-app__user">{me.email}</p>
        <nav className="admin-app__nav">
          {visibleGroups.map((group) => {
            const open = groupOpen[group.label] !== false
            const links = groupItems(group)
            const groupActive = links.some((item) => isNavItemActive(location.pathname, location.search, location.hash, item.to))
            const groupId = `${navId}-${group.label}`
            return (
              <div key={group.label} className="admin-app__nav-group">
                <button
                  type="button"
                  className={`admin-app__nav-toggle${groupActive ? ' admin-app__nav-toggle--child-active' : ''}`}
                  onClick={() => setGroupOpen((prev) => ({ ...prev, [group.label]: !open }))}
                  aria-expanded={open}
                  aria-controls={groupId}
                >
                  <span className="admin-app__nav-chevron" aria-hidden>
                    {open ? '▾' : '▸'}
                  </span>
                  <span className="admin-app__nav-toggle-label">{group.label}</span>
                </button>
                {open ? (
                  <div id={groupId} className="admin-app__nav-sub">
                    {group.sections?.map((section) => {
                      const sectionKey = `${group.label}/${section.label}`
                      const sectionActive = section.clusters.some((cluster) =>
                        cluster.items.some((item) => isNavItemActive(location.pathname, location.search, location.hash, item.to)),
                      )
                      const sectionShown = sectionOpen[sectionKey] ?? sectionActive
                      const nested = section.clusters.length > 1
                      return (
                        <div key={section.label} className="admin-app__nav-section">
                          <button
                            type="button"
                            className={`admin-app__nav-section-toggle${sectionActive ? ' admin-app__nav-section-toggle--child-active' : ''}`}
                            aria-expanded={sectionShown}
                            onClick={() => setSectionOpen((prev) => ({ ...prev, [sectionKey]: !sectionShown }))}
                          >
                            <span>{section.label}</span>
                            <span className="admin-app__nav-chevron" aria-hidden>
                              {sectionShown ? '▾' : '▸'}
                            </span>
                          </button>
                          {sectionShown
                            ? nested
                              ? section.clusters.map((cluster) => {
                                  const key = `${sectionKey}/${cluster.label}`
                                  const clusterActive = cluster.items.some((item) =>
                                    isNavItemActive(location.pathname, location.search, location.hash, item.to),
                                  )
                                  const clusterShown = clusterOpen[key] ?? clusterActive
                                  return (
                                    <div key={cluster.label} className="admin-app__nav-cluster">
                                      <button
                                        type="button"
                                        className={`admin-app__nav-subtoggle${clusterActive ? ' admin-app__nav-subtoggle--active' : ''}`}
                                        aria-expanded={clusterShown}
                                        onClick={() => setClusterOpen((prev) => ({ ...prev, [key]: !clusterShown }))}
                                      >
                                        <span className="admin-app__nav-subtoggle-label">{cluster.label}</span>
                                        <span className="admin-app__nav-chevron" aria-hidden>
                                          {clusterShown ? '▾' : '▸'}
                                        </span>
                                      </button>
                                      {clusterShown
                                        ? cluster.items.map(({ to, label }) => (
                                            <Link
                                              key={to}
                                              to={to}
                                              aria-current={
                                                isNavItemActive(location.pathname, location.search, location.hash, to) ? 'page' : undefined
                                              }
                                              className={`admin-app__nav-link admin-app__nav-link--sub admin-app__nav-link--deep${
                                                isNavItemActive(location.pathname, location.search, location.hash, to)
                                                  ? ' admin-app__nav-link--active'
                                                  : ''
                                              }`}
                                            >
                                              {label}
                                            </Link>
                                          ))
                                        : null}
                                    </div>
                                  )
                                })
                              : section.clusters[0]?.items.map(({ to, label }) => (
                                  <Link
                                    key={to}
                                    to={to}
                                    aria-current={isNavItemActive(location.pathname, location.search, location.hash, to) ? 'page' : undefined}
                                    className={`admin-app__nav-link admin-app__nav-link--sub admin-app__nav-link--deep${
                                      isNavItemActive(location.pathname, location.search, location.hash, to) ? ' admin-app__nav-link--active' : ''
                                    }`}
                                  >
                                    {label}
                                  </Link>
                                ))
                            : null}
                        </div>
                      )
                    })}
                    {group.items?.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        aria-current={isNavItemActive(location.pathname, location.search, location.hash, to) ? 'page' : undefined}
                        className={`admin-app__nav-link admin-app__nav-link--sub${
                          isNavItemActive(location.pathname, location.search, location.hash, to) ? ' admin-app__nav-link--active' : ''
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
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
        <main className="admin-app__content">
          <Outlet />
        </main>
      </div>
    </div>
    </div>
  )
}
