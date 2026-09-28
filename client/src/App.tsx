import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SITE_PREFIX } from './i18n/locale'
import { Layout } from './components/Layout'
import { AdminModule } from './features/admin/AdminModule'
import { FinancialReportPage } from './pages/FinancialReportPage'
import { HomePage } from './pages/HomePage'
import { KhayahAboutHubPage } from './pages/KhayahAboutHubPage'
import { PageByPath } from './pages/PageByPath'
import { ProjectsPage } from './pages/ProjectsPage'
import { StoryArchivePage } from './pages/StoryArchivePage'
import { LocaleProvider } from './i18n/LocaleContext'

function LocalizedSite({ locale }: { locale: 'ko' | 'en' }) {
  return (
    <LocaleProvider locale={locale}>
      <Layout />
    </LocaleProvider>
  )
}

function publicChildRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="stories" element={<StoryArchivePage />} />
      <Route path="stories/:scope" element={<StoryArchivePage />} />
      <Route path="business/projects" element={<ProjectsPage />} />
      <Route path="business/projects/:region" element={<ProjectsPage />} />
      <Route path="about/financial-report" element={<FinancialReportPage />} />
      <Route path="about/khayah" element={<KhayahAboutHubPage />} />
      <Route path="*" element={<PageByPath />} />
    </>
  )
}

/** 예전 주소(`/`, `/news/...`, `/en/...`)를 `/khayah` 아래로 보낸다. */
function SitePrefixRedirect() {
  const { pathname, search, hash } = useLocation()
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const target = normalized === '/' ? SITE_PREFIX : `${SITE_PREFIX}${normalized}`
  return <Navigate to={`${target}${search}${hash}`} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminModule />} />
      <Route path="/khayah/en" element={<LocalizedSite locale="en" />}>
        {publicChildRoutes()}
      </Route>
      <Route path="/khayah" element={<LocalizedSite locale="ko" />}>
        {publicChildRoutes()}
      </Route>
      <Route path="*" element={<SitePrefixRedirect />} />
    </Routes>
  )
}

export default App
