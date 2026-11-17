import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { LocaleProvider, useLocale } from './i18n/LocaleContext'
import { stripSitePrefix } from './i18n/locale'
import { Layout } from './components/Layout'
import { AdminModule } from './features/admin/AdminModule'
import { MaintenanceGate } from './features/maintenance/MaintenanceGate'
import { FinancialReportPage } from './pages/FinancialReportPage'
import { HomePage } from './pages/HomePage'
import { KhayahAboutHubPage } from './pages/KhayahAboutHubPage'
import { PageByPath } from './pages/PageByPath'
import { ImpactPage } from './pages/ImpactPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { StoryArchivePage } from './pages/StoryArchivePage'

function LegacyStoriesRedirect() {
  const { locale, localize } = useLocale()
  const params = useParams()
  const { search, hash } = useLocation()
  if (locale !== 'ko') return <StoryArchivePage />
  const scope = params.scope?.trim()
  const q = scope ? `?scope=${encodeURIComponent(scope)}` : search
  return <Navigate to={`${localize('/news/activities')}${q}${hash}`} replace />
}

function LegacyReplace({ to }: { to: string }) {
  const { localize } = useLocale()
  const { search, hash } = useLocation()
  return <Navigate to={`${localize(to)}${search}${hash}`} replace />
}

function LocalizedSite({ locale }: { locale: 'ko' | 'en' }) {
  return (
    <MaintenanceGate>
      <LocaleProvider locale={locale}>
        <Layout />
      </LocaleProvider>
    </MaintenanceGate>
  )
}

function publicChildRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="stories" element={<LegacyStoriesRedirect />} />
      <Route path="stories/:scope" element={<LegacyStoriesRedirect />} />
      <Route path="business/domestic/projects" element={<ProjectsPage fixedRegion="국내" projectList="domestic" />} />
      <Route path="business/overseas/education/projects" element={<ProjectsPage fixedRegion="해외" projectList="overseas-education" />} />
      <Route path="business/overseas/volunteer/projects" element={<ProjectsPage fixedRegion="해외" projectList="volunteer" />} />
      <Route path="business/overseas/projects" element={<ProjectsPage fixedRegion="해외" projectList="overseas" />} />
      <Route path="business/advocacy/projects" element={<ProjectsPage fixedRegion="연구사업" projectList="research" />} />
      <Route path="business/projects" element={<LegacyReplace to="/business/domestic/projects" />} />
      <Route path="business/projects/domestic" element={<LegacyReplace to="/business/domestic/projects" />} />
      <Route path="business/projects/overseas" element={<LegacyReplace to="/business/overseas/projects" />} />
      <Route path="business/projects/nepal" element={<LegacyReplace to="/business/overseas/projects" />} />
      <Route path="business/projects/myanmar" element={<LegacyReplace to="/business/overseas/projects" />} />
      <Route path="business/projects/kyrgyzstan" element={<LegacyReplace to="/business/overseas/projects" />} />
      <Route path="business/projects/research" element={<LegacyReplace to="/business/advocacy/projects" />} />
      <Route path="business/projects/:region" element={<LegacyReplace to="/business/domestic/projects" />} />
      <Route path="business/impact" element={<ImpactPage />} />
      <Route path="about/transparency" element={<FinancialReportPage />} />
      <Route path="about/financial-report" element={<LegacyReplace to="/about/transparency" />} />
      <Route path="business/overseas/health-care" element={<LegacyReplace to="/business/overseas/volunteer" />} />
      <Route path="business/advocacy/education-research" element={<LegacyReplace to="/business/advocacy" />} />
      <Route path="business/advocacy/social-business" element={<LegacyReplace to="/business/social" />} />
      <Route path="support/apply" element={<LegacyReplace to="/support/method" />} />
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
