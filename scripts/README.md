# Resume Builder Scripts

This directory contains automation scripts for managing the resume template system and release management.

## Release Management

### `create-release.sh`
**Purpose**: Create release branches and tags with intelligent versioning and package.json integration
```bash
./create-release.sh
```

**Key Features**:
- **Smart package.json integration**: Auto-reads project info and suggests versions
- **Intelligent version parsing**: Converts `"version": "2025.09"` to month=09, year=2025
- **Duplicate prevention**: Prevents creating versions that already exist
- **Auto-increment detection**: Finds next available number automatically
- **Recent releases display**: Shows existing releases to help choose increment
- **Simple and reliable**: Streamlined code for better reliability
- **GitHub Actions integration**: Automatically triggers deployment

**Package.json Integration**:
The script automatically reads from `package.json`:
- `version`: Parsed for month/year suggestions (e.g., "2025.09" → 09.2025)
- `versionName`: Suggested as release name (e.g., "Open Beta") 

**Version Format**: `MM.YYYY.increment`
- **MM**: Month (01-12)
- **YYYY**: Year (2020-2050) 
- **increment**: Auto-incremented number starting from 1

**Example Session**:
```bash
./create-release.sh

🚀 Resume Builder Release Creator
================================

[INFO] Reading package.json...
[INFO] Found version in package.json: 09.2025

Existing releases for 09.2025:
  v09.2025.1
  v09.2025.2

Release month (MM) [09]: 
Release year (YYYY) [2025]: 
Increment number [3]: 
Release name [Open Beta]: 

Release Summary:
  Version: 09.2025.3
  Branch:  release-09.2025.3
  Tag:     v09.2025.3
  Name:    Open Beta

Create this release? (y/N): y
```

**Requirements**:
- Bash shell
- Git repository with remote origin
- `jq` command (optional, for package.json parsing)

**Workflow Integration**:
- Release branches (`release-*`) automatically trigger GitHub Pages deployment
- Tags provide version tracking and rollback points
- Integrates with package.json for project metadata
- Prevents duplicate releases with intelligent conflict detection

## Template Management Scripts

### `add-template.sh`
**Purpose**: Add new templates to the system
```bash
./add-template.sh <id> <name> <description> <category> <features>
```
- Creates HTML template with basic structure
- Creates placeholder SVG thumbnail  
- Adds configuration entry to JSON
- Handles existing files gracefully

**Example**:
```bash
./add-template.sh luxury "Luxury Executive" "Premium design" professional "Luxury,Premium,Executive"
```

### `discover-templates.sh`
**Purpose**: Find HTML files not yet configured in the system
```bash
./discover-templates.sh
```
- Scans `public/templates/html/` for template files
- Shows which templates need configuration
- Provides suggested JSON configuration

### `validate-templates.sh`
**Purpose**: Verify system integrity and consistency
```bash
./validate-templates.sh
```
- Checks all JSON entries have corresponding HTML files
- Verifies all JSON entries have corresponding thumbnail files
- Ensures no orphaned files or missing dependencies
- Validates template IDs are unique and valid
- Confirms categories match allowed values

### `remove-template.sh`
**Purpose**: Safely remove templates from the system
```bash
./remove-template.sh <template-id>
```
- Removes HTML template file
- Removes SVG thumbnail file
- Removes configuration entry from JSON
- Shows confirmation before deletion

## Usage Workflows

### Creating a Release
```bash
# 1. Ensure your master branch is ready for release
git checkout master
git pull origin master

# 2. Install jq if not already installed (optional but recommended)
# On Ubuntu/Debian: sudo apt install jq
# On macOS: brew install jq
# On Fedora: sudo dnf install jq

# 3. Run the release script from project root
./scripts/create-release.sh

# 4. Follow interactive prompts:
#    - Script will auto-suggest month/year from package.json
#    - Review existing releases for the period
#    - Choose increment number (auto-suggested)
#    - Optionally name the release
#    - Confirm creation
#    - Optionally push to origin

# 5. Monitor GitHub Actions for deployment
# Visit: https://github.com/Tu2l/resume-helper/actions
```

**Package.json Setup**:
For optimal script functionality, ensure your `package.json` contains:
```json
{
  "version": "YYYY.MM",
  "versionName": "Release Codename"
}
```

**Troubleshooting**:
- **"jq not found"**: Install jq package or continue without package.json parsing
- **"Version already exists"**: Choose a different increment number
- **"Not in git repository"**: Run from within your git repository
- **"Invalid octal number"**: Fixed in current version - script handles leading zeros properly

### Template Management

### Adding a New Template
```bash
# 1. Create template automatically
./add-template.sh startup "Startup Style" "Modern design" creative "Innovative,Modern"

# 2. Customize files (optional)
# Edit: public/templates/html/startup.html
# Edit: public/templates/thumbnails/startup.svg

# 3. Validate everything works
./validate-templates.sh
```

### Finding Unconfigured Templates
```bash
# If you manually created HTML files
./discover-templates.sh
# Shows suggested configuration for each unconfigured template
```

### System Maintenance
```bash
# Regular validation
./validate-templates.sh

## Script Requirements

### Release Scripts
- Bash shell
- Git repository with remote origin
- `jq` command (optional, for package.json parsing)
- Clean working directory (recommended)

### Template Scripts
### Template Scripts
- Bash shell
- Read/write access to `public/templates/` directory
- `jq` command for JSON processing (for some scripts)

## Integration

### Release Integration
- **GitHub Actions**: `release-*` branches trigger automatic deployment to GitHub Pages
- **Git Tags**: Provide version tracking, release history, and rollback points
- **Package.json**: Integration for project metadata and intelligent version suggestions
- **Conflict Prevention**: Duplicate detection prevents version conflicts and deployment issues

### Template Integration
### Template Integration
- **JSON Configuration**: `public/templates/templates.json`
- **HTML Templates**: `public/templates/html/*.html`
- **SVG Thumbnails**: `public/templates/thumbnails/*.svg`
- **React Components**: Dynamic loading system picks up changes automatically

Changes made by template scripts are immediately available in the application without requiring code compilation or server restart.
