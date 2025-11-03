import { Link } from 'react-router-dom'
import { Gem, Home, ShoppingBag, Wallet, Sparkles } from 'lucide-react'
import { useWalletStore } from '../stores/walletStore'

const Navbar = () => {
  const { address, connectWallet } = useWalletStore()

  return (
    <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-400">
              <Gem className="w-8 h-8" />
              <span>Gem Marketplace</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/marketplace" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span>Marketplace</span>
              </Link>
              <Link to="/my-gems" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <Wallet className="w-4 h-4" />
                <span>My Gems</span>
              </Link>
              <Link to="/mint" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>Mint</span>
              </Link>
            </div>
          </div>

          <div>
            {address ? (
              <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
