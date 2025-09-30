#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to validate date format
validate_date() {
    local date_input="$1"
    if [[ ! "$date_input" =~ ^[0-9]{8}$ ]]; then
        return 1
    fi
    
    # Extract year, month, day
    local year="${date_input:0:4}"
    local month="${date_input:4:2}"
    local day="${date_input:6:2}"
    
    # Basic validation
    if [ "$month" -lt 1 ] || [ "$month" -gt 12 ]; then
        return 1
    fi
    
    if [ "$day" -lt 1 ] || [ "$day" -gt 31 ]; then
        return 1
    fi
    
    return 0
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
}

# Function to check if working directory is clean
check_working_directory() {
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Working directory is not clean!"
        echo "Uncommitted changes:"
        git status --short
        echo
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Aborting release creation."
            exit 1
        fi
    fi
}

# Function to check if branch exists
branch_exists() {
    git show-ref --verify --quiet "refs/heads/$1"
}

# Function to check if tag exists
tag_exists() {
    git show-ref --verify --quiet "refs/tags/$1"
}

# Function to get next increment number for a given month/year
get_next_increment() {
    local month="$1"
    local year="$2"
    local pattern="release-$month\\.$year\\."
    
    # Get all branches matching the pattern and extract increment numbers
    local max_increment=0
    while IFS= read -r branch; do
        if [[ "$branch" =~ $pattern([0-9]+)$ ]]; then
            local increment="${BASH_REMATCH[1]}"
            if [ "$increment" -gt "$max_increment" ]; then
                max_increment="$increment"
            fi
        fi
    done < <(git branch -a | sed 's/^[* ]*//' | sed 's/remotes\/origin\///')
    
    # Also check tags
    while IFS= read -r tag; do
        if [[ "$tag" =~ ^v$month\\.$year\\.([0-9]+)$ ]]; then
            local increment="${BASH_REMATCH[1]}"
            if [ "$increment" -gt "$max_increment" ]; then
                max_increment="$increment"
            fi
        fi
    done < <(git tag -l)
    
    echo $((max_increment + 1))
}

# Main script
main() {
    print_info "🚀 Resume Builder Release Creator"
    echo "================================="
    echo
    
    # Check prerequisites
    check_git_repo
    check_working_directory
    
    # Get current date for defaults
    current_month=$(date +"%m")
    current_year=$(date +"%Y")
    
    # Get month input
    while true; do
        read -p "Enter release month (MM) [default: $current_month]: " month_input
        month_input=${month_input:-$current_month}
        
        if [[ "$month_input" =~ ^[0-9]{1,2}$ ]] && [ "$month_input" -ge 1 ] && [ "$month_input" -le 12 ]; then
            # Pad with zero if single digit
            month=$(printf "%02d" "$month_input")
            break
        else
            print_error "Please enter a valid month (1-12)"
        fi
    done
    
    # Get year input
    while true; do
        read -p "Enter release year (YYYY) [default: $current_year]: " year_input
        year_input=${year_input:-$current_year}
        
        if [[ "$year_input" =~ ^[0-9]{4}$ ]] && [ "$year_input" -ge 2020 ] && [ "$year_input" -le 2050 ]; then
            year="$year_input"
            break
        else
            print_error "Please enter a valid year (2020-2050)"
        fi
    done
    
    # Get next increment number
    next_increment=$(get_next_increment "$month" "$year")
    
    # Get increment input
    while true; do
        read -p "Enter increment number [default: $next_increment]: " increment_input
        increment_input=${increment_input:-$next_increment}
        
        if [[ "$increment_input" =~ ^[0-9]+$ ]] && [ "$increment_input" -gt 0 ]; then
            increment="$increment_input"
            break
        else
            print_error "Please enter a valid positive number"
        fi
    done
    
    # Create version string
    version="$month.$year.$increment"
    
    # Get release name (optional)
    read -p "Enter release name (optional): " release_name
    
    # Create branch and tag names
    branch_name="release-$version"
    tag_name="v$version"
    
    # Display summary
    echo
    print_info "Release Summary:"
    echo "  Version: $version"
    echo "  Branch:  $branch_name"
    echo "  Tag:     $tag_name"
    if [ -n "$release_name" ]; then
        echo "  Name:    $release_name"
    fi
    echo
    
    # Check if branch or tag already exists
    if branch_exists "$branch_name"; then
        print_error "Branch '$branch_name' already exists!"
        exit 1
    fi
    
    if tag_exists "$tag_name"; then
        print_error "Tag '$tag_name' already exists!"
        exit 1
    fi
    
    # Confirm creation
    read -p "Create this release? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Release creation cancelled."
        exit 0
    fi
    
    # Get current branch
    current_branch=$(git branch --show-current)
    print_info "Creating release from current branch: $current_branch"
    
    # Create and switch to release branch
    print_info "Creating release branch: $branch_name"
    if git checkout -b "$branch_name"; then
        print_success "Release branch '$branch_name' created successfully"
    else
        print_error "Failed to create release branch"
        exit 1
    fi
    
    # Create annotated tag
    print_info "Creating release tag: $tag_name"
    tag_message="Release $version"
    if [ -n "$release_name" ]; then
        tag_message="$tag_message - $release_name"
    fi
    tag_message="$tag_message

Version: $month.$year.$increment
Created on: $(date)
From branch: $current_branch"
    
    if git tag -a "$tag_name" -m "$tag_message"; then
        print_success "Release tag '$tag_name' created successfully"
    else
        print_error "Failed to create release tag"
        exit 1
    fi
    
    echo
    print_success "🎉 Release created successfully!"
    echo
    print_info "Next steps:"
    echo "  1. Push the release branch: git push origin $branch_name"
    echo "  2. Push the tag: git push origin $tag_name"
    echo "  3. The GitHub Actions workflow will automatically deploy when you push the branch"
    echo
    
    # Offer to push automatically
    read -p "Push release branch and tag to origin now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Pushing release branch..."
        if git push origin "$branch_name"; then
            print_success "Release branch pushed successfully"
        else
            print_error "Failed to push release branch"
        fi
        
        print_info "Pushing release tag..."
        if git push origin "$tag_name"; then
            print_success "Release tag pushed successfully"
            print_info "🚀 Deployment should start automatically via GitHub Actions"
        else
            print_error "Failed to push release tag"
        fi
    fi
    
    echo
    print_success "Release process completed! 🎊"
}

# Run main function
main "$@"