# 💎 nchain Web3 Marketplace - Easy Setup

**Automated setup wrapper for the nchain blockchain + NFT marketplace**

This repository makes it super easy to clone and run the complete Web3 Gem Marketplace with a single command!

---

## 🚀 Quick Start (2 Commands!)

```bash
# 1. Clone this wrapper repo
git clone https://github.com/rasandilikshana/nchain-web3-marcket-place.git
cd nchain-web3-marcket-place

# 2. Run setup (clones nchain automatically and builds everything)
chmod +x setup.sh
./setup.sh
```

**That's it!** The setup script will:
- ✅ Clone the nchain blockchain repository
- ✅ Build the blockchain (Rust)
- ✅ Install all dependencies
- ✅ Set up backend and frontend
- ✅ Create configuration files

---

## 🏃 Running the Marketplace

After setup completes, start 3 services:

### Terminal 1 - Blockchain
```bash
cd nchain
cargo run --release -- node --api-port 8080 --p2p-port 9000
```

### Terminal 2 - Backend API
```bash
cd nchain/web3-marketplace/backend
npm run dev
```

### Terminal 3 - Frontend
```bash
cd nchain/web3-marketplace/frontend
npm run dev
```

---

## 🧪 Testing

Once all services are running:

```bash
# Run automated tests
./run-tests.sh
```

Or open your browser:
- **Marketplace**: http://localhost:5173
- **Blockchain Dashboard**: http://localhost:8080
- **Backend API**: http://localhost:3000

---

## 📋 Prerequisites

You need these installed:

| Tool | Version | Install |
|------|---------|---------|
| **Git** | Any | [git-scm.com](https://git-scm.com/) |
| **Rust** | 1.70+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |

---

## 📚 Documentation

All documentation is in the `docs/` folder:

- **[docs/START_HERE.md](docs/START_HERE.md)** - Quick start guide
- **[docs/HOW_TO_TEST.md](docs/HOW_TO_TEST.md)** - Complete testing guide
- **[docs/MARKETPLACE_TESTING_GUIDE.md](docs/MARKETPLACE_TESTING_GUIDE.md)** - API reference
- **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick commands
- **[docs/CLAUDE.md](docs/CLAUDE.md)** - Technical documentation
- **[docs/SHARE_WITH_FRIENDS.md](docs/SHARE_WITH_FRIENDS.md)** - Share this project

---

## ✨ What You Get

- **Custom Blockchain** - Rust implementation with PoW consensus
- **Smart Contracts** - WebAssembly execution engine
- **NFT Marketplace** - Complete gem trading platform
- **Beautiful UI** - React + Tailwind CSS frontend
- **REST API** - Full backend API
- **P2P Network** - libp2p networking
- **Web Dashboard** - Blockchain monitoring

---

## 🎮 Quick Test

```bash
# After starting all services...

# 1. Open http://localhost:5173
# 2. Click "Connect Wallet"
# 3. Go to "Mint" page
# 4. Create your first gem! 💎
# 5. View your collection in "My Gems"
```

---

## 🔗 Original Repository

This wrapper clones: [https://github.com/narthanaj/nchain.git](https://github.com/narthanaj/nchain.git)

---

## 🐛 Troubleshooting

### Setup fails?
```bash
# Check prerequisites
rustc --version  # Should show Rust version
node --version   # Should show Node.js 18+
git --version    # Should show git version
```

### Port in use?
```bash
# Kill processes
lsof -ti:8080 | xargs kill -9  # Blockchain
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### More help?
See **[docs/HOW_TO_TEST.md](docs/HOW_TO_TEST.md)** for detailed troubleshooting.

---

## 📁 Project Structure

```
nchain-web3-marcket-place/          # This wrapper repo
├── setup.sh                         # Automated setup script
├── run-tests.sh                     # Test runner
├── README.md                        # This file
├── docs/                            # Documentation
│   ├── START_HERE.md
│   ├── HOW_TO_TEST.md
│   └── ...
└── nchain/                          # Cloned automatically by setup.sh
    ├── src/                         # Blockchain implementation
    └── web3-marketplace/            # NFT marketplace
        ├── backend/                 # API (Node.js)
        └── frontend/                # UI (React)
```

---

## 🎁 Share This Project

Want to share with friends?

```
git clone https://github.com/rasandilikshana/nchain-web3-marcket-place.git
cd nchain-web3-marcket-place
./setup.sh

Then start 3 terminals and run the commands shown.
Read docs/START_HERE.md for details.

It's a complete blockchain + NFT marketplace!
Works out of the box. 💎✨
```

---

## 📄 License

MIT License - See original nchain repository for details.

---

**Built with ❤️ using Rust and React**

**Happy Testing! 💎✨**
