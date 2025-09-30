#!/bin/bash

# Simple Resume Builder Release Creator
# Creates release branches and tags with MM.YYYY.increment format

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Print functions
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Not in a git repository!"
    exit 1
fi

# Check if origin remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    error "No origin remote found!"
    exit 1
fi

# Check working directory
if [ -n "$(git status --porcelain)" ]; then
    warning "Working directory is not clean!"
    git status --short
    echo
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Aborted."
        exit 0
    fi
fi

echo "🚀 Resume Builder Release Creator"
echo "================================"
echo

# Read package.json if it exists
PACKAGE_MONTH=""
PACKAGE_YEAR=""
PACKAGE_NAME=""

if [ -f "package.json" ]; then
    if command -v jq > /dev/null 2>&1; then
        info "Reading package.json..."
        PACKAGE_VERSION=$(jq -r '.version // empty' package.json)
        PACKAGE_NAME=$(jq -r '.versionName // empty' package.json)
        
        # Parse version like "2025.09" to month=09, year=2025
        if [[ "$PACKAGE_VERSION" =~ ^([0-9]{4})\.([0-9]{1,2})$ ]]; then
            PACKAGE_YEAR="${BASH_REMATCH[1]}"
            PACKAGE_MONTH=$(printf "%02d" $((10#${BASH_REMATCH[2]})))
            info "Found version in package.json: $PACKAGE_MONTH.$PACKAGE_YEAR"
        fi
    else
        warning "jq not found - install it to read package.json automatically"
    fi
fi

# Get month
if [ -n "$PACKAGE_MONTH" ]; then
    read -p "Release month (MM) [$PACKAGE_MONTH]: " MONTH
    MONTH=${MONTH:-$PACKAGE_MONTH}
else
    CURRENT_MONTH=$(date +"%m")
    read -p "Release month (MM) [$CURRENT_MONTH]: " MONTH
    MONTH=${MONTH:-$CURRENT_MONTH}
fi

# Validate month
if ! [[ "$MONTH" =~ ^[0-9]{1,2}$ ]]; then
    error "Invalid month: $MONTH"
    exit 1
fi

# Convert to decimal to avoid octal issues, then validate range
MONTH_NUM=$((10#$MONTH))
if [ "$MONTH_NUM" -lt 1 ] || [ "$MONTH_NUM" -gt 12 ]; then
    error "Invalid month: $MONTH"
    exit 1
fi
MONTH=$(printf "%02d" "$MONTH_NUM")

# Get year
if [ -n "$PACKAGE_YEAR" ]; then
    read -p "Release year (YYYY) [$PACKAGE_YEAR]: " YEAR
    YEAR=${YEAR:-$PACKAGE_YEAR}
else
    CURRENT_YEAR=$(date +"%Y")
    read -p "Release year (YYYY) [$CURRENT_YEAR]: " YEAR
    YEAR=${YEAR:-$CURRENT_YEAR}
fi

# Validate year
if ! [[ "$YEAR" =~ ^[0-9]{4}$ ]] || [ "$YEAR" -lt 2020 ] || [ "$YEAR" -gt 2050 ]; then
    error "Invalid year: $YEAR"
    exit 1
fi

# Find next increment
MAX_INCREMENT=0
PATTERN="release-$MONTH\\.$YEAR\\."

# Check existing branches
while IFS= read -r branch; do
    branch=$(echo "$branch" | sed 's/^[* ]*//' | sed 's/remotes\/origin\///')
    if [[ "$branch" =~ ^$PATTERN([0-9]+)$ ]]; then
        INCREMENT="${BASH_REMATCH[1]}"
        if [ "$INCREMENT" -gt "$MAX_INCREMENT" ]; then
            MAX_INCREMENT="$INCREMENT"
        fi
    fi
done < <(git branch -a 2>/dev/null)

# Check existing tags
while IFS= read -r tag; do
    if [[ "$tag" =~ ^v$MONTH\\.$YEAR\\.([0-9]+)$ ]]; then
        INCREMENT="${BASH_REMATCH[1]}"
        if [ "$INCREMENT" -gt "$MAX_INCREMENT" ]; then
            MAX_INCREMENT="$INCREMENT"
        fi
    fi
done < <(git tag -l 2>/dev/null)

NEXT_INCREMENT=$((MAX_INCREMENT + 1))

# Show existing releases if any
if [ "$MAX_INCREMENT" -gt 0 ]; then
    info "Existing releases for $MONTH.$YEAR:"
    git tag -l | grep "^v$MONTH\\.$YEAR\\." | sort -V | tail -3 | sed 's/^/  /'
    echo
fi

# Get increment
read -p "Increment number [$NEXT_INCREMENT]: " INCREMENT
INCREMENT=${INCREMENT:-$NEXT_INCREMENT}

# Validate increment
if ! [[ "$INCREMENT" =~ ^[0-9]+$ ]] || [ "$INCREMENT" -lt 1 ]; then
    error "Invalid increment: $INCREMENT"
    exit 1
fi

# Build version
VERSION="$MONTH.$YEAR.$INCREMENT"
BRANCH_NAME="release-$VERSION"
TAG_NAME="v$VERSION"

# Get release name
if [ -n "$PACKAGE_NAME" ]; then
    read -p "Release name [$PACKAGE_NAME]: " RELEASE_NAME
    RELEASE_NAME=${RELEASE_NAME:-$PACKAGE_NAME}
else
    read -p "Release name (optional): " RELEASE_NAME
fi

# Check if version already exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" || git show-ref --verify --quiet "refs/tags/$TAG_NAME"; then
    error "Version $VERSION already exists!"
    exit 1
fi

# Show summary
echo
info "Release Summary:"
echo "  Version: $VERSION"
echo "  Branch:  $BRANCH_NAME"
echo "  Tag:     $TAG_NAME"
if [ -n "$RELEASE_NAME" ]; then
    echo "  Name:    $RELEASE_NAME"
fi
echo

# Confirm
read -p "Create this release? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    info "Cancelled."
    exit 0
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
info "Creating release from branch: $CURRENT_BRANCH"

# Create release branch
info "Creating release branch: $BRANCH_NAME"
if git checkout -b "$BRANCH_NAME"; then
    success "Release branch created"
else
    error "Failed to create release branch"
    exit 1
fi

# Create tag
info "Creating release tag: $TAG_NAME"
TAG_MESSAGE="Release $VERSION"
if [ -n "$RELEASE_NAME" ]; then
    TAG_MESSAGE="$TAG_MESSAGE - $RELEASE_NAME"
fi
TAG_MESSAGE="$TAG_MESSAGE

Created: $(date)
Source: $CURRENT_BRANCH"

if git tag -a "$TAG_NAME" -m "$TAG_MESSAGE"; then
    success "Release tag created"
else
    error "Failed to create release tag"
    exit 1
fi

echo
success "🎉 Release $VERSION created successfully!"
echo

# Offer to push
read -p "Push to origin now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Pushing release branch..."
    if git push origin "$BRANCH_NAME"; then
        success "Branch pushed"
    else
        error "Failed to push branch"
    fi
    
    info "Pushing release tag..."
    if git push origin "$TAG_NAME"; then
        success "Tag pushed"
        info "🚀 GitHub Actions deployment should start automatically"
    else
        error "Failed to push tag"
    fi
else
    info "Remember to push when ready:"
    echo "  git push origin $BRANCH_NAME"
    echo "  git push origin $TAG_NAME"
fi

echo
success "Done! 🎊"