import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Web3Provider } from '@/components/Providers/Web3Provider'
import { ExplorePage } from '@/pages/ExplorePage'
import { CampaignDetailPage } from '@/pages/CampaignDetailPage'
import { MyVouchersPage } from '@/pages/MyVouchersPage'
import { CreatorDashboardPage } from '@/pages/CreatorDashboardPage'
import { TransparencyPage } from '@/pages/TransparencyPage'
import { AboutPage } from '@/pages/AboutPage'

function App() {
  return (
    <Web3Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/my-vouchers" element={<MyVouchersPage />} />
            <Route path="/dashboard" element={<CreatorDashboardPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </Web3Provider>
  )
}

export default App
