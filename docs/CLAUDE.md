# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a Web3/Blockchain Marketplace project with two main components:

1. **nchain**: A production-grade blockchain implementation in Rust featuring:
   - Full blockchain with Proof-of-Work mining
   - Ed25519 digital signatures for transaction security
   - Smart contract execution via WebAssembly (wasmtime)
   - P2P networking using libp2p
   - REST API server with Axum framework
   - SQLite-based persistence layer
   - Web dashboard for monitoring
   - Simplified Proof-of-History (inspired by Solana)

2. **web3-marketplace**: Complete Web3 gem marketplace with:
   - Smart contracts (Rust WASM) for gem NFTs and marketplace trading
   - Backend API service (Node.js/TypeScript with Express)
   - Frontend web app (React + TypeScript + Tailwind CSS)
   - Fully integrated with nchain blockchain for transactions and ownership

## Build & Development Commands

### Building the Blockchain
```bash
cd nchain

# Development build
cargo build

# Release build (optimized)
cargo build --release

# Run tests
cargo test

# Run specific test
cargo test test_blockchain_creation

# Run with debug logging
RUST_LOG=debug cargo run
```

### Running Different Node Types

**Full Node (API + P2P):**
```bash
cargo run -- node --api-port 8080 --p2p-port 9000
# Access dashboard at http://localhost:8080
```

**API Server Only:**
```bash
cargo run -- api --port 8080
```

**Interactive CLI:**
```bash
cargo run -- interactive
# or simply: cargo run
```

**Development Node:**
```bash
./scripts/start-dev.sh
# Uses config/development.toml, port 8081
```

### Configuration
Configuration files are in `nchain/config/`:
- `default.toml` - Base configuration
- `development.toml` - Development environment
- `production.toml` - Production deployment
- `miner.toml` - Mining-optimized settings

Set config via environment variable:
```bash
BLOCKCHAIN_CONFIG=config/production.toml cargo run -- node
```

## Architecture

### Core Module Structure

The blockchain is organized into distinct modules (`nchain/src/`):

- **blockchain.rs**: Chain management, validation, balance calculations
- **block.rs**: Block structure with PoW mining (nonce, difficulty)
- **transaction.rs**: Transaction creation and validation
- **crypto.rs**: Ed25519 signatures, wallet management (KeyPair, PublicKey, DigitalSignature)
- **poh.rs**: Proof-of-History recorder (sequential hashing for verifiable time)
- **mining.rs**: Mining engine with configurable difficulty and reward system
- **storage.rs**: SQLite persistence layer (blocks, transactions, wallets, contracts, mining stats)
- **network.rs**: P2P networking using libp2p (gossipsub, kad, mdns)
- **contracts.rs**: Smart contract engine with WASM runtime (wasmtime)
- **api.rs**: REST API server (Axum framework)
- **config.rs**: Configuration management from TOML files
- **cli.rs**: Interactive command-line interface
- **errors.rs**: Error types with thiserror

### Key Architectural Patterns

**Async Runtime:**
- All I/O operations use Tokio async runtime
- Main entry point is `#[tokio::main]` in `main.rs`
- API server and P2P networking run as concurrent tasks

**State Management:**
- Shared state wrapped in `Arc<RwLock<T>>` for thread-safe concurrent access
- Key shared structures: Blockchain, ContractEngine, MiningStats, NetworkStats, Wallets
- API state (`ApiState`) holds references to all shared components

**Storage Separation:**
- Business logic (blockchain, mining) is separate from persistence (storage)
- `BlockchainStorage` handles all database operations via SQLx
- Supports both file-based (`blockchain.db`) and in-memory SQLite databases
- Automatic migrations run on startup when `database.enable_migrations = true`

**Error Handling:**
- Custom error types using `thiserror` crate
- `BlockchainError` enum with variants for different error categories
- Result type alias: `type Result<T> = std::result::Result<T, BlockchainError>`

### Database Schema

SQLite database with key tables (see `nchain/migrations/`):
- **blocks**: Blockchain blocks (index, hash, previous_hash, poh_hash, nonce, difficulty, miner)
- **transactions**: All transactions (id, from/to addresses, amount, signature, public_key)
- **wallets**: Wallet storage (address, name, public/private keys)
- **smart_contracts**: Deployed contracts (id, name, owner, WASM bytecode)
- **contract_states**: Contract state storage (key-value per contract)
- **mining_stats**: Mining performance metrics (hash_rate, blocks_mined, total_hashes)
- **network_peers**: P2P network peers (peer_id, address, last_seen)

