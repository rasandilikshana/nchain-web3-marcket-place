import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MarketplacePage from './pages/MarketplacePage'
import MyGemsPage from './pages/MyGemsPage'
import GemDetailPage from './pages/GemDetailPage'
import MintPage from './pages/MintPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/my-gems" element={<MyGemsPage />} />
          <Route path="/gem/:id" element={<GemDetailPage />} />
          <Route path="/mint" element={<MintPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
