# Web3 Gem Marketplace - Setup Guide

Complete guide to set up and run the Web3 Gem Marketplace on top of nchain blockchain.

## Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.90+ (for smart contracts)
- **MongoDB** (optional, for backend caching)
- **nchain node** running (see ../nchain/README.md)

## Quick Start

### 1. Start nchain Blockchain Node

```bash
cd ../nchain
cargo run -- node --api-port 8080 --p2p-port 9000
```

The nchain node must be running before starting the marketplace services.

### 2. Build Smart Contracts

```bash
cd contracts

# Add WASM target if not already added
rustup target add wasm32-unknown-unknown

# Build contracts
./build.sh
```

This creates:
- `gem-nft/gem_nft.wasm` - Gem NFT contract
- `marketplace/gem_marketplace.wasm` - Marketplace contract

### 3. Deploy Contracts to Blockchain

Use the nchain API to deploy contracts:

```bash
# Deploy Gem NFT Contract
curl -X POST http://localhost:8080/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GemNFT",
    "bytecode": "<base64-encoded-wasm>",
    "owner": "<wallet-address>"
  }'

# Deploy Marketplace Contract
curl -X POST http://localhost:8080/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GemMarketplace",
    "bytecode": "<base64-encoded-wasm>",
    "owner": "<wallet-address>"
  }'
```

Save the contract IDs returned from these calls.

### 4. Setup Backend API

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set:
# - NCHAIN_API_URL=http://localhost:8080/api
# - GEM_NFT_CONTRACT_ID=<contract-id-from-step-3>
# - MARKETPLACE_CONTRACT_ID=<contract-id-from-step-3>

# Start development server
npm run dev
```

Backend will run on http://localhost:3000

### 5. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Architecture Overview

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│   Backend    │─────▶│  nchain Node    │
│  (React/Vite)   │      │  (Express)   │      │   (Rust)        │
│  Port: 5173     │      │  Port: 3000  │      │  Port: 8080     │
└─────────────────┘      └──────────────┘      └─────────────────┘
                                                        │
                                                        ▼
                                                 ┌──────────────┐
                                                 │ Smart        │
                                                 │ Contracts    │
                                                 │ (WASM)       │
                                                 └──────────────┘
```

## Development Workflow

### Testing Smart Contracts

```bash
cd contracts/gem-nft
cargo test

cd ../marketplace
cargo test
```

### Testing Backend API

```bash
cd backend
npm test

# Manual API testing
curl http://localhost:3000/api/health
```

### Testing Frontend

```bash
cd frontend
npm run dev

# Open browser to http://localhost:5173
```

## Common Operations

### Mint a Gem

```bash
curl -X POST http://localhost:3000/api/gems/mint \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ruby Gem",
    "owner": "<wallet-address>"
  }'
```

### Create a Marketplace Listing

```bash
curl -X POST http://localhost:3000/api/marketplace/listings \
  -H "Content-Type: application/json" \
  -d '{
    "gemId": "GEM-0",
    "seller": "<wallet-address>",
    "listingType": "FixedPrice",
    "price": 100.0
  }'
```

### Buy a Gem

```bash
curl -X POST http://localhost:3000/api/marketplace/listings/LISTING-0/buy \
  -H "Content-Type: application/json" \
  -d '{
    "buyer": "<wallet-address>",
    "paymentAmount": 100.0,
    "creator": "<original-creator-address>"
  }'
```

## Production Deployment

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the dist/ folder with nginx or similar
```

### Environment Variables for Production

Backend (.env):
```
NODE_ENV=production
PORT=3000
NCHAIN_API_URL=https://your-blockchain-node.com/api
MONGODB_URI=mongodb://your-mongo-server/gem-marketplace
GEM_NFT_CONTRACT_ID=<deployed-contract-id>
MARKETPLACE_CONTRACT_ID=<deployed-contract-id>
JWT_SECRET=<strong-secret-key>
CORS_ORIGIN=https://your-frontend.com
```

Frontend (.env.production):
```
VITE_API_URL=https://your-backend.com/api
```

## Troubleshooting

### nchain Node Not Connecting

- Ensure nchain node is running: `curl http://localhost:8080/api/blockchain/info`
- Check NCHAIN_API_URL in backend .env
- Check nchain logs for errors

### Contracts Not Working

- Verify contracts were deployed successfully
- Check contract IDs are correct in backend .env
- Review nchain contract logs

### Frontend Can't Connect to Backend

- Verify backend is running: `curl http://localhost:3000/api/health`
- Check CORS settings in backend
- Verify API_URL in frontend

### Wallet Connection Issues

- Make sure you have wallets created in nchain
- Create a wallet: `cd ../nchain && cargo run -- create-wallet "TestUser"`
- Use the wallet address in API calls

## API Documentation

### Gem Endpoints

- `POST /api/gems/mint` - Mint a new gem
- `GET /api/gems/:gemId` - Get gem details
- `POST /api/gems/:gemId/transfer` - Transfer gem ownership
- `GET /api/gems/owner/:address` - Get gems by owner
- `GET /api/gems/stats/supply` - Get total supply

### Marketplace Endpoints

- `POST /api/marketplace/listings` - Create listing
- `GET /api/marketplace/listings` - Get active listings
- `GET /api/marketplace/listings/:id` - Get listing details
- `POST /api/marketplace/listings/:id/buy` - Buy a gem
- `POST /api/marketplace/listings/:id/bid` - Place bid on auction
- `DELETE /api/marketplace/listings/:id` - Cancel listing
- `GET /api/marketplace/sales` - Get sales history
- `GET /api/marketplace/balance/:address` - Get escrow balance
- `POST /api/marketplace/withdraw` - Withdraw escrow balance

### User Endpoints

- `GET /api/users/:address` - Get user profile
- `POST /api/users/wallet` - Create wallet
- `GET /api/users` - List all users

## Next Steps

1. **Customize Gem Attributes**: Modify gem attributes in `contracts/gem-nft/src/lib.rs`
2. **Add More Features**: Implement auctions, collections, achievements
3. **Enhance UI**: Customize frontend design and add more visualizations
4. **Add Authentication**: Implement proper wallet-based authentication
5. **Deploy to Production**: Set up cloud infrastructure for all components

## Support

For issues and questions:
- Check nchain documentation: `../nchain/README.md`
- Review backend logs: `backend/logs/`
- Check browser console for frontend errors