Performance indexes added in `002_add_performance_indexes.sql`.

### Smart Contracts

**Runtime:** WebAssembly execution via wasmtime
- Contracts are compiled to WASM bytecode
- Gas metering for resource limits (configurable in `[contracts]` config)
- Contract state persists to database
- Example contract: `nchain/contracts/simple_storage.wasm`

**Deployment:**
- Via CLI: `cargo run -- deploy-contract <name> <wasm_file> <owner>`
- Via API: `POST /api/contracts` with WASM bytecode

### P2P Networking

**Protocol:** libp2p with multiple protocols:
- **gossipsub**: Block and transaction propagation
- **kad**: Peer discovery (Kademlia DHT)
- **mdns**: Local network peer discovery
- **noise**: Encrypted transport
- **yamux**: Stream multiplexing

**Network Configuration:**
- Listen port configurable (default 9000)
- Bootstrap peers list in config for initial connections
- Max peers limit (default 50)
- Connection timeout and sync intervals configurable

### Mining System

**Proof-of-Work:**
- SHA-256 based mining with nonce discovery
- Configurable difficulty (leading zeros in block hash)
- Block rewards (default 12.5, configurable)
- Difficulty adjustment based on block time targets
- Coinbase transactions for miner rewards

**Mining Stats:**
- Hash rate calculation
- Blocks mined counter
- Total hashes computed
- Persisted to database

### REST API

**Framework:** Axum with tower-http middleware
- CORS support for web dashboards
- Rate limiting (default 100 req/min)
- Request timeout (default 30s)

**Key Endpoint Groups:**
- `/api/blockchain/*` - Chain info and validation
- `/api/blocks/*` - Block queries
- `/api/transactions/*` - Transaction creation and queries
- `/api/wallets/*` - Wallet management
- `/api/mining/*` - Mining operations and stats
- `/api/contracts/*` - Contract deployment and calls
- `/api/network/*` - P2P network status

See `nchain/docs/API.md` for complete endpoint documentation.

### Web Dashboard

Static HTML dashboard at `nchain/web/dashboard.html`:
- Real-time blockchain statistics
- Mining performance metrics
- Network status and peer information
- Recent blocks and transactions
- Served by API server at root path (`http://localhost:8080`)

## Development Workflow

### Making Changes

1. **Core blockchain logic**: Edit `blockchain.rs`, `block.rs`, `transaction.rs`
2. **Cryptography**: Modify `crypto.rs` (careful with key handling!)
3. **Storage/database**: Update `storage.rs` and potentially add migrations in `nchain/migrations/`
4. **API endpoints**: Add routes in `api.rs`
5. **P2P features**: Extend `network.rs`
6. **Smart contracts**: Modify `contracts.rs` for execution engine changes

### Testing Strategy

- Unit tests are in each module file (bottom of file)
- Integration tests in `src/lib.rs::tests`
- Key test areas: transaction validation, block creation, chain validation, PoH verification
- Run tests before committing: `cargo test`

### Common Gotchas

1. **Database locks**: Only one process can write to SQLite at a time
2. **Async/await**: Remember to `.await` async calls and use `#[tokio::test]` for async tests
3. **RwLock deadlocks**: Avoid holding read locks while trying to acquire write locks
4. **Configuration precedence**: Environment variables > config file > CLI args > defaults
5. **Port conflicts**: Check if ports 8080 (API) or 9000 (P2P) are already in use

### Adding New Features

**Adding a new CLI command:**
1. Add variant to `Commands` enum in `main.rs`
2. Implement handling in `match` statement
3. Update `nchain/docs/CLI.md` documentation

**Adding a new API endpoint:**
1. Add route handler in `api.rs`
2. Update `ApiState` if new shared state is needed
3. Document in `nchain/docs/API.md`

**Adding a new database table:**
1. Add migration SQL file in `nchain/migrations/` with sequential number
2. Update `storage.rs` with methods to access the table
3. Add corresponding struct/model if needed

## Configuration Reference

Key configuration sections in TOML files:

- `[node]` - Node identity and data directory
- `[database]` - Database connection and migrations
- `[mining]` - Mining difficulty, rewards, block timing
- `[network]` - P2P settings, ports, peers
- `[api]` - API server, CORS, rate limiting
- `[contracts]` - WASM execution limits, gas pricing
- `[logging]` - Log level and format

## Deployment

