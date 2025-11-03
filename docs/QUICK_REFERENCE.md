# Quick Reference Card

## 🚀 Start Commands (Copy-Paste Ready)

### Terminal 1: Blockchain
```bash
cd nchain && cargo run --release -- node --api-port 8080 --p2p-port 9000
```

### Terminal 2: Backend
```bash
cd web3-marketplace/backend && npm run dev
```

### Terminal 3: Frontend
```bash
cd web3-marketplace/frontend && npm run dev
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| 🌐 Frontend | http://localhost:5173 | Main marketplace UI |
| 🔧 Backend API | http://localhost:3000/api | REST API endpoints |
| ⛓️ Blockchain Dashboard | http://localhost:8080 | Blockchain stats |
| 📊 Blockchain API | http://localhost:8080/api | Blockchain endpoints |
| 🏥 Health Check | http://localhost:3000/api/health | Backend status |

---

## 🎮 User Actions

### Mint a Gem
```
Frontend → Mint Page → Enter Name → Mint Gem
```

### List for Sale
```
My Gems → Select Gem → Set Price → Create Listing
```

### Buy a Gem
```
Marketplace → Browse → Select Gem → Buy
```

---

## 🛠️ Common Commands

### Build Everything
```bash
# Blockchain
cd nchain && cargo build --release

# Contracts
cd web3-marketplace/contracts && ./build.sh

# Backend
cd web3-marketplace/backend && npm install

# Frontend
cd web3-marketplace/frontend && npm install
```

### Run Tests
```bash
# Blockchain
cd nchain && cargo test

# Contracts
cd web3-marketplace/contracts/gem-nft && cargo test
cd web3-marketplace/contracts/marketplace && cargo test

# Backend
cd web3-marketplace/backend && npm test

# Frontend
cd web3-marketplace/frontend && npm test
```

### Clean Build
```bash
# Blockchain
cd nchain && cargo clean && cargo build --release

# Contracts
cd web3-marketplace/contracts && rm -rf */target && ./build.sh

# Backend
cd web3-marketplace/backend && rm -rf node_modules && npm install

# Frontend
cd web3-marketplace/frontend && rm -rf node_modules && npm install
```

---

## 🐛 Troubleshooting Commands

### Check if Services are Running
```bash
# Blockchain
curl http://localhost:8080/api/blockchain/info

# Backend
curl http://localhost:3000/api/health

# Frontend (open in browser)
open http://localhost:5173
```

### Check Port Usage
```bash
# Check what's using port 8080 (blockchain)
lsof -i :8080

# Check what's using port 3000 (backend)
lsof -i :3000

# Check what's using port 5173 (frontend)
lsof -i :5173
```

### Kill Processes
```bash
# Kill blockchain
pkill -f "cargo run"

# Kill backend
pkill -f "npm run dev"

# Or kill by port
kill -9 $(lsof -t -i:8080)
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:5173)
```

---

## 📁 Key File Locations

### Configuration Files
```
nchain/config/default.toml              # Blockchain config
web3-marketplace/backend/.env           # Backend config
web3-marketplace/frontend/.env          # Frontend config (optional)
```

### Smart Contracts
```
web3-marketplace/contracts/gem-nft/src/lib.rs      # Gem NFT contract
web3-marketplace/contracts/marketplace/src/lib.rs  # Marketplace contract
```

### Compiled Contracts (after build)
```
web3-marketplace/contracts/gem-nft/gem_nft.wasm
web3-marketplace/contracts/marketplace/gem_marketplace.wasm
```

### Database
```
nchain/blockchain.db                    # Blockchain data
```

### Logs
```
nchain/logs/                            # Blockchain logs
web3-marketplace/backend/logs/          # Backend logs
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3000
NCHAIN_API_URL=http://localhost:8080/api
GEM_NFT_CONTRACT_ID=<set-after-deployment>
MARKETPLACE_CONTRACT_ID=<set-after-deployment>
MONGODB_URI=mongodb://localhost:27017/gem-marketplace
```

### Frontend (.env - optional)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📊 API Endpoints Cheat Sheet

### Gems
- `POST /api/gems/mint` - Mint new gem
- `GET /api/gems/:gemId` - Get gem details
- `GET /api/gems/owner/:address` - Get user's gems
- `POST /api/gems/:gemId/transfer` - Transfer gem

### Marketplace
- `GET /api/marketplace/listings` - All listings
- `POST /api/marketplace/listings` - Create listing
- `POST /api/marketplace/listings/:id/buy` - Buy gem
- `POST /api/marketplace/listings/:id/bid` - Place bid
- `DELETE /api/marketplace/listings/:id` - Cancel listing

### Users
- `GET /api/users/:address` - User profile
- `POST /api/users/wallet` - Create wallet
- `GET /api/users` - List all users

---

## 🎯 Project Structure at a Glance

```
.
├── nchain/                      # Rust blockchain
├── web3-marketplace/
│   ├── contracts/              # WASM smart contracts
│   ├── backend/                # Node.js API
│   └── frontend/               # React app
├── README.md                   # Full documentation
├── CLAUDE.md                   # Technical docs
└── setup-all.sh               # Setup script
```

---

## 💡 Quick Tips

1. **Always start blockchain first** - Other services depend on it
2. **Check health endpoints** - Verify services are running before debugging
3. **View browser console** - Frontend errors show here
4. **Check backend logs** - Located in `web3-marketplace/backend/logs/`
5. **Use the setup script** - Run `./setup-all.sh` for initial setup
6. **MongoDB is optional** - Backend works without it (just slower queries)
7. **Contracts auto-deploy** - No manual deployment needed for dev

---

## 📞 Getting Help

- **Full Documentation**: [README.md](README.md)
- **Setup Guide**: [web3-marketplace/SETUP_GUIDE.md](web3-marketplace/SETUP_GUIDE.md)
- **Technical Details**: [CLAUDE.md](CLAUDE.md)
- **Project Overview**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**Print this and keep it handy while developing!** 📌
