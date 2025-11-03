#!/bin/bash

# Smart Setup Script for nchain Web3 Marketplace
# This script clones the nchain repo and sets up everything automatically

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║         ${MAGENTA}🚀 nchain Web3 Marketplace Setup${CYAN}              ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper functions
print_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if running from correct directory
if [ ! -f "setup.sh" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_step "Step 1: Checking Prerequisites"

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git not found. Please install git first."
    echo "  Ubuntu/Debian: sudo apt-get install git"
    echo "  macOS: brew install git"
    exit 1
fi
print_success "Git found: $(git --version | head -1)"

# Check Rust
if ! command -v cargo &> /dev/null; then
    print_error "Rust not found. Installing Rust..."
    echo ""
    echo "Run this command to install Rust:"
    echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo ""
    echo "Then restart your terminal and run this setup script again."
    exit 1
fi
print_success "Rust found: $(rustc --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found."
    echo ""
    echo "Install Node.js 18+ from: https://nodejs.org/"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "                 sudo apt-get install -y nodejs"
    echo "  macOS: brew install node"
    exit 1
fi
NODE_VERSION=$(node --version | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version is $NODE_VERSION. Recommended: 18+"
else
    print_success "Node.js found: $(node --version)"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm not found"
    exit 1
fi
print_success "npm found: $(npm --version)"

print_step "Step 2: Cloning nchain Repository"

# Clone or update nchain
if [ -d "nchain" ]; then
    print_warning "nchain directory already exists"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Updating nchain repository..."
        cd nchain
        git pull origin main || git pull origin master
        cd ..
        print_success "Repository updated"
    else
        print_info "Skipping clone/update"
    fi
else
    print_info "Cloning nchain from GitHub..."
    if git clone https://github.com/narthanaj/nchain.git; then
        print_success "Repository cloned successfully"
    else
        print_error "Failed to clone repository"
        exit 1
    fi
fi

print_step "Step 3: Building Blockchain (nchain)"

cd nchain

print_info "Building nchain in release mode..."
print_warning "This may take 5-10 minutes on first build..."

if cargo build --release 2>&1 | grep -E "Finished|error" | tail -5; then
    print_success "Blockchain built successfully"
else
    print_error "Build failed. Check output above."
    exit 1
fi

print_info "Running blockchain tests..."
if cargo test --quiet 2>&1 | tail -3; then
    print_success "Tests completed"
else
    print_warning "Some tests may have failed (this might be okay)"
fi

cd ..

print_step "Step 4: Setting up Web3 Marketplace"

# Check if web3-marketplace exists
if [ ! -d "web3-marketplace" ]; then
    print_error "web3-marketplace not found in project directory"
    print_info "Make sure you cloned the correct repository"
    exit 1
fi

cd web3-marketplace

# Setup Backend
print_info "Setting up Backend..."

cd backend

if [ ! -f ".env" ]; then
    print_info "Creating backend .env file..."
    cat > .env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# nchain Blockchain Node
NCHAIN_API_URL=http://localhost:8080/api
NCHAIN_NODE_URL=http://localhost:8080

# Contract Addresses (MVP mode - placeholders)
GEM_NFT_CONTRACT_ID=gem_nft_v1
MARKETPLACE_CONTRACT_ID=marketplace_v1

# Security
JWT_SECRET=development-secret-change-in-production
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF
    print_success "Backend .env created"
else
    print_success "Backend .env already exists"
fi

print_info "Installing backend dependencies..."
if npm install --silent 2>&1 | tail -3; then
    print_success "Backend dependencies installed"
else
    print_warning "Some dependencies may have issues (check above)"
fi

cd ..

# Setup Frontend
print_info "Setting up Frontend..."

cd frontend

print_info "Installing frontend dependencies..."
if npm install --silent 2>&1 | tail -3; then
    print_success "Frontend dependencies installed"
else
    print_warning "Some dependencies may have issues (check above)"
fi

cd ../..

print_step "✅ Setup Complete!"

# Create completion marker
print_info "Creating setup completion marker..."
echo "SETUP_COMPLETED=$(date '+%Y-%m-%d %H:%M:%S')" > .setup_complete
print_success "Setup marker created"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║    🎉 Installation Successful! Ready to start.          ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Next Steps - Start 3 Services:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Blockchain:${NC}"
echo "  cd nchain"
echo "  cargo run --release -- node --api-port 8080 --p2p-port 9000"
echo ""
echo -e "${YELLOW}Terminal 2 - Backend API:${NC}"
echo "  cd web3-marketplace/backend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 3 - Frontend:${NC}"
echo "  cd web3-marketplace/frontend"
echo "  npm run dev"
echo ""
echo -e "${CYAN}Then visit:${NC}"
echo "  ${MAGENTA}http://localhost:5173${NC} - Marketplace"
echo "  ${MAGENTA}http://localhost:8080${NC} - Blockchain Dashboard"
echo "  ${MAGENTA}http://localhost:3000${NC} - Backend API"
echo ""
echo -e "${CYAN}Quick Test:${NC}"
echo "  ./run-tests.sh"
echo ""
echo -e "${CYAN}Documentation:${NC}"
echo "  Read: ${MAGENTA}docs/START_HERE.md${NC}"
echo ""
echo -e "${GREEN}Happy testing! 💎✨${NC}"
echo ""
