import { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'
import { api } from '../services/api'

const MintPage = () => {
  const navigate = useNavigate()
  const { address } = useWalletStore()
  const [gemName, setGemName] = useState('')
  const [useRandomAttributes, setUseRandomAttributes] = useState(true)

  const mintMutation = useMutation(
    async () => {
      if (!address) throw new Error('Wallet not connected')

      const response = await api.post('/gems/mint', {
        name: gemName,
        owner: address,
      })

      return response.data
    },
    {
      onSuccess: (data) => {
        toast.success('Gem minted successfully!')
        navigate(`/gem/${data.data.gemId}`)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Failed to mint gem')
      },
    }
  )

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    if (!gemName.trim()) {
      toast.error('Please enter a gem name')
      return
    }

    mintMutation.mutate()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold">Mint a New Gem</h1>
        <p className="text-gray-400">
          Create a unique digital gem with randomly generated attributes
        </p>
      </div>

      <form onSubmit={handleMint} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Gem Name</label>
          <input
            type="text"
            value={gemName}
            onChange={(e) => setGemName(e.target.value)}
            placeholder="Enter a name for your gem"
            className="input w-full"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="randomAttributes"
            checked={useRandomAttributes}
            onChange={(e) => setUseRandomAttributes(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="randomAttributes" className="text-sm text-gray-400">
            Use randomly generated attributes (recommended)
          </label>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
          <h3 className="font-semibold text-primary-400">What you'll get:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Unique gem with random color and rarity</li>
            <li>Power, shine, and durability attributes</li>
            <li>Verifiable ownership on the blockchain</li>
            <li>Ability to trade on the marketplace</li>
          </ul>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-sm text-yellow-400">
          <strong>Note:</strong> Minting cost: Free (testnet). Gas fees apply for transactions.
        </div>

        <button
          type="submit"
          disabled={mintMutation.isLoading || !address}
          className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mintMutation.isLoading ? 'Minting...' : 'Mint Gem'}
        </button>

        {!address && (
          <p className="text-center text-gray-400 text-sm">
            Please connect your wallet to mint a gem
          </p>
        )}
      </form>
    </div>
  )
}

export default MintPage
