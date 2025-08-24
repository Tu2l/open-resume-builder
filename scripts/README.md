# Template Management Scripts

This directory contains automation scripts for managing the resume template system.

## Core Scripts

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

## Utility Scripts

### `clean_templates.sh`
**Purpose**: Clean up template files and optimize storage
- Removes temporary files
- Optimizes file sizes
- Cleans up backup files

### `optimize_templates.sh`
**Purpose**: Optimize template performance and file sizes
- Minifies HTML templates
- Optimizes SVG thumbnails
- Compresses assets

### `analyze_templates.sh`
**Purpose**: Analyze template usage and performance
- Reports template statistics
- Analyzes file sizes
- Provides system health metrics

## Usage Workflow

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

# Clean up temporary files
./clean_templates.sh

# Optimize for performance
./optimize_templates.sh

# Get system statistics
./analyze_templates.sh
```

## Script Requirements

All scripts require:
- Bash shell
- Read/write access to `public/templates/` directory
- `jq` command for JSON processing (for some scripts)

## Error Handling

All scripts include:
- Input validation
- File existence checks
- Backup creation before modifications
- Rollback capabilities on failure
- Clear error messages and guidance

## Integration

These scripts integrate with:
- **JSON Configuration**: `public/templates/templates.json`
- **HTML Templates**: `public/templates/html/*.html`
- **SVG Thumbnails**: `public/templates/thumbnails/*.svg`
- **React Components**: Dynamic loading system picks up changes automatically

Changes made by these scripts are immediately available in the application without requiring code compilation or server restart.
