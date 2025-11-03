import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useWalletStore } from '../stores/walletStore'
import { api } from '../services/api'
import { Gem } from 'lucide-react'

const MyGemsPage = () => {
  const { address } = useWalletStore()

  const { data: gems, isLoading } = useQuery(
    ['my-gems', address],
    async () => {
      if (!address) return []
      const response = await api.get(`/gems/owner/${address}`)
      return response.data.data
    },
    { enabled: !!address }
  )

  if (!address) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400 text-lg">Please connect your wallet to view your gems</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Gem Collection</h1>
        <Link to="/mint" className="btn-primary">
          Mint New Gem
        </Link>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : gems && gems.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gems.map((gem: any) => (
            <div key={gem.id} className="card hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 h-48 rounded-lg mb-4 flex items-center justify-center">
                <Gem className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{gem.name}</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Rarity: <span className="text-secondary-400">{gem.attributes.rarity}</span></p>
                <p>Power: {gem.attributes.power}</p>
                <p>Transfers: {gem.transfer_count}</p>
              </div>
              <Link
                to={`/gem/${gem.id}`}
                className="btn-primary w-full mt-4 text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">You don't own any gems yet</p>
          <Link to="/mint" className="btn-primary mt-4 inline-block">
            Mint Your First Gem
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyGemsPage
