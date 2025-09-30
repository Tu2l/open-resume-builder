#!/bin/bash
set -e

echo "🚀 Replicating GitHub Actions build process locally..."
echo "=================================================="

# Change to project directory
cd "$(dirname "$0")/.."

# Detect package manager (same logic as GitHub Actions)
if [ -f "yarn.lock" ]; then
    MANAGER="yarn"
    COMMAND="install"
    RUNNER="yarn"
    echo "📦 Detected package manager: yarn"
elif [ -f "package.json" ]; then
    MANAGER="npm"
    COMMAND="ci"
    RUNNER="npx --no-install"
    echo "📦 Detected package manager: npm"
else
    echo "❌ Unable to determine package manager"
    exit 1
fi

echo ""
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf out

echo ""
echo "📥 Installing dependencies with: $MANAGER $COMMAND"
$MANAGER $COMMAND

echo ""
echo "🔧 Building with Next.js: $RUNNER next build"
$RUNNER next build

echo ""
echo "✅ Build completed successfully!"
echo "📁 Static files are in the 'out' directory"
echo ""
echo "To serve locally:"
echo "  npx serve out"
echo "  or"
echo "  python -m http.server 8000 --directory out"