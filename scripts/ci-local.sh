#!/bin/bash
set -e

echo "🔍 Running complete CI/CD pipeline locally..."
echo "=============================================="

# Change to project directory
cd "$(dirname "$0")/.."

# Detect package manager
if [ -f "yarn.lock" ]; then
    MANAGER="yarn"
    COMMAND="install"
    RUNNER="yarn"
elif [ -f "package.json" ]; then
    MANAGER="npm"
    COMMAND="ci"
    RUNNER="npx --no-install"
else
    echo "❌ Unable to determine package manager"
    exit 1
fi

echo "📦 Package manager: $MANAGER"
echo ""

# Step 1: Clean
echo "🧹 Step 1: Cleaning previous artifacts..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Step 2: Install dependencies
echo ""
echo "📥 Step 2: Installing dependencies..."
$MANAGER $COMMAND

# Step 3: Type checking
echo ""
echo "🔍 Step 3: Type checking..."
$RUNNER tsc --noEmit

# Step 4: Linting (if ESLint is available)
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
    echo ""
    echo "📋 Step 4: Linting code..."
    $RUNNER next lint
else
    echo ""
    echo "⚠️  Step 4: Skipping linting (no ESLint config found)"
fi

# Step 5: Build
echo ""
echo "🔧 Step 5: Building application..."
$RUNNER next build

# Step 6: Verify build output
echo ""
echo "✅ Step 6: Verifying build output..."
if [ -d "out" ]; then
    echo "📁 Static export created successfully in 'out' directory"
    echo "📊 Build size:"
    du -sh out/
else
    echo "❌ Build failed - no output directory found"
    exit 1
fi

echo ""
echo "🎉 All CI/CD steps completed successfully!"
echo ""
echo "To test the build locally:"
echo "  npx serve out -p 3000"
echo "  or"
echo "  cd out && python -m http.server 3000"