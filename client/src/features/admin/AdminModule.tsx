import { Navigate, Route, Routes } from 'react-router-dom'
import '../../styles/admin.css'
import { AdminAppShell } from './AdminAppShell'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminRoot } from './AdminRoot'
import { AdminBannerPage } from './pages/AdminBannerPage'
import { AdminPostsPage } from './pages/AdminPostsPage'
import { AdminInquiriesPage } from './pages/AdminInquiriesPage'
import { AdminOperationsPage } from './pages/AdminOperationsPage'
import { AdminPopupPage } from './pages/AdminPopupPage'
import { AdminFinancialReportsPage } from './pages/AdminFinancialReportsPage'
import { AdminImpactStatsPage } from './pages/AdminImpactStatsPage'

export function AdminModule() {
  return (
    <Routes>
      <Route element={<AdminRoot />}>
        <Route index element={<AdminLoginPage />} />
        <Route path="app" element={<AdminAppShell />}>
          <Route index element={<Navigate to="main-banner" replace />} />
          <Route path="main-banner" element={<AdminBannerPage />} />
          <Route path="popup" element={<AdminPopupPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="banner" element={<Navigate to="/admin/app/main-banner" replace />} />
          <Route path="content" element={<Navigate to="/admin/app/main-banner" replace />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="operations" element={<AdminOperationsPage />} />
          <Route path="financial-reports" element={<AdminFinancialReportsPage />} />
          <Route path="impact-stats" element={<AdminImpactStatsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
