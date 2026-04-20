import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminModule } from './features/admin/AdminModule'
import { HomePage } from './pages/HomePage'
import { PageByPath } from './pages/PageByPath'

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminModule />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageByPath />} />
      </Route>
    </Routes>
  )
}

export default App
