# Resume Builder Scripts

This directory contains automation scripts for managing the resume template system and release management.

## Release Management

### `create-release.sh`
**Purpose**: Create release branches and tags with automated versioning
```bash
./create-release.sh
```

**Features**:
- Interactive version creation with MM.YYYY.increment format
- Automatic increment detection (finds next available number)
- Creates release branch (e.g., `release-03.2025.1`)
- Creates annotated git tag (e.g., `v03.2025.1`)
- Optional release naming
- Safety checks for clean working directory
- Automatic push to origin (optional)
- Triggers GitHub Actions deployment workflow

**Version Format**: `MM.YYYY.increment`
- **MM**: Month (01-12)
- **YYYY**: Year (2020-2050)
- **increment**: Auto-incremented number starting from 1

**Example Session**:
```bash
./create-release.sh

🚀 Resume Builder Release Creator
=================================

Enter release month (MM) [default: 09]: 03
Enter release year (YYYY) [default: 2025]: 2025
Enter increment number [default: 1]: 1
Enter release name (optional): Spring Launch

Release Summary:
  Version: 03.2025.1
  Branch:  release-03.2025.1
  Tag:     v03.2025.1
  Name:    Spring Launch

Create this release? (y/N): y
```

**Workflow Integration**:
- Release branches automatically trigger GitHub Pages deployment
- Tags provide version tracking and rollback points
- Follows semantic versioning for clear release identification

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

# 2. Run the release script
./create-release.sh

# 3. Follow interactive prompts
# - Enter month, year, increment
# - Optionally name the release
# - Confirm creation
# - Optionally push to origin

# 4. Monitor GitHub Actions for deployment
# Visit: https://github.com/Tu2l/resume-helper/actions
```

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
- Clean working directory (recommended)
- Push access to repository

### Template Scripts
### Template Scripts
- Bash shell
- Read/write access to `public/templates/` directory
- `jq` command for JSON processing (for some scripts)

## Integration

### Release Integration
- **GitHub Actions**: `release-*` branches trigger automatic deployment
- **Git Tags**: Provide version tracking and release history
- **GitHub Pages**: Automated deployment to production environment

### Template Integration
### Template Integration
- **JSON Configuration**: `public/templates/templates.json`
- **HTML Templates**: `public/templates/html/*.html`
- **SVG Thumbnails**: `public/templates/thumbnails/*.svg`
- **React Components**: Dynamic loading system picks up changes automatically

Changes made by template scripts are immediately available in the application without requiring code compilation or server restart.
