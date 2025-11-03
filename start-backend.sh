#!/bin/bash

# Start Backend API with Setup Check

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🚀 Starting Backend API...${NC}"
echo ""

# Check if setup is complete
if ! bash check-setup.sh; then
    exit 1
fi

echo -e "${GREEN}✓ Setup verified!${NC}"
echo ""
echo -e "${CYAN}Starting backend on:${NC}"
echo -e "  ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd web3-marketplace/backend
npm run dev
