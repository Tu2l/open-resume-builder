#!/bin/bash

# Template Configuration Validator
# This script validates that all templates in the configuration have corresponding HTML files
# and that all HTML files have entries in the configuration.

echo "🔍 Template Configuration Validator"
echo "=================================="

CONFIG_FILE="public/templates/templates.json"
HTML_DIR="public/templates/html"
THUMBNAIL_DIR="public/templates/thumbnails"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Configuration file not found: $CONFIG_FILE"
    exit 1
fi

if [ ! -d "$HTML_DIR" ]; then
    echo "❌ HTML directory not found: $HTML_DIR"
    exit 1
fi

if [ ! -d "$THUMBNAIL_DIR" ]; then
    echo "❌ Thumbnail directory not found: $THUMBNAIL_DIR"
    exit 1
fi

echo "📄 Checking configuration file..."

# Extract template IDs from JSON
CONFIG_IDS=$(grep -o '"id":[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/"id":[[:space:]]*"\([^"]*\)"/\1/')

echo "🗂️  Templates in configuration:"
for id in $CONFIG_IDS; do
    echo "   - $id"
done

echo ""
echo "📁 Checking HTML files..."

# Get all HTML files
HTML_FILES=$(ls "$HTML_DIR"/*.html 2>/dev/null | xargs -I {} basename {} .html)

echo "🗂️  HTML files found:"
for file in $HTML_FILES; do
    echo "   - $file"
done

echo ""
echo "🖼️  Checking thumbnail files..."

# Get all thumbnail files
THUMBNAIL_FILES=$(ls "$THUMBNAIL_DIR"/*.svg 2>/dev/null | xargs -I {} basename {} .svg)

echo "🗂️  Thumbnail files found:"
for file in $THUMBNAIL_FILES; do
    echo "   - $file"
done

echo ""
echo "🔍 Validation Results:"

# Check if all config IDs have corresponding HTML files
missing_html=()
for id in $CONFIG_IDS; do
    if [ ! -f "$HTML_DIR/$id.html" ]; then
        missing_html+=("$id")
    fi
done

# Check if all config IDs have corresponding thumbnail files
missing_thumbnails=()
for id in $CONFIG_IDS; do
    if [ ! -f "$THUMBNAIL_DIR/$id.svg" ]; then
        missing_thumbnails+=("$id")
    fi
done

# Check if all HTML files have config entries
missing_config=()
for file in $HTML_FILES; do
    if ! echo "$CONFIG_IDS" | grep -q "^$file$"; then
        missing_config+=("$file")
    fi
done

# Check if all thumbnail files have config entries
missing_thumbnail_config=()
for file in $THUMBNAIL_FILES; do
    if ! echo "$CONFIG_IDS" | grep -q "^$file$"; then
        missing_thumbnail_config+=("$file")
    fi
done

# Report results
if [ ${#missing_html[@]} -eq 0 ] && [ ${#missing_thumbnails[@]} -eq 0 ] && [ ${#missing_config[@]} -eq 0 ] && [ ${#missing_thumbnail_config[@]} -eq 0 ]; then
    echo "✅ All templates are properly configured!"
else
    if [ ${#missing_html[@]} -gt 0 ]; then
        echo "❌ Templates in config missing HTML files:"
        for id in "${missing_html[@]}"; do
            echo "   - $id (expected: $HTML_DIR/$id.html)"
        done
    fi
    
    if [ ${#missing_thumbnails[@]} -gt 0 ]; then
        echo "❌ Templates in config missing thumbnail files:"
        for id in "${missing_thumbnails[@]}"; do
            echo "   - $id (expected: $THUMBNAIL_DIR/$id.svg)"
        done
    fi
    
    if [ ${#missing_config[@]} -gt 0 ]; then
        echo "❌ HTML files missing from configuration:"
        for file in "${missing_config[@]}"; do
            echo "   - $file.html (add to $CONFIG_FILE)"
        done
    fi
    
    if [ ${#missing_thumbnail_config[@]} -gt 0 ]; then
        echo "❌ Thumbnail files missing from configuration:"
        for file in "${missing_thumbnail_config[@]}"; do
            echo "   - $file.svg (add to $CONFIG_FILE)"
        done
    fi
    exit 1
fi

echo ""
echo "📊 Summary:"
echo "   Templates configured: $(echo "$CONFIG_IDS" | wc -l)"
echo "   HTML files found: $(echo "$HTML_FILES" | wc -l)"
echo "   Thumbnail files found: $(echo "$THUMBNAIL_FILES" | wc -l)"
echo "   Status: ✅ All templates valid"