**Production Checklist:**
1. Use `config/production.toml` configuration
2. Build with `cargo build --release` for optimizations
3. Set up proper logging (`RUST_LOG=info`)
4. Configure firewall for ports 8080 (API) and 9000 (P2P)
5. Set up database backups (SQLite)
6. Consider using systemd service or Docker (see `Dockerfile` and `docker-compose.yml`)

**Docker Deployment:**
```bash
docker build -t blockchain:latest nchain/
docker-compose up -d
```

See `nchain/SETUP.md` for detailed deployment instructions.

---

## Web3 Gem Marketplace

The marketplace is a complete dApp (decentralized application) built on top of the nchain blockchain.

### Quick Start - Marketplace

**Prerequisites:**
- nchain node running on port 8080
- Node.js 18+
- MongoDB (optional, for caching)

**Start the stack:**
```bash
# Terminal 1: Start nchain
cd nchain
cargo run -- node --api-port 8080 --p2p-port 9000

# Terminal 2: Build and deploy contracts
cd web3-marketplace/contracts
rustup target add wasm32-unknown-unknown
./build.sh

# Terminal 3: Start backend
cd web3-marketplace/backend
npm install
cp .env.example .env
# Edit .env: set NCHAIN_API_URL and contract IDs
npm run dev  # Runs on port 3000

# Terminal 4: Start frontend
cd web3-marketplace/frontend
npm install
npm run dev  # Runs on port 5173
```

Access marketplace at: http://localhost:5173

### Marketplace Architecture

```
web3-marketplace/
├── contracts/              # Rust WASM smart contracts
│   ├── gem-nft/           # Gem NFT token contract
│   │   ├── src/lib.rs     # NFT logic (mint, transfer, ownership)
│   │   └── Cargo.toml
│   ├── marketplace/       # Marketplace trading contract
│   │   ├── src/lib.rs     # Listings, sales, auctions, escrow
│   │   └── Cargo.toml
│   └── build.sh           # Build script for both contracts
├── backend/               # Node.js/TypeScript API
│   ├── src/
│   │   ├── services/      # Business logic layer
│   │   │   ├── blockchainService.ts  # nchain API client
│   │   │   ├── gemService.ts         # Gem NFT operations
│   │   │   └── marketplaceService.ts # Marketplace operations
│   │   ├── routes/        # REST API endpoints
│   │   │   ├── gemRoutes.ts
│   │   │   ├── marketplaceRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── middleware/    # Express middleware
│   │   └── index.ts       # Entry point
│   └── package.json
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components (Home, Marketplace, MyGems, etc.)
    │   ├── services/      # API client
    │   ├── stores/        # State management (Zustand)
    │   └── App.tsx
    └── package.json
```

### Smart Contracts

**Gem NFT Contract (`contracts/gem-nft/src/lib.rs`):**
- **Minting**: Create unique gems with attributes (color, rarity, power, shine, durability)
- **Transfers**: Transfer ownership between wallets
- **Ownership tracking**: Query gem ownership and metadata
- **Rarity levels**: Common, Uncommon, Rare, Epic, Legendary, Mythic
- **State**: Maintains HashMap of gems and owner mappings

**Marketplace Contract (`contracts/marketplace/src/lib.rs`):**
- **Listings**: Create fixed-price or auction listings for gems
- **Purchases**: Buy gems at fixed prices
- **Auctions**: Place bids, automatic auction resolution
- **Escrow**: Safe payment handling with automatic fee distribution
- **Fees**: Marketplace fee (2.5%) + creator royalty (5%)
- **State**: Listings, sales history, escrow balances

**Building contracts:**
```bash
cd web3-marketplace/contracts
./build.sh
# Outputs: gem-nft/gem_nft.wasm and marketplace/gem_marketplace.wasm
```

### Backend API Service

**Technology:** Express.js + TypeScript + Axios (for nchain communication)

**Key Services:**
- `blockchainService.ts`: Communicates with nchain API for transactions, wallets, contract calls
- `gemService.ts`: Wraps Gem NFT contract operations
- `marketplaceService.ts`: Wraps Marketplace contract operations

**API Endpoints:**

Gems:
- `POST /api/gems/mint` - Mint new gem with random or custom attributes
- `GET /api/gems/:gemId` - Get gem details
- `POST /api/gems/:gemId/transfer` - Transfer gem to another wallet
- `GET /api/gems/owner/:address` - Get all gems owned by address
- `GET /api/gems/stats/supply` - Total gem supply

