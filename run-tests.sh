#!/bin/bash

# Test runner for nchain Web3 Marketplace
# Run after all services are started

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         nchain Web3 Marketplace - Test Suite            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if services are running
echo -e "${BLUE}━━━ Checking Services ━━━${NC}"
echo ""

BLOCKCHAIN_OK=false
BACKEND_OK=false
FRONTEND_OK=false

echo -n "Blockchain (port 8080)... "
if curl -s http://localhost:8080/api/blockchain/info > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    BLOCKCHAIN_OK=true
else
    echo -e "${RED}✗${NC}"
fi

echo -n "Backend API (port 3000)... "
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    BACKEND_OK=true
else
    echo -e "${RED}✗${NC}"
fi

echo -n "Frontend (port 5173)... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    FRONTEND_OK=true
else
    echo -e "${RED}✗${NC}"
fi

if ! $BLOCKCHAIN_OK || ! $BACKEND_OK || ! $FRONTEND_OK; then
    echo ""
    echo -e "${YELLOW}⚠ Some services are not running!${NC}"
    echo ""
    echo "Please start all services first:"
    echo "  Terminal 1: cd nchain && cargo run --release -- node --api-port 8080 --p2p-port 9000"
    echo "  Terminal 2: cd nchain/web3-marketplace/backend && npm run dev"
    echo "  Terminal 3: cd nchain/web3-marketplace/frontend && npm run dev"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All services are running!${NC}"

echo ""
echo -e "${BLUE}━━━ Blockchain Status ━━━${NC}"
echo ""
curl -s http://localhost:8080/api/blockchain/info | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8080/api/blockchain/info

echo ""
echo -e "${BLUE}━━━ Available Wallets ━━━${NC}"
echo ""
WALLETS=$(curl -s http://localhost:3000/api/users)
echo "$WALLETS" | python3 -m json.tool 2>/dev/null | head -30 || echo "$WALLETS"

# Get Alice's address
ALICE=$(echo "$WALLETS" | python3 -c "import sys, json; data = json.load(sys.stdin); print([w['address'] for w in data['data'] if w['name'] == 'Alice'][0])" 2>/dev/null || echo "48175356aa0b5e87")

echo ""
echo -e "${GREEN}Testing with Alice's wallet: $ALICE${NC}"

echo ""
echo -e "${BLUE}━━━ Minting Test Gems ━━━${NC}"
echo ""

for GEM in "Ruby Dragon" "Sapphire Phoenix" "Emerald Crown"; do
    echo -n "Minting: $GEM... "
    RESULT=$(curl -s -X POST http://localhost:3000/api/gems/mint \
        -H "Content-Type: application/json" \
        -d "{\"owner\": \"$ALICE\", \"name\": \"$GEM\"}")

    if echo "$RESULT" | grep -q "success.*true"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    sleep 0.3
done

echo ""
echo -e "${BLUE}━━━ Gem Collection ━━━${NC}"
echo ""
curl -s "http://localhost:3000/api/gems/owner/$ALICE" | python3 -m json.tool 2>/dev/null | head -50

echo ""
echo -e "${BLUE}━━━ Statistics ━━━${NC}"
echo ""
curl -s http://localhost:3000/api/gems/stats/supply | python3 -m json.tool 2>/dev/null

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Tests Complete!                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "What to do next:"
echo "  • Open http://localhost:5173 in your browser"
echo "  • Click 'Connect Wallet'"
echo "  • Go to 'My Gems' to see your collection"
echo "  • Mint more gems from the 'Mint' page"
echo ""
echo -e "${CYAN}Happy testing! 💎✨${NC}"
echo ""
