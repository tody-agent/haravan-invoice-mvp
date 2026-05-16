#!/bin/bash
set -e

echo "=== Haravan Invoice — Integration Test Suite ==="
echo ""

cd /Volumes/Data/Invoice

echo "📦 Installing dependencies..."
pnpm install
echo ""

echo "🔍 Type checking..."
pnpm typecheck
echo "✅ Type check passed"
echo ""

echo "🧪 Running API tests..."
cd apps/api && pnpm test && cd ../..
echo "✅ API tests passed"
echo ""

echo "🧪 Running shared tests..."
cd packages/shared && pnpm test && cd ../..
echo "✅ Shared tests passed"
echo ""

echo "🧪 Running portal tests..."
cd apps/portal && pnpm test && cd ../..
echo "✅ Portal tests passed"
echo ""

echo "📊 Running coverage..."
pnpm test:run -- --coverage
echo ""

echo "=== All integration tests passed ==="
