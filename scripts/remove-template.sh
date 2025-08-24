#!/bin/bash

# Remove Template Tool
# This script helps you remove a template from the configuration

echo "🗑️  Remove Template Tool"
echo "======================="

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <template-id>"
    echo ""
    echo "Example:"
    echo "  $0 corporate"
    exit 1
fi

TEMPLATE_ID="$1"

CONFIG_FILE="public/templates/templates.json"
HTML_FILE="public/templates/html/$TEMPLATE_ID.html"
THUMBNAIL_FILE="public/templates/thumbnails/$TEMPLATE_ID.svg"

# Check if template exists
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Template HTML file not found: $HTML_FILE"
fi

if [ ! -f "$THUMBNAIL_FILE" ]; then
    echo "❌ Template thumbnail file not found: $THUMBNAIL_FILE"
fi

if ! grep -q "\"id\":[[:space:]]*\"$TEMPLATE_ID\"" "$CONFIG_FILE"; then
    echo "❌ Template ID not found in configuration: $TEMPLATE_ID"
    exit 1
fi

echo "🔍 Found template: $TEMPLATE_ID"

# Show template info
echo "📄 Template details:"
python3 -c "
import json

with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)

for template in config['templates']:
    if template['id'] == '$TEMPLATE_ID':
        print(f\"   Name: {template['name']}\")
        print(f\"   Description: {template['description']}\")
        print(f\"   Category: {template['category']}\")
        print(f\"   Features: {', '.join(template['features'])}\")
        break
"

echo ""
read -p "❓ Are you sure you want to remove this template? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled"
    exit 1
fi

# Remove HTML file if it exists
if [ -f "$HTML_FILE" ]; then
    rm "$HTML_FILE"
    echo "✅ Removed HTML file: $HTML_FILE"
fi

# Remove thumbnail file if it exists
if [ -f "$THUMBNAIL_FILE" ]; then
    rm "$THUMBNAIL_FILE"
    echo "✅ Removed thumbnail file: $THUMBNAIL_FILE"
fi

# Remove from configuration
python3 -c "
import json

with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)

# Remove template with matching ID
config['templates'] = [t for t in config['templates'] if t['id'] != '$TEMPLATE_ID']

with open('$CONFIG_FILE', 'w') as f:
    json.dump(config, f, indent=2)

print('✅ Removed template from configuration')
"

echo ""
echo "✅ Template '$TEMPLATE_ID' has been removed!"
echo ""
echo "📊 Run ./scripts/validate-templates.sh to verify the changes"
