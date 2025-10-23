#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN} Setting up Project Ikodiomain...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED} Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED} Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN} Node.js version: $(node -v)${NC}"

# Install dependencies
echo -e "${YELLOW} Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED} Failed to install dependencies${NC}"
    exit 1
fi

# Build packages
echo -e "${YELLOW} Building packages...${NC}"
npm run build --workspace=packages/utils
npm run build --workspace=packages/ui

if [ $? -ne 0 ]; then
    echo -e "${RED} Failed to build packages${NC}"
    exit 1
fi

echo -e "${GREEN} Setup completed successfully!${NC}"
echo -e "${YELLOW} Available commands:${NC}"
echo -e "  npm run dev          - Start development servers"
echo -e "  npm run build        - Build all packages and apps"
echo -e "  npm run lint         - Lint all code"
echo -e "  npm run test         - Run tests"
echo -e "${GREEN} Happy coding!${NC}"