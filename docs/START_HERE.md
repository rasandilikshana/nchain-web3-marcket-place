# 🚀 START HERE - Quick Setup Guide

## For Someone Cloning This Project Fresh

Welcome! Follow these steps to get the Web3 Gem Marketplace running in 5 minutes.

---

## 📋 Step 1: Install Prerequisites

You need:
- **Rust** 1.70+ → [Install](https://rustup.rs/)
- **Node.js** 18+ → [Install](https://nodejs.org/)

**Quick install (Ubuntu/macOS):**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or on macOS with Homebrew
brew install node
```

---

## 🔧 Step 2: Run Setup

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup (takes 5-10 minutes)
./setup.sh
```

This will:
- ✅ Build the blockchain
- ✅ Build smart contracts
- ✅ Install all dependencies
- ✅ Create configuration files

---

## 🏃 Step 3: Start Services

Open **3 terminal windows** and run:

### Terminal 1: Blockchain
```bash
cd nchain
cargo run --release -- node --api-port 8080 --p2p-port 9000
```

**Wait for:** "REST API server started on http://0.0.0.0:8080"

### Terminal 2: Backend API
```bash
cd web3-marketplace/backend
npm run dev
```

**Wait for:** "Server running on port 3000"

### Terminal 3: Frontend
```bash
cd web3-marketplace/frontend
npm run dev
```

**Wait for:** "Local: http://localhost:5173/"

---

## 🎉 Step 4: Test It!

1. **Open your browser** → http://localhost:5173

2. **Connect Wallet**
   - Click "Connect Wallet" button (top-right)
   - Your test wallet will be connected

3. **Mint Your First Gem** 💎
   - Click "Mint" in navigation
   - Enter a gem name (e.g., "Ruby Dragon")
   - Click "Mint Gem"
   - 🎉 Your gem is created!

4. **View Your Collection**
   - Click "My Gems"
   - See your gem with all its stats

---

## ✅ Quick Health Check

Verify everything is running:

```bash
# Test blockchain
curl http://localhost:8080/api/blockchain/info

# Test backend
curl http://localhost:3000/api/health

# Test frontend (in browser)
# Visit: http://localhost:5173
```

All should return successful responses!

---

## 📚 Next Steps

- **[HOW_TO_TEST.md](HOW_TO_TEST.md)** - Complete testing guide
- **[README.md](README.md)** - Full documentation
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands

---

## 🐛 Having Issues?

### Setup failed?
```bash
# Make sure prerequisites are installed
rustc --version  # Should show Rust version
node --version   # Should show Node.js version
npm --version    # Should show npm version
```

### Port already in use?
```bash
# Kill process on port
lsof -ti:8080 | xargs kill -9  # For blockchain
lsof -ti:3000 | xargs kill -9  # For backend
lsof -ti:5173 | xargs kill -9  # For frontend
```

### More help?
Check **[HOW_TO_TEST.md](HOW_TO_TEST.md)** for detailed troubleshooting.

---

## 🎮 What You Can Do

Once everything is running:

- ✅ Mint unique gems with random attributes
- ✅ Build your gem collection
- ✅ View all gems in the marketplace
- ✅ Test with multiple wallets
- ✅ Explore the blockchain dashboard

---

## 📊 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Marketplace** | http://localhost:5173 | Main interface |
| **Backend API** | http://localhost:3000 | REST API |
| **Blockchain** | http://localhost:8080 | Dashboard & API |

---

**That's it! You're ready to start testing! 🚀💎**

For detailed testing instructions, read **[HOW_TO_TEST.md](HOW_TO_TEST.md)**
