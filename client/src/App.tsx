import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminModule } from './features/admin/AdminModule'
import { FinancialReportPage } from './pages/FinancialReportPage'
import { HomePage } from './pages/HomePage'
import { KhayahAboutHubPage } from './pages/KhayahAboutHubPage'
import { PageByPath } from './pages/PageByPath'
import { ProjectsPage } from './pages/ProjectsPage'
import { StoryArchivePage } from './pages/StoryArchivePage'

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminModule />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stories" element={<StoryArchivePage />} />
        <Route path="/stories/:scope" element={<StoryArchivePage />} />
        <Route path="/사업/진행사업" element={<ProjectsPage />} />
        <Route path="/사업/진행사업/:region" element={<ProjectsPage />} />
        <Route path="/소식/재정보고" element={<FinancialReportPage />} />
        <Route path="/카야/카야소개" element={<KhayahAboutHubPage />} />
        <Route path="*" element={<PageByPath />} />
      </Route>
    </Routes>
  )
}

export default App
