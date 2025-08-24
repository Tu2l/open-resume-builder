#!/bin/bash

echo "=== CLEANING RESUME TEMPLATES ==="
echo "Removing any additional fields not in the standard schema..."
echo ""

cd /home/tu2l/Repositories/resume-helper

# Standard form fields based on schema
STANDARD_FIELDS=(
    "fullName"
    "email" 
    "phone"
    "website"
    "linkedin"
    "github"
    "summary"
    "experience"
    "education"
    "skills"
    "projects"
    "certifications"
)

# Experience sub-fields
EXPERIENCE_FIELDS=(
    "company"
    "location"
    "title"
    "startDate"
    "endDate"
    "responsibilities"
)

# Education sub-fields
EDUCATION_FIELDS=(
    "institution"
    "location"
    "degree"
    "graduationDate"
)

# Projects sub-fields
PROJECT_FIELDS=(
    "name"
    "description"
    "technologies"
    "url"
)

# Certifications sub-fields
CERTIFICATION_FIELDS=(
    "name"
    "issuer"
    "date"
    "url"
)

echo "Analyzing templates for non-standard fields..."

for template in public/templates/html/*.html; do
    template_name=$(basename "$template" .html)
    echo "🔍 Checking: $template_name.html"
    
    # Extract all template variables used
    template_vars=$(grep -oE '{{(#if |#each |/)?[a-zA-Z_][a-zA-Z0-9_]*}}|{{{[a-zA-Z_][a-zA-Z0-9_]*}}}' "$template" | \
                   sed 's/{{#if //g; s/{{#each //g; s/{{#//g; s/{{///g; s/\}}}//g; s/\}}//g; s|/||g' | \
                   sort | uniq | grep -v '^$')
    
    non_standard_fields=()
    
    # Check each variable against standard fields
    while IFS= read -r var; do
        if [[ -n "$var" ]]; then
            # Skip if it's a standard top-level field
            if [[ " ${STANDARD_FIELDS[*]} " == *" $var "* ]]; then
                continue
            fi
            
            # Skip if it's a standard sub-field
            if [[ " ${EXPERIENCE_FIELDS[*]} " == *" $var "* ]] || \
               [[ " ${EDUCATION_FIELDS[*]} " == *" $var "* ]] || \
               [[ " ${PROJECT_FIELDS[*]} " == *" $var "* ]] || \
               [[ " ${CERTIFICATION_FIELDS[*]} " == *" $var "* ]]; then
                continue
            fi
            
            # Skip template helpers and common terms
            if [[ "$var" == "this" ]] || [[ "$var" == "each" ]] || [[ "$var" == "if" ]] || [[ "$var" == "else" ]]; then
                continue
            fi
            
            non_standard_fields+=("$var")
        fi
    done <<< "$template_vars"
    
    if [ ${#non_standard_fields[@]} -gt 0 ]; then
        echo "  ⚠️  Found non-standard fields: ${non_standard_fields[*]}"
        
        # Create backup
        cp "$template" "template_backups/${template_name}_before_cleanup.html"
        
        # Remove sections with non-standard fields
        for field in "${non_standard_fields[@]}"; do
            echo "    🧹 Removing sections using: $field"
            
            # Remove complete sections that use this field
            sed -i "/{{#if $field}}/,/{{\/if}}/d" "$template"
            sed -i "/{{#each $field}}/,/{{\/each}}/d" "$template"
            
            # Remove individual field references
            sed -i "s/\{\{\{$field\}\}\}//g" "$template"
            sed -i "/{{#if $field}}/d" "$template"
            
            # Clean up any orphaned closing tags or empty lines
            sed -i '/^[[:space:]]*$/d' "$template"
        done
        
        echo "  ✅ Cleaned template"
    else
        echo "  ✅ Template is clean - uses only standard fields"
    fi
    
    echo ""
done

echo "=== CLEANUP COMPLETE ==="
echo "All templates now use only standard schema fields:"
echo "Contact: fullName, email, phone, website, linkedin, github"
echo "Content: summary, experience, education, skills, projects, certifications"
echo ""
echo "Backups of modified templates stored in: template_backups/"
