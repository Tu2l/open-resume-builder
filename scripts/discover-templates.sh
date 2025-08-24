#!/bin/bash

# Auto-discover templates script
# This script scans for HTML files and shows which ones are missing from configuration

echo "🔍 Template Auto-Discovery"
echo "========================"

CONFIG_FILE="public/templates/templates.json"
HTML_DIR="public/templates/html"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Configuration file not found: $CONFIG_FILE"
    exit 1
fi

if [ ! -d "$HTML_DIR" ]; then
    echo "❌ HTML directory not found: $HTML_DIR"
    exit 1
fi

echo "📁 Scanning for HTML templates..."

# Get all HTML files
HTML_FILES=$(ls "$HTML_DIR"/*.html 2>/dev/null | xargs -I {} basename {} .html)

if [ -z "$HTML_FILES" ]; then
    echo "❌ No HTML template files found in $HTML_DIR"
    exit 1
fi

# Extract template IDs from JSON
CONFIG_IDS=$(grep -o '"id":[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/"id":[[:space:]]*"\([^"]*\)"/\1/')

echo "🗂️  Found HTML templates:"
for file in $HTML_FILES; do
    echo "   - $file.html"
done

echo ""
echo "🗂️  Templates in configuration:"
for id in $CONFIG_IDS; do
    echo "   - $id"
done

echo ""
echo "🔍 Discovery Results:"

# Find HTML files without config entries
missing_from_config=()
for file in $HTML_FILES; do
    if ! echo "$CONFIG_IDS" | grep -q "^$file$"; then
        missing_from_config+=("$file")
    fi
done

if [ ${#missing_from_config[@]} -eq 0 ]; then
    echo "✅ All HTML templates are configured!"
else
    echo "📝 Templates found but not in configuration:"
    for template in "${missing_from_config[@]}"; do
        echo "   - $template"
        
        # Try to extract title from HTML file for better name suggestion
        html_file="$HTML_DIR/$template.html"
        title=$(grep -i "<title>" "$html_file" | head -1 | sed 's/.*<title>\(.*\)<\/title>.*/\1/' | sed 's/ Resume Template//g' | sed 's/ Template//g')
        
        if [ -n "$title" ] && [ "$title" != "$template" ]; then
            suggested_name="$title"
        else
            # Convert template ID to title case
            suggested_name=$(echo "$template" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
        fi
        
        echo "     Suggested configuration:"
        echo "     {"
        echo "       \"id\": \"$template\","
        echo "       \"name\": \"$suggested_name\","
        echo "       \"description\": \"[Add description here]\","
        echo "       \"category\": \"[traditional|modern|creative|professional|specialized]\","
        echo "       \"features\": [\"[Feature 1]\", \"[Feature 2]\", \"[Feature 3]\"]"
        echo "     }"
        echo ""
    done
    
    echo "💡 To add these templates:"
    echo "   1. Use: ./scripts/add-template.sh <id> <name> <description> <category> <features>"
    echo "   2. Or manually add the configuration to $CONFIG_FILE"
fi

echo ""
echo "📊 Summary:"
echo "   HTML files found: $(echo "$HTML_FILES" | wc -l)"
echo "   Configured templates: $(echo "$CONFIG_IDS" | wc -l)"
echo "   Missing from config: ${#missing_from_config[@]}"
