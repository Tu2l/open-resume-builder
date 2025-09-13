#!/bin/bash

# Add New Template Tool
# This script helps you add a new template to the configuration

echo "🎨 Add New Template Tool"
echo "======================="

if [ "$#" -ne 5 ]; then
    echo "Usage: $0 <template-id> <template-name> <description> <category> <feature1,feature2,feature3>"
    echo ""
    echo "Categories: traditional, modern, creative, professional, specialized"
    echo ""
    echo "Example:"
    echo "  $0 corporate 'Corporate Style' 'Conservative design for traditional industries' professional 'Conservative styling,Traditional layout,Business-focused'"
    exit 1
fi

TEMPLATE_ID="$1"
TEMPLATE_NAME="$2"
DESCRIPTION="$3"
CATEGORY="$4"
FEATURES="$5"

CONFIG_FILE="public/templates/templates.json"
HTML_FILE="public/templates/html/$TEMPLATE_ID.html"
THUMBNAIL_FILE="public/templates/thumbnails/$TEMPLATE_ID.svg"

# Validate category
if [[ ! "$CATEGORY" =~ ^(traditional|modern|creative|professional|specialized)$ ]]; then
    echo "❌ Invalid category: $CATEGORY"
    echo "Valid categories: traditional, modern, creative, professional, specialized"
    exit 1
fi

# Check if template already exists
if grep -q "\"id\":[[:space:]]*\"$TEMPLATE_ID\"" "$CONFIG_FILE"; then
    echo "❌ Template ID already exists in configuration: $TEMPLATE_ID"
    exit 1
fi

# Check if HTML file exists
html_exists=false
if [ -f "$HTML_FILE" ]; then
    echo "⚠️  Template HTML file already exists: $HTML_FILE"
    read -p "❓ Do you want to add it to configuration anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Operation cancelled"
        exit 1
    fi
    html_exists=true
fi

# Check if thumbnail file exists
thumbnail_exists=false
if [ -f "$THUMBNAIL_FILE" ]; then
    echo "⚠️  Template thumbnail file already exists: $THUMBNAIL_FILE"
    thumbnail_exists=true
fi

# Convert comma-separated features to JSON array
IFS=',' read -ra FEATURE_ARRAY <<< "$FEATURES"
FEATURES_JSON="["
for i in "${!FEATURE_ARRAY[@]}"; do
    if [ $i -gt 0 ]; then
        FEATURES_JSON+=", "
    fi
    FEATURES_JSON+="\"${FEATURE_ARRAY[$i]}\""
done
FEATURES_JSON+="]"

# Create basic thumbnail template only if it doesn't exist
if [ "$thumbnail_exists" = false ]; then
cat > "$THUMBNAIL_FILE" << 'EOF'
<svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Base background -->
    <rect width="400" height="560" fill="#FFFFFF"/>
    
    <!-- Header area -->
    <rect x="40" y="40" width="320" height="30" rx="4" fill="#374151"/>
    <rect x="40" y="80" width="150" height="8" rx="2" fill="#9CA3AF"/>
    
    <!-- Content sections -->
    <rect x="40" y="110" width="100" height="12" rx="4" fill="#6B7280"/>
    <rect x="40" y="130" width="320" height="6" rx="2" fill="#E5E7EB"/>
    <rect x="40" y="145" width="280" height="6" rx="2" fill="#E5E7EB"/>
    <rect x="40" y="160" width="200" height="6" rx="2" fill="#E5E7EB"/>
    
    <rect x="40" y="190" width="100" height="12" rx="4" fill="#6B7280"/>
    <rect x="40" y="210" width="320" height="6" rx="2" fill="#E5E7EB"/>
    <rect x="40" y="225" width="250" height="6" rx="2" fill="#E5E7EB"/>
    
    <rect x="40" y="255" width="100" height="12" rx="4" fill="#6B7280"/>
    <rect x="40" y="275" width="150" height="15" rx="7" fill="#F3F4F6"/>
    <rect x="200" y="275" width="120" height="15" rx="7" fill="#F3F4F6"/>
    
    <!-- Add custom styling here to match your template design -->
</svg>
EOF
fi

# Create basic HTML template only if it doesn't exist
if [ "$html_exists" = false ]; then
cat > "$HTML_FILE" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$TEMPLATE_NAME Resume Template</title>
    <style>
        /* A4 Standard Print Styles */
        @page {
            size: A4 portrait;
            margin: 15mm 20mm 15mm 20mm;
        }
        
        @media print {
            body { 
                font-size: 10pt; 
                line-height: 1.2;
                color: #000 !important;
                margin: 0;
            }
            .resume-container {
                box-shadow: none;
                margin: 0;
                padding: 0;
            }
        }
        
        /* Enhanced Page Break Handling */
        .section {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem;
        }
        
        .experience-item, .education-item, .project-item, .certification-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 0.8rem;
        }
        
        /* Base styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2d3748;
            background-color: #f7fafc;
            line-height: 1.5;
            font-size: 11pt;
            margin: 0;
            padding: 20px;
        }
        
        .resume-container {
            width: 210mm;
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            min-height: 297mm;
            padding: 25mm 30mm;
        }
        
        /* Add your custom styles here */
    </style>
