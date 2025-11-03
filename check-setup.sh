#!/bin/bash

# Pre-Run Setup Check Script
# Checks if setup.sh has been run and shows animated waiting indicator if not

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Animated spinner function
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    local message=$2

    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " ${CYAN}[${spinstr:0:1}]${NC} ${message}\r"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
    done
    printf "    \r"
}

# Pulsing dots animation
pulse_dots() {
    local duration=$1
    local message=$2
    local end_time=$((SECONDS + duration))

    while [ $SECONDS -lt $end_time ]; do
        for dots in "   " ".  " ".. " "..." ".. " ".  "; do
            echo -ne "\r${CYAN}${message}${dots}${NC}"
            sleep 0.3
            if [ $SECONDS -ge $end_time ]; then
                break 2
            fi
        done
    done
    echo ""
}

# Check if setup has been completed
check_setup_complete() {
    if [ ! -f ".setup_complete" ]; then
        return 1
    fi

    if [ ! -d "nchain" ]; then
        return 1
    fi

    if [ ! -d "web3-marketplace/backend" ]; then
        return 1
    fi

    if [ ! -d "web3-marketplace/frontend" ]; then
        return 1
    fi

    return 0
}

# Main check
if check_setup_complete; then
    echo -e "${GREEN}✓ Setup completed successfully!${NC}"

    # Show setup completion date if available
    if [ -f ".setup_complete" ]; then
        setup_date=$(cat .setup_complete | cut -d'=' -f2)
        echo -e "${CYAN}  Completed: ${setup_date}${NC}"
    fi

    exit 0
else
    clear
    echo ""
    echo -e "${RED}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                          ║${NC}"
    echo -e "${RED}║              ⚠️  SETUP NOT COMPLETED YET ⚠️               ║${NC}"
    echo -e "${RED}║                                                          ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}You need to run the setup script first!${NC}"
    echo ""
    echo -e "${CYAN}Run these commands:${NC}"
    echo ""
    echo -e "  ${MAGENTA}chmod +x setup.sh${NC}"
    echo -e "  ${MAGENTA}./setup.sh${NC}"
    echo ""
    echo -e "${YELLOW}The setup will:${NC}"
    echo -e "  ${CYAN}▸${NC} Clone the nchain blockchain repository"
    echo -e "  ${CYAN}▸${NC} Build the blockchain (Rust)"
    echo -e "  ${CYAN}▸${NC} Install backend dependencies"
    echo -e "  ${CYAN}▸${NC} Install frontend dependencies"
    echo -e "  ${CYAN}▸${NC} Create configuration files"
    echo ""
    echo -e "${BLUE}⏱️  Setup takes about 5-10 minutes on first run${NC}"
    echo ""

    # Show animated waiting message
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    pulse_dots 5 "  Waiting for setup to complete"
    echo ""
    echo -e "${YELLOW}Cannot continue without completing setup first.${NC}"
    echo ""

    exit 1
fi
