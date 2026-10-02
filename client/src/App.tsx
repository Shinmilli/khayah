import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { stripSitePrefix } from './i18n/locale'
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

/** 예전 공개 주소 `/khayah/...`를 같은 페이지의 짧은 주소로 보낸다. */
function LegacySitePrefixRedirect() {
  const { pathname, search, hash } = useLocation()
  const target = stripSitePrefix(pathname)
  return <Navigate to={`${target}${search}${hash}`} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminModule />} />
      <Route path="/khayah/*" element={<LegacySitePrefixRedirect />} />
      <Route path="/khayah" element={<LegacySitePrefixRedirect />} />
      <Route path="/en" element={<LocalizedSite locale="en" />}>
        {publicChildRoutes()}
      </Route>
      <Route path="/" element={<LocalizedSite locale="ko" />}>
        {publicChildRoutes()}
      </Route>
    </Routes>
  )
}

export default App