Marketplace:
- `POST /api/marketplace/listings` - Create fixed-price or auction listing
- `GET /api/marketplace/listings` - Get all active listings
- `GET /api/marketplace/listings/:id` - Get listing details
- `POST /api/marketplace/listings/:id/buy` - Purchase gem
- `POST /api/marketplace/listings/:id/bid` - Place auction bid
- `DELETE /api/marketplace/listings/:id` - Cancel listing
- `GET /api/marketplace/sales` - Sales history
- `GET /api/marketplace/balance/:address` - Escrow balance
- `POST /api/marketplace/withdraw` - Withdraw escrow funds

Users:
- `GET /api/users/:address` - User profile (gems, balances)
- `POST /api/users/wallet` - Create new wallet
- `GET /api/users` - List all users

**Configuration (`.env`):**
```env
NCHAIN_API_URL=http://localhost:8080/api
GEM_NFT_CONTRACT_ID=<deployed-contract-id>
MARKETPLACE_CONTRACT_ID=<deployed-contract-id>
MONGODB_URI=mongodb://localhost:27017/gem-marketplace  # Optional
```

### Frontend Application

**Technology:** React 18 + TypeScript + Vite + Tailwind CSS + React Query

**State Management:**
- Zustand for wallet state (address, balances)
- React Query for server state (gems, listings, cached API responses)

**Key Pages:**
- **HomePage**: Hero section, features, statistics
- **MarketplacePage**: Browse and filter active gem listings
- **MyGemsPage**: View user's gem collection
- **MintPage**: Create new gems with random attributes
- **GemDetailPage**: Detailed gem view with trading options

**Wallet Integration:**
- Currently uses nchain wallets via backend API
- Connect wallet button in navbar
- Shows connected address and balances
- Future: Can integrate MetaMask or other Web3 wallets

**Key Components:**
- `Navbar`: Navigation and wallet connection
- `GemCard`: Display gem listing with rarity, price, attributes
- State stores in `src/stores/walletStore.ts`

### Development Workflow - Marketplace

**Modify Smart Contracts:**
1. Edit Rust code in `contracts/gem-nft/src/lib.rs` or `contracts/marketplace/src/lib.rs`
2. Run `cargo test` to test changes
3. Rebuild: `./build.sh`
4. Redeploy contracts to nchain (POST to `/api/contracts`)
5. Update contract IDs in backend `.env`

**Add Backend API Endpoint:**
1. Create service method if needed (e.g., in `gemService.ts`)
2. Add route handler in appropriate routes file
3. Test with `curl` or Postman
4. Update frontend API calls if needed

**Add Frontend Feature:**
1. Create or modify React components in `src/components/` or `src/pages/`
2. Use `useQuery` for data fetching, `useMutation` for updates
3. Style with Tailwind CSS utility classes
4. Hot reload will show changes instantly

**Testing:**
```bash
# Test smart contracts
cd contracts/gem-nft && cargo test
cd ../marketplace && cargo test

# Test backend
cd backend && npm test

# Run frontend locally
cd frontend && npm run dev
```

### Common Gotchas - Marketplace

1. **Contract IDs**: Must deploy contracts first and set IDs in backend `.env`
2. **nchain must be running**: Backend requires nchain node on port 8080
3. **CORS**: Backend CORS_ORIGIN must match frontend URL for local dev
4. **Wallet addresses**: Use actual wallet addresses from nchain (create via CLI)
5. **MongoDB optional**: Backend works without MongoDB, just won't cache data
6. **WASM target**: Must add `rustup target add wasm32-unknown-unknown` for contracts

### Deployment - Marketplace

**Contracts:**
- Build: `cd contracts && ./build.sh`
- Deploy via nchain API: `POST /api/contracts` with WASM bytecode
- Save contract IDs for backend configuration

**Backend:**
- Build: `npm run build`
- Run: `npm start` (or use PM2/systemd)
- Set production environment variables in `.env`

**Frontend:**
- Build: `npm run build` (outputs to `dist/`)
- Serve with nginx, Vercel, Netlify, or any static host
- Set `VITE_API_URL` to production backend URL

### Integration Flow

1. **User mints gem** (Frontend) → Backend API → nchain contract call → Gem NFT contract
2. **Create listing** → Marketplace contract creates listing with escrow
3. **User buys gem** → Payment to escrow → Marketplace contract transfers ownership via Gem NFT contract → Distributes funds (seller + royalty + fees)
4. **All state** persists in nchain blockchain via smart contracts

See `web3-marketplace/SETUP_GUIDE.md` for complete setup instructions.
