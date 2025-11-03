#!/bin/bash

# Deploy Smart Contracts to nchain blockchain
# This script deploys the Gem NFT and Marketplace contracts

set -e

echo "========================================="
echo "  Deploying Smart Contracts to nchain"
echo "========================================="
echo ""

# Check if contracts are built
if [ ! -f "gem-nft/gem_nft.wasm" ]; then
    echo "❌ gem_nft.wasm not found! Please run ./build.sh first"
    exit 1
fi

if [ ! -f "marketplace/gem_marketplace.wasm" ]; then
    echo "❌ gem_marketplace.wasm not found! Please run ./build.sh first"
    exit 1
fi

# Check if nchain is running
if ! curl -s http://localhost:8080/api/blockchain/info > /dev/null; then
    echo "❌ nchain blockchain not running on port 8080"
    echo "   Please start nchain first: cd ../nchain && cargo run -- node --api-port 8080"
    exit 1
fi

echo "✅ nchain blockchain is running"
echo ""

# Get the first wallet address (we'll use it as contract owner)
echo "📝 Getting wallet address from blockchain..."
WALLET_RESPONSE=$(curl -s http://localhost:8080/api/wallets)
WALLET_ADDRESS=$(echo $WALLET_RESPONSE | grep -o '"address":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$WALLET_ADDRESS" ]; then
    echo "⚠️  No wallet found, creating one..."
    curl -s -X POST http://localhost:8080/api/wallets \
        -H "Content-Type: application/json" \
        -d '{"name":"Contract Owner"}' > /dev/null

    # Get the newly created wallet
    WALLET_RESPONSE=$(curl -s http://localhost:8080/api/wallets)
    WALLET_ADDRESS=$(echo $WALLET_RESPONSE | grep -o '"address":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "✅ Using wallet: $WALLET_ADDRESS"
echo ""

# Note: The nchain blockchain doesn't currently support contract deployment via API
# This is a simplified version - in a real implementation, you would:
# 1. Convert WASM to base64
# 2. POST to /api/contracts with the bytecode
# 3. Get back the contract ID

echo "========================================="
echo "  ⚠️  Manual Contract Deployment Needed"
echo "========================================="
echo ""
echo "The nchain blockchain requires manual contract deployment."
echo "For development, you can:"
echo ""
echo "1. Use the backend API without contract IDs (it will work for basic testing)"
echo "2. Or manually deploy contracts using the nchain CLI:"
echo ""
echo "   cd ../../nchain"
echo "   cargo run -- deploy-contract GemNFT ../web3-marketplace/contracts/gem-nft/gem_nft.wasm $WALLET_ADDRESS"
echo "   cargo run -- deploy-contract Marketplace ../web3-marketplace/contracts/marketplace/gem_marketplace.wasm $WALLET_ADDRESS"
echo ""
echo "3. Then update the contract IDs in ../backend/.env:"
echo "   GEM_NFT_CONTRACT_ID=<contract-id>"
echo "   MARKETPLACE_CONTRACT_ID=<contract-id>"
echo ""
echo "========================================="
echo "  ✅ For Now: Testing Without Contracts"
echo "========================================="
echo ""
echo "The marketplace frontend and backend will work for basic testing"
echo "without deployed contracts. You can:"
echo ""
echo "- ✅ Connect wallet"
echo "- ✅ View marketplace UI"
echo "- ✅ Test API endpoints"
echo ""
echo "To enable full functionality (minting, trading), deploy contracts first."
echo ""
