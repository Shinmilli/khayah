import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { homePathForRole, type AdminRole } from './adminRoles'

export function AdminRequireRole({ roles }: { roles: readonly AdminRole[] }) {
  const { me, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return <p className="admin-panel__foot">권한을 확인하는 중…</p>
  }
  if (!me) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />
  }
  if (!roles.includes(me.role)) {
    return <Navigate to={homePathForRole(me.role)} replace />
  }
  return <Outlet />
}

export function AdminAppHomeRedirect() {
  const { me, loading } = useAdminAuth()
  if (loading) return <p className="admin-panel__foot">확인 중…</p>
  if (!me) return <Navigate to="/admin" replace />
  return <Navigate to={me.role === 'inquiry' ? 'inquiries' : 'main-banner'} replace />
}
