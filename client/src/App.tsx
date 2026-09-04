import { Routes, Route } from 'react-router-dom'
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

const publicChildRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="stories" element={<StoryArchivePage />} />
    <Route path="stories/:scope" element={<StoryArchivePage />} />
    <Route path="business/projects" element={<ProjectsPage />} />
    <Route path="business/projects/:region" element={<ProjectsPage />} />
    <Route path="news/financial-report" element={<FinancialReportPage />} />
    <Route path="about/khayah" element={<KhayahAboutHubPage />} />
    <Route path="*" element={<PageByPath />} />
  </>
)

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminModule />} />
      <Route path="/en" element={<LocalizedSite locale="en" />}>
        {publicChildRoutes}
      </Route>
      <Route element={<LocalizedSite locale="ko" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stories" element={<StoryArchivePage />} />
        <Route path="/stories/:scope" element={<StoryArchivePage />} />
        <Route path="/business/projects" element={<ProjectsPage />} />
        <Route path="/business/projects/:region" element={<ProjectsPage />} />
        <Route path="/news/financial-report" element={<FinancialReportPage />} />
        <Route path="/about/khayah" element={<KhayahAboutHubPage />} />
        <Route path="*" element={<PageByPath />} />
      </Route>
    </Routes>
  )
}

export default App
