import { Link } from 'react-router-dom'
import { Gem, TrendingUp, Shield, Zap } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
          Discover Rare Digital Gems
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Trade unique, blockchain-powered gems in a decentralized marketplace.
          Each gem is an NFT with unique attributes and verifiable ownership.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/marketplace" className="btn-primary px-8 py-3 text-lg">
            Explore Marketplace
          </Link>
          <Link to="/mint" className="btn-secondary px-8 py-3 text-lg">
            Mint Your Gem
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6">
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Gem className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">Unique NFTs</h3>
          <p className="text-gray-400">
            Each gem is a unique digital asset with distinct attributes and rarity levels.
          </p>
        </div>

        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">Secure Trading</h3>
          <p className="text-gray-400">
            All transactions are secured by smart contracts on the blockchain.
          </p>
        </div>

        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">Price Discovery</h3>
          <p className="text-gray-400">
            Fixed price sales and auctions help establish fair market value.
          </p>
        </div>

        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">Fast Transactions</h3>
          <p className="text-gray-400">
            Built on high-performance blockchain infrastructure for quick trades.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="card">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-400">5,000+</div>
            <div className="text-gray-400 mt-2">Gems Minted</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400">1,200+</div>
            <div className="text-gray-400 mt-2">Active Traders</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400">$50K+</div>
            <div className="text-gray-400 mt-2">Trading Volume</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Start Trading?</h2>
        <p className="text-gray-100">
          Connect your wallet and explore the world of digital gem trading.
        </p>
        <Link to="/marketplace" className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Get Started
        </Link>
      </section>
    </div>
  )
}

export default HomePage
