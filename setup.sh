#!/bin/bash
set -e

echo "================================"
echo "Installing Backend Dependencies"
echo "================================"
cd /Users/sahilmane/Documents/GitHub/sharemarket_n8n/backend
bun install

echo ""
echo "================================"
echo "Installing Frontend Dependencies"
echo "================================"
cd /Users/sahilmane/Documents/GitHub/sharemarket_n8n/frontend
bun install

echo ""
echo "================================"
echo "Building Backend TypeScript"
echo "================================"
cd /Users/sahilmane/Documents/GitHub/sharemarket_n8n/backend
bun run build

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Backend server: cd backend && bun run dev"
echo "Frontend dev: cd frontend && bun run dev"
echo ""
echo "Make sure MongoDB is running on localhost:27017"
