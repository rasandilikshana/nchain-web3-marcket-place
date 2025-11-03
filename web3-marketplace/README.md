# Web3 Gem Marketplace

A decentralized marketplace for trading unique digital gems built on top of the nchain blockchain.

## Features

- **Digital Gem NFTs**: Unique, tradeable gems with rarity levels and attributes
- **Marketplace**: List, buy, and sell gems with blockchain-backed ownership
- **Wallet Integration**: Secure wallet-based authentication
- **Smart Contracts**: WASM-based contracts for marketplace logic
- **Real-time Updates**: Live marketplace updates via blockchain events

## Architecture

```
web3-marketplace/
├── contracts/          # Rust WASM smart contracts
│   ├── gem-nft/       # Gem NFT token contract
│   └── marketplace/   # Marketplace trading contract
├── backend/           # Node.js/TypeScript API service
│   ├── src/
│   │   ├── services/  # Business logic
│   │   ├── routes/    # API routes
│   │   └── models/    # Data models
│   └── package.json
├── frontend/          # React + TypeScript UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # API client
│   │   └── contexts/  # State management
│   └── package.json
└── shared/           # Shared types and utilities
```

## Technology Stack

### Smart Contracts
- **Language**: Rust
- **Runtime**: WebAssembly (WASM)
- **Blockchain**: nchain

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (for indexing/caching)
- **Blockchain Client**: HTTP client to nchain API

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+
- Rust 1.90+
- MongoDB (optional, for caching)
- nchain node running (see ../nchain/README.md)

### Start nchain Node
```bash
cd ../nchain
cargo run -- node --api-port 8080 --p2p-port 9000
```

### Build Smart Contracts
```bash
cd contracts
./build.sh
```

### Run Backend
```bash
cd backend
npm install
npm run dev
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the marketplace at: http://localhost:5173

## Smart Contract Overview

### Gem NFT Contract
- Mint unique gems with attributes (rarity, color, power, etc.)
- Transfer ownership between wallets
- Query gem metadata and ownership
- Emit events for marketplace tracking

### Marketplace Contract
- Create listings (fixed price or auction)
- Purchase gems
- Cancel listings
- Escrow functionality for safe trading
- Royalty payments to original creators

## API Endpoints

### Gems
- `GET /api/gems` - List all gems
- `GET /api/gems/:id` - Get gem details
- `POST /api/gems/mint` - Mint new gem
- `GET /api/gems/owner/:address` - Get gems by owner

### Marketplace
- `GET /api/marketplace/listings` - Active listings
- `POST /api/marketplace/list` - Create listing
- `POST /api/marketplace/buy` - Purchase gem
- `DELETE /api/marketplace/listing/:id` - Cancel listing

### Users
- `POST /api/auth/login` - Wallet authentication
- `GET /api/users/:address` - User profile
- `GET /api/users/:address/gems` - User's gem collection

## Development

### Build Contracts
```bash
cd contracts/gem-nft
cargo build --target wasm32-unknown-unknown --release
wasm-opt -Oz -o gem_nft.wasm target/wasm32-unknown-unknown/release/gem_nft.wasm
```

### Test Backend
```bash
cd backend
npm test
```

### Test Frontend
```bash
cd frontend
npm test
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

## License

MIT
