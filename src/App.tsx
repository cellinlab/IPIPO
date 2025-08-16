import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ExplorePage } from '@/pages/ExplorePage'
import { CampaignDetailPage } from '@/pages/CampaignDetailPage'
import { MyVouchersPage } from '@/pages/MyVouchersPage'
import { CreatorDashboardPage } from '@/pages/CreatorDashboardPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/my-vouchers" element={<MyVouchersPage />} />
          <Route path="/dashboard" element={<CreatorDashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
