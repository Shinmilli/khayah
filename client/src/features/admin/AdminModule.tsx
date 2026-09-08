import { Navigate, Route, Routes } from 'react-router-dom'
import '../../styles/admin.css'
import { AdminAppShell } from './AdminAppShell'
import { AdminAuthProvider } from './AdminAuthContext'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminRequireRole, AdminAppHomeRedirect } from './AdminRequireRole'
import { AdminRoot } from './AdminRoot'
import { AdminBannerPage } from './pages/AdminBannerPage'
import { AdminPostsPage } from './pages/AdminPostsPage'
import { AdminInquiriesPage } from './pages/AdminInquiriesPage'
import { AdminOperationsPage } from './pages/AdminOperationsPage'
import { AdminPopupPage } from './pages/AdminPopupPage'
import { AdminFinancialReportsPage } from './pages/AdminFinancialReportsPage'
import { AdminInquiryFaqPage } from './pages/AdminInquiryFaqPage'
import { AdminImpactStatsPage } from './pages/AdminImpactStatsPage'
import { AdminHistoryPage } from './pages/AdminHistoryPage'

export function AdminModule() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route element={<AdminRoot />}>
          <Route index element={<AdminLoginPage />} />
          <Route path="app" element={<AdminAppShell />}>
            <Route index element={<AdminAppHomeRedirect />} />
            <Route element={<AdminRequireRole roles={['super', 'content']} />}>
              <Route path="main-banner" element={<AdminBannerPage />} />
              <Route path="popup" element={<AdminPopupPage />} />
              <Route path="posts" element={<AdminPostsPage />} />
              <Route path="banner" element={<Navigate to="/admin/app/main-banner" replace />} />
              <Route path="content" element={<Navigate to="/admin/app/main-banner" replace />} />
              <Route path="financial-reports" element={<AdminFinancialReportsPage />} />
              <Route path="impact-stats" element={<AdminImpactStatsPage />} />
              <Route path="history" element={<AdminHistoryPage />} />
            </Route>
            <Route element={<AdminRequireRole roles={['super', 'inquiry']} />}>
              <Route path="inquiries" element={<AdminInquiriesPage />} />
            </Route>
            <Route element={<AdminRequireRole roles={['super', 'content', 'inquiry']} />}>
              <Route path="inquiry-faq" element={<AdminInquiryFaqPage />} />
            </Route>
            <Route element={<AdminRequireRole roles={['super']} />}>
              <Route path="operations" element={<AdminOperationsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
