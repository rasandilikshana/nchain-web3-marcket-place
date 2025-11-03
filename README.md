# Web3 + Blockchain Marketplace

A complete decentralized marketplace built from scratch with a custom blockchain and smart contract platform.

## 🎯 Project Overview

This is a full-stack Web3 marketplace featuring:

1. **Custom Blockchain** (`nchain/`) - Production-ready blockchain in Rust
2. **Gem NFT Marketplace** (`web3-marketplace/`) - Complete dApp for trading unique digital gems

## ⚡ TL;DR - Super Quick Start

```bash
# 1. Run automated setup
./setup-all.sh

# 2. Terminal 1: Start blockchain
cd nchain && cargo run --release -- node --api-port 8080 --p2p-port 9000

# 3. Terminal 2: Start backend
cd web3-marketplace/backend && npm run dev

# 4. Terminal 3: Start frontend
cd web3-marketplace/frontend && npm run dev

# 5. Open browser: http://localhost:5173
```

**That's it!** 🎉 The marketplace is now running. Jump to [First Steps](#-first-steps-in-the-marketplace) to start trading gems.

---

## ✨ Features

### Blockchain (nchain)
- ✅ Proof-of-Work consensus with configurable difficulty
- ✅ Ed25519 digital signatures for transaction security
- ✅ WebAssembly smart contract execution
- ✅ P2P networking (libp2p)
- ✅ REST API server with web dashboard
- ✅ SQLite persistence
- ✅ Proof-of-History (Solana-inspired)

### Marketplace (web3-marketplace)
- ✅ Gem NFT smart contracts (mint, transfer, ownership)
- ✅ Marketplace smart contracts (listings, auctions, escrow)
- ✅ Backend API service (Node.js/TypeScript)
- ✅ Frontend web app (React + Tailwind CSS)
- ✅ Wallet integration
- ✅ Real-time marketplace updates

## 🚀 Quick Start Guide

Get the marketplace running in 4 terminals in under 10 minutes!

### Prerequisites