</head>
<body>
    <div class="resume-container">
        <!-- Header -->
        <header class="header">
            <h1>{{{fullName}}}</h1>
            <div class="contact-info">
                <div>{{{email}}} | {{{phone}}} #if{{location}}| {{{location}}}</div>
                {{#if website}}<div><a href="{{{website}}}">{{{website}}}</a></div>{{/if}}
                {{#if linkedin}}<div><a href="{{{linkedin}}}">LinkedIn</a></div>{{/if}}
                {{#if github}}<div><a href="{{{github}}}">GitHub</a></div>{{/if}}
            </div>
        </header>

        <!-- Summary -->
        {{#if summary}}
        <section class="section">
            <h2>Summary</h2>
            <p>{{{summary}}}</p>
        </section>
        {{/if}}

        <!-- Experience -->
        {{#if experience}}
        <section class="section">
            <h2>Experience</h2>
            {{#each experience}}
            <div class="experience-item">
                <h3>{{{title}}}</h3>
                <div>{{{company}}}{{#if location}}, {{{location}}}{{/if}} | {{{startDate}}} - {{{endDate}}}</div>
                {{#if responsibilities}}
                <ul>
                    {{#each responsibilities}}
                    <li>{{{this}}}</li>
                    {{/each}}
                </ul>
                {{/if}}
            </div>
            {{/each}}
        </section>
        {{/if}}

        <!-- Education -->
        {{#if education}}
        <section class="section">
            <h2>Education</h2>
            {{#each education}}
            <div class="education-item">
                <h3>{{{degree}}}</h3>
                <div>{{{institution}}}{{#if location}}, {{{location}}}{{/if}} | {{{graduationDate}}}</div>
            </div>
            {{/each}}
        </section>
        {{/if}}

        <!-- Skills -->
        {{#if skills}}
        <section class="section">
            <h2>Skills</h2>
            <div>{{{skills}}}</div>
        </section>
        {{/if}}

        <!-- Projects -->
        {{#if projects}}
        <section class="section">
            <h2>Projects</h2>
            {{#each projects}}
            <div class="project-item">
                <h3>{{{name}}}</h3>
                <p>{{{description}}}</p>
                {{#if technologies}}<div>Technologies: {{{technologies}}}</div>{{/if}}
                {{#if url}}<a href="{{{url}}}">View Project</a>{{/if}}
            </div>
            {{/each}}
        </section>
        {{/if}}

        <!-- Certifications -->
        {{#if certifications}}
        <section class="section">
            <h2>Certifications</h2>
            {{#each certifications}}
            <div class="certification-item">
                <h3>{{{name}}}</h3>
                {{#if issuer}}<div>{{{issuer}}}{{#if date}} | {{{date}}}{{/if}}</div>{{/if}}
                {{#if url}}<a href="{{{url}}}">View Certificate</a>{{/if}}
            </div>
            {{/each}}
        </section>
        {{/if}}
    </div>
</body>
</html>
EOF
fi

# Add to configuration
python3 -c "
import json
import sys

# Read current config
with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)

# Add new template
new_template = {
    'id': '$TEMPLATE_ID',
    'name': '$TEMPLATE_NAME',
    'description': '$DESCRIPTION',
    'category': '$CATEGORY',
    'thumbnail': '$TEMPLATE_ID.svg',
    'features': $FEATURES_JSON
}

config['templates'].append(new_template)

# Write back
with open('$CONFIG_FILE', 'w') as f:
    json.dump(config, f, indent=2)

print('✅ Template added to configuration')
"

echo "✅ Template '$TEMPLATE_NAME' has been added to configuration!"
echo ""
echo "📁 Files:"
if [ "$html_exists" = true ]; then
    echo "   - Used existing $HTML_FILE"
else
    echo "   - Created $HTML_FILE"
fi
if [ "$thumbnail_exists" = true ]; then
    echo "   - Used existing $THUMBNAIL_FILE"
else
    echo "   - Created $THUMBNAIL_FILE"
fi
echo "   - Updated $CONFIG_FILE"
echo ""
echo "🎨 Next steps:"
if [ "$html_exists" = true ] && [ "$thumbnail_exists" = true ]; then
    echo "   1. Both HTML template and thumbnail were already present"
    echo "   2. Test the template in the application"
elif [ "$html_exists" = false ] && [ "$thumbnail_exists" = false ]; then
    echo "   1. Customize the HTML template in $HTML_FILE"
    echo "   2. Design the thumbnail SVG in $THUMBNAIL_FILE"
    echo "   3. Test the template in the application"
elif [ "$html_exists" = false ]; then
    echo "   1. Customize the HTML template in $HTML_FILE"
    echo "   2. The thumbnail was already present"
    echo "   3. Test the template in the application"
else
    echo "   1. The HTML template was already present"
    echo "   2. Design the thumbnail SVG in $THUMBNAIL_FILE"
    echo "   3. Test the template in the application"
fi
echo "   4. Run ./scripts/validate-templates.sh to verify everything is correct"
