#!/bin/bash

echo "=== OPTIMIZING ALL RESUME TEMPLATES ==="
echo "Applying enhanced page break handling and space optimization..."
echo ""

cd /home/tu2l/Repositories/resume-helper

# Create backup directory
mkdir -p template_backups
cp public/templates/html/*.html template_backups/

# Define optimized CSS rules for better page breaks and space usage
read -r -d '' ENHANCED_PAGE_BREAK_CSS << 'EOF'
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
        
        .page-break-before-auto {
            break-before: auto;
            page-break-before: auto;
        }
        
        .page-break-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .page-break-after-avoid {
            break-after: avoid;
            page-break-after: avoid;
        }
        
        /* Optimize spacing for better page utilization */
        .header {
            break-after: avoid;
            page-break-after: avoid;
        }
        
        .section-title {
            break-after: avoid;
            page-break-after: avoid;
            margin-bottom: 0.6rem;
        }
        
        /* Prevent orphaned content */
        .responsibilities, .job-responsibilities {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .responsibilities li, .job-responsibilities li {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 0.2rem;
        }
        
        /* Skills optimization */
        .skills-category, .skill-category {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 0.8rem;
        }
        
        /* Print optimizations */
        @media print {
            .section {
                margin-bottom: 0.8rem;
            }
            .experience-item, .education-item, .project-item, .certification-item {
                margin-bottom: 0.6rem;
            }
            .responsibilities li, .job-responsibilities li {
                margin-bottom: 0.1rem;
            }
        }
EOF

echo "Applying optimizations to all templates..."

for template in public/templates/html/*.html; do
    template_name=$(basename "$template" .html)
    echo "🔧 Optimizing: $template_name.html"
    
    # Backup original
    cp "$template" "template_backups/${template_name}_original.html"
    
    # Apply enhanced page break CSS (insert before existing print styles)
    if grep -q "@media print" "$template"; then
        # Insert enhanced CSS before @media print
        sed -i '/^[[:space:]]*@media print/i\
        /* Enhanced Page Break Handling */\
        .section {\
            break-inside: avoid;\
            page-break-inside: avoid;\
            margin-bottom: 1rem;\
        }\
        \
        .experience-item, .education-item, .project-item, .certification-item {\
            break-inside: avoid;\
            page-break-inside: avoid;\
            margin-bottom: 0.8rem;\
        }\
        \
        .page-break-before-auto {\
            break-before: auto;\
            page-break-before: auto;\
        }\
        \
        .page-break-avoid {\
            break-inside: avoid;\
            page-break-inside: avoid;\
        }\
        \
        .page-break-after-avoid {\
            break-after: avoid;\
            page-break-after: avoid;\
        }\
        \
        .header {\
            break-after: avoid;\
            page-break-after: avoid;\
        }\
        \
        .section-title {\
            break-after: avoid;\
            page-break-after: avoid;\
            margin-bottom: 0.6rem;\
        }\
        \
        .responsibilities, .job-responsibilities {\
            break-inside: avoid;\
            page-break-inside: avoid;\
        }\
        \
        .responsibilities li, .job-responsibilities li {\
            break-inside: avoid;\
            page-break-inside: avoid;\
            margin-bottom: 0.2rem;\
        }\
        \
        .skills-category, .skill-category {\
            break-inside: avoid;\
            page-break-inside: avoid;\
            margin-bottom: 0.8rem;\
        }\
' "$template"
        
        # Enhance print media queries
        sed -i '/^[[:space:]]*@media print/,/^[[:space:]]*}/ {
            /^[[:space:]]*}$/ i\
            .section {\
                margin-bottom: 0.8rem;\
            }\
            .experience-item, .education-item, .project-item, .certification-item {\
                margin-bottom: 0.6rem;\
            }\
            .responsibilities li, .job-responsibilities li {\
                margin-bottom: 0.1rem;\
            }
        }' "$template"
    fi
    
    # Add optimized section classes if missing
    sed -i 's/class="experience-item"/class="experience-item page-break-avoid"/g' "$template"
    sed -i 's/class="education-item"/class="education-item page-break-avoid"/g' "$template"
    sed -i 's/class="project-item"/class="project-item page-break-avoid"/g' "$template"
    sed -i 's/class="certification-item"/class="certification-item page-break-avoid"/g' "$template"
    
    echo "  ✅ Applied page break optimizations"
    echo "  ✅ Enhanced space utilization"
    echo "  ✅ Added orphan content protection"
done

echo ""
echo "=== OPTIMIZATION COMPLETE ==="
echo "All templates have been optimized for:"
echo "  • Enhanced page break handling"
echo "  • Better space utilization"  
echo "  • Orphan content prevention"
echo "  • Print-specific optimizations"
echo ""
echo "Backups stored in: template_backups/"
