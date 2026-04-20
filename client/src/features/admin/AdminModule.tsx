import { Navigate, Route, Routes } from 'react-router-dom'
import '../../styles/admin.css'
import { AdminAppShell } from './AdminAppShell'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminRoot } from './AdminRoot'
import { AdminContentPage } from './pages/AdminContentPage'
import { AdminInquiriesPage } from './pages/AdminInquiriesPage'
import { AdminOperationsPage } from './pages/AdminOperationsPage'

export function AdminModule() {
  return (
    <Routes>
      <Route element={<AdminRoot />}>
        <Route index element={<AdminLoginPage />} />
        <Route path="app" element={<AdminAppShell />}>
          <Route index element={<Navigate to="content" replace />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="operations" element={<AdminOperationsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
