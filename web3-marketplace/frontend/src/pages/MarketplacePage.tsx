import { useState } from 'react'
import { useQuery } from 'react-query'
import { Search, Filter } from 'lucide-react'
import { api } from '../services/api'
import GemCard from '../components/GemCard'

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [rarityFilter, setRarityFilter] = useState<string>('all')

  const { data: listings, isLoading } = useQuery('marketplace-listings', async () => {
    const response = await api.get('/marketplace/listings')
    return response.data.data
  })

  const rarities = ['all', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-4xl font-bold">Gem Marketplace</h1>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search gems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="input"
          >
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity === 'all' ? 'All Rarities' : rarity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing: any) => (
            <GemCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No listings available</p>
          <p className="text-gray-500 mt-2">Be the first to list a gem!</p>
        </div>
      )}
    </div>
  )
}

export default MarketplacePage
