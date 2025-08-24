#!/bin/bash

echo "=== RESUME TEMPLATE ANALYSIS ==="
echo "Checking all templates for form field alignment and page break handling..."
echo ""

# Required form fields based on schema
REQUIRED_FIELDS=(
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

# Page break related patterns
PAGE_BREAK_PATTERNS=(
    "page-break-inside"
    "page-break-before" 
    "page-break-after"
    "break-inside"
    "break-before"
    "break-after"
)

cd /home/tu2l/Repositories/resume-helper

for template in public/templates/html/*.html; do
    template_name=$(basename "$template" .html)
    echo "=== ANALYZING: $template_name.html ==="
    
    echo "📋 Form Fields Used:"
    for field in "${REQUIRED_FIELDS[@]}"; do
        if grep -q "{{{$field}}}\|{{#if $field}}\|{{#each $field}}" "$template"; then
            echo "  ✅ $field"
        else
            echo "  ❌ $field (MISSING)"
        fi
    done
    
    echo ""
    echo "📄 Page Break Handling:"
    page_break_found=false
    for pattern in "${PAGE_BREAK_PATTERNS[@]}"; do
        if grep -q "$pattern" "$template"; then
            echo "  ✅ Uses $pattern"
            page_break_found=true
        fi
    done
    
    if [ "$page_break_found" = false ]; then
        echo "  ❌ NO page break handling found"
    fi
    
    echo ""
    echo "🔧 Common Issues Check:"
    
    # Check for proper page-break-inside: avoid on sections
    if ! grep -q "page-break-inside.*avoid\|break-inside.*avoid" "$template"; then
        echo "  ⚠️  Missing page-break-inside: avoid on sections"
    fi
    
    # Check for section containers
    if ! grep -q "class.*section" "$template"; then
        echo "  ⚠️  No section containers found for organization"
    fi
    
    # Check for proper A4 dimensions
    if ! grep -q "210mm\|8\.5in" "$template"; then
        echo "  ⚠️  Missing A4 width specification"
    fi
    
    # Check for print media queries
    if ! grep -q "@media print" "$template"; then
        echo "  ⚠️  No print-specific styles"
    fi
    
    echo ""
    echo "----------------------------------------"
    echo ""
done

echo "=== ANALYSIS COMPLETE ==="
