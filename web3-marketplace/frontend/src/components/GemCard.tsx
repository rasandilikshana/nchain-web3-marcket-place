import { Gem } from 'lucide-react'

interface GemCardProps {
  listing: any
}

const GemCard = ({ listing }: GemCardProps) => {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      Common: 'text-gray-400',
      Uncommon: 'text-green-400',
      Rare: 'text-blue-400',
      Epic: 'text-purple-400',
      Legendary: 'text-orange-400',
      Mythic: 'text-pink-400',
    }
    return colors[rarity] || 'text-gray-400'
  }

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 h-48 rounded-lg mb-4 flex items-center justify-center">
        <Gem className="w-24 h-24 text-white" />
      </div>

      <h3 className="text-xl font-semibold mb-2">Gem #{listing.gem_id}</h3>

      <div className="space-y-1 text-sm mb-4">
        <p className="text-gray-400">
          Price: <span className="text-white font-semibold">{listing.price} tokens</span>
        </p>
        <p className="text-gray-400">
          Type: <span className="text-white">{listing.listing_type}</span>
        </p>
      </div>

      <button className="btn-primary w-full">
        View Details
      </button>
    </div>
  )
}

export default GemCard
