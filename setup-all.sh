#!/bin/bash

# Complete setup script for Web3 Gem Marketplace
# This script helps set up all components in the correct order

set -e

echo "========================================"
echo "  Web3 Gem Marketplace Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust not found. Please install from https://rustup.rs/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Rust found: $(rustc --version)${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

echo ""
echo "========================================"
echo "  Step 1: Building Blockchain (nchain)"
echo "========================================"
echo ""

cd nchain

echo "Building nchain blockchain..."
cargo build --release
echo -e "${GREEN}✓ Blockchain built successfully${NC}"

echo ""
echo "Running blockchain tests..."
cargo test
echo -e "${GREEN}✓ All blockchain tests passed${NC}"

cd ..

echo ""
echo "========================================"
echo "  Step 2: Building Smart Contracts"
echo "========================================"
echo ""

cd web3-marketplace/contracts

# Add WASM target if not present
echo "Adding WASM target..."
rustup target add wasm32-unknown-unknown

echo "Building smart contracts..."
if [ -f "./build.sh" ]; then
    chmod +x build.sh
    ./build.sh
    echo -e "${GREEN}✓ Smart contracts built successfully${NC}"
else
    echo -e "${RED}❌ build.sh not found${NC}"
    exit 1
fi

cd ../..

echo ""
echo "========================================"
echo "  Step 3: Setting up Backend"
echo "========================================"
echo ""

cd web3-marketplace/backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit backend/.env and set:${NC}"
    echo "  - NCHAIN_API_URL (default: http://localhost:8080/api)"
    echo "  - GEM_NFT_CONTRACT_ID (after deploying contracts)"
    echo "  - MARKETPLACE_CONTRACT_ID (after deploying contracts)"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ../..

echo ""
echo "========================================"
echo "  Step 4: Setting up Frontend"
echo "========================================"
echo ""

cd web3-marketplace/frontend

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ../..

echo ""
echo "========================================"
echo "  ✅ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the blockchain:"
echo "   cd nchain"
echo "   cargo run -- node --api-port 8080 --p2p-port 9000"
echo ""
echo "2. Deploy smart contracts (in another terminal):"
echo "   See web3-marketplace/SETUP_GUIDE.md for deployment instructions"
echo ""
echo "3. Start the backend (in another terminal):"
echo "   cd web3-marketplace/backend"
echo "   npm run dev"
echo ""
echo "4. Start the frontend (in another terminal):"
echo "   cd web3-marketplace/frontend"
echo "   npm run dev"
echo ""
echo "5. Access the marketplace at: http://localhost:5173"
echo ""
echo -e "${GREEN}Happy trading! 💎${NC}"
