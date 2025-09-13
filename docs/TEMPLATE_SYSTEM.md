# Dynamic Template System - Technical Documentation

## Overview

The resume template system implements a fully dynamic architecture with zero hardcoded components. Templates and thumbnails are loaded at runtime from JSON configuration and file assets, enabling unlimited expansion without code modifications or recompilation.

## Architecture Principles

- **Configuration-Driven**: All template metadata stored in JSON
- **Lazy Loading**: Templates loaded on-demand with caching
- **Type Safety**: Full TypeScript integration with runtime validation
- **Hot Reloading**: Changes reflected immediately in development
- **Error Boundaries**: Graceful fallbacks for missing templates


## Asset Management
```
public/templates/
├── templates.json          # Central configuration
├── html/                   # Template implementations
│   ├── {id}.html          # Handlebars-compatible HTML
│   └── ...
└── thumbnails/             # Visual previews
    ├── {id}.svg           # SVG thumbnails
    └── ...
```

## Data Flow Architecture

```
Component Request → Config Cache → Asset Loading → Error Handling → UI Update
     ↓                  ↓              ↓               ↓             ↓
User Selection → JSON Fetch → HTML/SVG Load → Validation → Render/Display
```

### Detailed Flow:
1. **Initial Load**: Configuration fetched from `/templates/templates.json`
2. **Category Filter**: Templates organized by category for UI
3. **Thumbnail Display**: SVG files loaded dynamically via img src
4. **Template Selection**: HTML content loaded when user selects template
5. **Caching Strategy**: Both config and templates cached for performance
6. **Error Handling**: Graceful degradation for missing assets

## Template Requirements

### HTML Template Structure
Templates must follow Handlebars conventions and include all required fields:

```html
<!DOCTYPE html>
<html>
<head>
  <title>{{name}} Resume Template</title>
  <style>/* Template-specific CSS */</style>
</head>
<body>
  <!-- Contact Information -->
  <div class="contact">
    <h1>{{{fullName}}}</h1>
    <div>{{{email}}} | {{{phone}}}</div>
    {{#if location}}<div>{{location}}</div>
    {{#if website}}<div>{{{website}}}</div>{{/if}}
    {{#if linkedin}}<div>{{{linkedin}}}</div>{{/if}}
    {{#if github}}<div>{{{github}}}</div>{{/if}}
  </div>
  
  <!-- Summary Section -->
  {{#if summary}}
  <section>
    <h2>Summary</h2>
    <p>{{{summary}}}</p>
  </section>
  {{/if}}
  
  <!-- Experience Section -->
  {{#if experience}}
  <section>
    <h2>Experience</h2>
    {{#each experience}}
    <div class="experience-item">
      <h3>{{title}} - {{company}}</h3>
      <div>{{location}} | {{startDate}} - {{endDate}}</div>
      <ul>
        {{#each responsibilities}}
        <li>{{{this}}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </section>
  {{/if}}
  
  <!-- Education, Projects, Certifications follow similar pattern -->
</body>
</html>
```

### Required Data Schema
```typescript
interface ResumeData {
  // Contact Information
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  
  // Content Sections
  summary?: string
  experience?: ExperienceItem[]
  education?: EducationItem[]
  projects?: ProjectItem[]
  certifications?: CertificationItem[]
  skills?: string
}

interface ExperienceItem {
  company: string
  location: string
  title: string
  startDate: string
  endDate: string
  responsibilities: string[]
}
```

### SVG Thumbnail Requirements
- **Format**: Valid SVG with viewBox
- **Dimensions**: 300x400px recommended viewport
- **Naming**: Must match template ID exactly (`{id}.svg`)
- **Content**: Visual representation of template layout
- **Size**: Optimized for web (< 50KB recommended)

## Automation Scripts

### Core Management Scripts
Located in `scripts/` directory:

```bash
# Template lifecycle management
scripts/add-template.sh <id> <name> <description> <category> <features>
scripts/remove-template.sh <id>
scripts/discover-templates.sh
scripts/validate-templates.sh
```

### Script Integration
```bash
# Validation workflow
./scripts/validate-templates.sh
# Checks:
# - JSON syntax validity
# - Template-config consistency  
# - File existence verification
# - Field validation
# - Category validation

# Discovery workflow
./scripts/discover-templates.sh
# Scans for:
# - Unconfigured HTML files
# - Missing thumbnail files
# - Orphaned assets
# - Configuration suggestions
```

## Development Workflow

### Adding New Templates
1. **Create HTML Template**: Follow Handlebars field conventions
2. **Create SVG Thumbnail**: Visual representation of layout
3. **Update Configuration**: Add entry to `templates.json`
4. **Validate**: Run validation script
5. **Test**: Verify in development environment

### Template Modification
1. **Edit HTML/SVG**: Direct file modification
2. **Hot Reload**: Changes reflected immediately
3. **Validation**: Automatic in development mode
4. **Testing**: Use form data to verify rendering

### Configuration Changes
1. **JSON Updates**: Modify `templates.json`
2. **Schema Validation**: Automatic validation
3. **Cache Invalidation**: Automatic in development
4. **Type Safety**: TypeScript compilation catches errors

## 🚀 Real-World Example

Want to add a "Startup" template? Here's the complete process:

```bash
# 1. Create the template
./scripts/add-template.sh startup "Startup Style" "Modern template for startups" creative "Innovative,Tech-focused,Modern"

# 2. Customize the files (optional)
# - Edit public/templates/html/startup.html
# - Design public/templates/thumbnails/startup.svg

# 3. Validate (optional)
./scripts/validate-templates.sh

# 4. That's it! The template is now:
#    ✅ Available in the UI under "Creative" category
#    ✅ Selectable by users with visual thumbnail
#    ✅ Generates resumes when chosen
#    ✅ No code compilation needed
#    ✅ No developer intervention required
```

## 🎯 Best Practices

1. **Use descriptive IDs**: `modern-executive` not `template1`
2. **Keep features concise**: Maximum 3 features, keep them short
3. **Test thoroughly**: Verify template works with all form data
4. **Follow naming**: HTML and SVG filenames must exactly match ID
5. **Validate regularly**: Run `./validate-templates.sh` after changes
6. **Design consistent thumbnails**: Maintain similar style and size

## 🔍 Troubleshooting

### Template not appearing in UI?
```bash
./scripts/discover-templates.sh  # Check if it needs configuration
./scripts/validate-templates.sh  # Verify everything is correct
```

### Template fails to load?
- Check HTML filename matches ID exactly
- Verify JSON syntax in templates.json
- Check for typos in template placeholders
- Ensure SVG thumbnail exists and is valid

### Thumbnail not displaying?
- Check SVG file exists in `public/templates/thumbnails/`
- Verify thumbnail filename in JSON matches SVG file
- Ensure SVG is valid (open in browser to test)