Before starting, ensure you have:
- **Rust 1.90+** → Install from [rustup.rs](https://rustup.rs/)
- **Node.js 18+** → Install from [nodejs.org](https://nodejs.org/)
- **MongoDB** (optional) → For backend caching

**Check your installations:**
```bash
rustc --version    # Should be 1.90+
node --version     # Should be 18+
npm --version      # Comes with Node.js
```

---

### 🎯 Option 1: Automated Setup (Recommended)

**One command to set everything up:**

```bash
./setup-all.sh
```

This script will:
- ✅ Build the blockchain
- ✅ Build smart contracts
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create configuration files

Then follow the instructions to start each service.

---

### 🔧 Option 2: Manual Setup (Step by Step)

#### **Terminal 1: Start the Blockchain**

```bash
# Navigate to blockchain directory
cd nchain

# Build the blockchain (first time only, takes a few minutes)
cargo build --release

# Start the blockchain node
cargo run --release -- node --api-port 8080 --p2p-port 9000
```

**Expected output:**
```
✅ Database connected
🚀 Server running on port 8080
🌐 P2P network listening on port 9000
```

**Verify:** Open http://localhost:8080 in your browser - you should see the blockchain dashboard!

---

#### **Terminal 2: Build & Setup Smart Contracts**

```bash
# Navigate to contracts directory
cd web3-marketplace/contracts

# Add WASM compilation target (first time only)
rustup target add wasm32-unknown-unknown

# Build both contracts
chmod +x build.sh
./build.sh
```

**Expected output:**
```
Building Gem NFT Contract...
Building Marketplace Contract...
✓ gem_nft.wasm
✓ gem_marketplace.wasm
Build complete!
```

**Note:** Contract deployment happens automatically when you first use the backend API. You can also deploy manually - see [web3-marketplace/SETUP_GUIDE.md](web3-marketplace/SETUP_GUIDE.md) for details.

---

#### **Terminal 3: Start the Backend API**

```bash
# Navigate to backend directory
cd web3-marketplace/backend

# Install dependencies (first time only)
npm install

# Create environment file
cp .env.example .env

# Optional: Edit .env if needed
# The defaults work for local development!
nano .env  # or use your preferred editor

# Start the backend server
npm run dev
```

**Expected output:**
```
🚀 Server running on port 3000
📡 nchain node: http://localhost:8080/api
🌍 Environment: development
```

**Verify:** Open http://localhost:3000/api/health - you should see a health check response!

---

#### **Terminal 4: Start the Frontend**

```bash
# Navigate to frontend directory
cd web3-marketplace/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**🎉 Open http://localhost:5173 in your browser!**

---

### ✅ Verification Checklist

After starting all services, verify they're working:

| Service | URL | Status Check |
|---------|-----|--------------|
| **Blockchain** | http://localhost:8080 | Should show dashboard |
| **Blockchain API** | http://localhost:8080/api/blockchain/info | Returns JSON with blockchain info |
| **Backend API** | http://localhost:3000/api/health | Returns `{"success": true}` |
| **Frontend** | http://localhost:5173 | Shows marketplace homepage |

---

### 🎮 First Steps in the Marketplace

Once everything is running, here's what you can do:

#### 1️⃣ **Create a Wallet**
- Click **"Connect Wallet"** in the top right corner
- A wallet will be created automatically for you
- Your wallet address will be displayed (e.g., `abc123...xyz789`)

#### 2️⃣ **Mint Your First Gem**
- Navigate to the **"Mint"** page from the top menu
- Enter a gem name (e.g., "Ruby Star", "Emerald Dream")
- Click **"Mint Gem"**
- Wait 2-3 seconds for the blockchain transaction
- 🎉 Your gem is created with random attributes!

**Example Gem Attributes:**
```
Name: Ruby Star
Rarity: Epic (randomly generated)
Color: Red
Power: 185
Shine: 203
Durability: 176
```

#### 3️⃣ **List Your Gem for Sale**
- Go to **"My Gems"** page
- Click on the gem you want to sell
- Choose listing type:
  - **Fixed Price**: Set a price, instant sale
  - **Auction**: Set starting price and duration
- Confirm the listing
- Your gem appears in the Marketplace!

#### 4️⃣ **Browse & Buy Gems**
- Visit the **"Marketplace"** page
- Use filters to find gems by rarity
- Search by name or attributes
- Click on a gem to view details
- Click **"Buy"** to purchase
- Gem is instantly transferred to your wallet!

#### 5️⃣ **View Your Collection**
- Click **"My Gems"** anytime
- See all your gems with their attributes
- Track transfer history
- List gems for sale or transfer to friends

---

### 💎 Understanding Gem Rarity

Gems are minted with different rarity levels (probability shown):

| Rarity | Color | Probability | Avg Stats |
|--------|-------|-------------|-----------|
| **Common** | Gray | 50% | 30-80 |
| **Uncommon** | Green | 30% | 60-120 |
| **Rare** | Blue | 15% | 90-160 |
| **Epic** | Purple | 4% | 120-200 |
| **Legendary** | Orange | 0.9% | 150-240 |
| **Mythic** | Pink | 0.1% | 180-280 |

Higher rarity = Better stats + Higher value!

---

### 🐛 Troubleshooting

**Blockchain won't start:**
```bash
# Check if port 8080 is already in use
lsof -i :8080

# Kill the process if needed
kill -9 <PID>

# Or use a different port
cargo run -- node --api-port 8081 --p2p-port 9001
```

**Backend can't connect to blockchain:**
```bash
# Verify blockchain is running
curl http://localhost:8080/api/blockchain/info

# Check backend .env file
cat web3-marketplace/backend/.env
# Ensure NCHAIN_API_URL=http://localhost:8080/api
```

**Frontend shows blank page:**
```bash
# Check browser console for errors
# Verify backend is running
curl http://localhost:3000/api/health

# Check frontend .env (if exists)
# Default should work: VITE_API_URL=http://localhost:3000/api
```

**"Module not found" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors in contracts:**
```bash
# Make sure WASM target is installed
rustup target add wasm32-unknown-unknown

# Try cleaning and rebuilding
cd gem-nft
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

---

### 📖 Next Steps

- Read [web3-marketplace/SETUP_GUIDE.md](web3-marketplace/SETUP_GUIDE.md) for detailed configuration
- Check [CLAUDE.md](CLAUDE.md) for complete technical documentation
- See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for an overview of all components

---

### 🔄 Stopping the Services

To stop all services:
- Press `Ctrl+C` in each terminal window
- Or use `pkill -f "cargo run"` and `pkill -f "npm run dev"`

## 📚 Documentation

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐ - Quick reference card with all commands
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Overview of all components
- **[CLAUDE.md](CLAUDE.md)** - Complete technical documentation for Claude Code
- **[nchain/README.md](nchain/README.md)** - Blockchain documentation
- **[nchain/SETUP.md](nchain/SETUP.md)** - Blockchain setup guide
- **[web3-marketplace/README.md](web3-marketplace/README.md)** - Marketplace overview
- **[web3-marketplace/SETUP_GUIDE.md](web3-marketplace/SETUP_GUIDE.md)** - Marketplace setup guide

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web3 Marketplace                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Frontend   │→ │   Backend    │→ │  Smart          │  │
│  │   React      │  │   Express    │  │  Contracts      │  │
│  │   Port 5173  │  │   Port 3000  │  │  (WASM)         │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   nchain Blockchain   │
                    │   - REST API          │
                    │   - P2P Network       │
                    │   - Smart Contracts   │
                    │   - SQLite DB         │
                    │   Port 8080/9000      │
                    └───────────────────────┘
```

## 🎮 Using the Marketplace

### Mint a Gem
1. Connect wallet (or create new one)
2. Navigate to "Mint" page
3. Enter gem name
4. Click "Mint Gem"
5. Gem created with random attributes!

### Trade Gems
1. Go to "My Gems" page
2. Select a gem to list
3. Choose "Fixed Price" or "Auction"
4. Set price and duration
5. Confirm listing

### Buy Gems
1. Browse "Marketplace" page
2. Filter by rarity or search
3. Click on a gem to view details
4. Click "Buy" and confirm
5. Gem transferred to your wallet!

## 🛠️ Development

### Blockchain Development
```bash
cd nchain
cargo build          # Build
cargo test           # Test
cargo run            # Run
```

### Smart Contract Development
```bash
cd web3-marketplace/contracts/gem-nft
cargo test           # Test contract
./build.sh          # Build to WASM
```

### Backend Development
```bash
cd web3-marketplace/backend
npm run dev          # Development server
npm test             # Run tests
npm run build        # Build for production
```

### Frontend Development
```bash
cd web3-marketplace/frontend
npm run dev          # Development server
npm run build        # Build for production
```

## 🧪 Testing

```bash
# Test blockchain
cd nchain && cargo test

# Test smart contracts
cd web3-marketplace/contracts
cd gem-nft && cargo test
cd ../marketplace && cargo test

# Test backend
cd web3-marketplace/backend && npm test

# Test frontend
cd web3-marketplace/frontend && npm test
```

## 📦 Production Deployment

See detailed deployment guides:
- Blockchain: `nchain/SETUP.md`
- Marketplace: `web3-marketplace/SETUP_GUIDE.md`

## 🔧 Tech Stack

### Blockchain (nchain)
- **Language**: Rust
- **Async Runtime**: Tokio
- **Web Framework**: Axum
- **P2P**: libp2p
- **Database**: SQLite + SQLx
- **Smart Contracts**: wasmtime

### Marketplace Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB (optional)
- **HTTP Client**: Axios

### Marketplace Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Router**: React Router

### Smart Contracts
- **Language**: Rust
- **Target**: WASM32
- **Serialization**: serde + serde_json

## 🎯 Key Features Explained

### Gem NFTs
Each gem is a unique digital asset with:
- **Unique ID**: Sequential (GEM-0, GEM-1, etc.)
- **Attributes**: Color, rarity, power, shine, durability
- **Rarity Levels**: Common → Uncommon → Rare → Epic → Legendary → Mythic
- **Ownership**: Cryptographically verified on blockchain
- **Transfer History**: Track number of transfers

### Marketplace
- **Fixed Price Sales**: Instant purchase at set price
- **Auctions**: Timed bidding with automatic resolution
- **Escrow**: Safe payment handling via smart contract
- **Fees**: 2.5% marketplace fee + 5% creator royalty
- **Withdrawals**: Sellers can withdraw escrow balance

## 🤝 Contributing

This is a learning/demonstration project. Feel free to:
1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report issues

## 📜 License

MIT License - see individual component licenses for details.

## 🙏 Acknowledgments

- Built with Rust, Node.js, and React
- Inspired by Solana's Proof-of-History
- Uses excellent open-source libraries: libp2p, wasmtime, Axum, Express, React

---

**Ready to explore decentralized gem trading? Start the blockchain and marketplace, then visit http://localhost:5173!**
