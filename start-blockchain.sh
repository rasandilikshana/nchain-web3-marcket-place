#!/bin/bash

# Start Blockchain with Setup Check

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🚀 Starting Blockchain Node...${NC}"
echo ""

# Check if setup is complete
if ! bash check-setup.sh; then
    exit 1
fi

echo -e "${GREEN}✓ Setup verified!${NC}"
echo ""
echo -e "${CYAN}Starting blockchain on:${NC}"
echo -e "  ${YELLOW}API Port:${NC} 8080"
echo -e "  ${YELLOW}P2P Port:${NC} 9000"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd nchain
cargo run --release -- node --api-port 8080 --p2p-port 9000
