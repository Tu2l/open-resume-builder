/**
 * @fileoverview This file contains utility functions related to resume
 * template processing and data transformation.
 */

import type { ResumeFormValues } from '../lib/schema';

/**
 * A simple, custom Handlebars-like template renderer. It processes a template
 * string by replacing placeholders `{{{key}}}` and handling basic control
 * flow like `{{#if key}}...{{/if}}` and `{{#each key}}...{{/each}}`.
 *
 * NOTE: This is a simplified implementation and does not support all features
 * of a full templating engine like Handlebars.js. It's designed to be
 * lightweight and sufficient for the resume templates in this app.
 *
 * @param {string} template The template string to process.
 * @param {any} data The data object containing values to inject into the template.
 * @returns {string} The rendered HTML string.
 */
export function renderSimpleTemplate(template: string, data: any, depth = 0, maxDepth = 20): string {
    if (depth > maxDepth) {
        return template;
    }

    let output = template;

    // Helper function to find matching closing tag
    function findClosingTag(str: string, openTag: string, closeTag: string, startIndex: number): number {
        let depth = 1;
        let index = startIndex;
        
        while (index < str.length && depth > 0) {
            const nextOpen = str.indexOf(openTag, index);
            const nextClose = str.indexOf(closeTag, index);
            
            if (nextClose === -1) return -1;
            
            if (nextOpen !== -1 && nextOpen < nextClose) {
                depth++;
                index = nextOpen + openTag.length;
            } else {
                depth--;
                if (depth === 0) return nextClose;
                index = nextClose + closeTag.length;
            }
        }
        return -1;
    }

    // Process {{#each}} blocks
    let changed = true;
    while (changed) {
        changed = false;
        
        const eachStart = output.indexOf('{{#each ');
        if (eachStart === -1) break;
        
        const tagEnd = output.indexOf('}}', eachStart);
        if (tagEnd === -1) break;
        
        const key = output.substring(eachStart + 8, tagEnd).trim();
        const contentStart = tagEnd + 2;
        const eachEnd = findClosingTag(output, '{{#each ', '{{/each}}', contentStart);
        if (eachEnd === -1) break;
        
        const content = output.substring(contentStart, eachEnd);
        const list = data[key];
        
        let replacement = '';
        if (Array.isArray(list) && list.length > 0) {
            replacement = list.map((item, itemIndex) => {
                let itemContent = content;

                if (typeof item === 'string') {
                    const cleanItem = item.replace(/^-\s*/, '');
                    itemContent = itemContent.replace(/{{{this}}}/g, cleanItem);
                    
                    // Add separator for simple string lists
                    if (content.trim() === '{{{this}}}' && itemIndex < list.length - 1) {
                        itemContent += ', ';
                    }
                } else if (typeof item === 'object' && item !== null) {
                    const itemContext = { ...data, ...item };
                    itemContent = renderSimpleTemplate(itemContent, itemContext, depth + 1, maxDepth);
                }
                
                return itemContent;
            }).join('');
        }
        
        output = output.substring(0, eachStart) + replacement + output.substring(eachEnd + 9);
        changed = true;
    }

    // Process {{#if}} blocks
    changed = true;
    while (changed) {
        changed = false;
        
        const ifStart = output.indexOf('{{#if ');
        if (ifStart === -1) break;
        
        const tagEnd = output.indexOf('}}', ifStart);
        if (tagEnd === -1) break;
        
        const key = output.substring(ifStart + 6, tagEnd).trim();
        const contentStart = tagEnd + 2;
        const ifEnd = findClosingTag(output, '{{#if ', '{{/if}}', contentStart);
        if (ifEnd === -1) break;
        
        const content = output.substring(contentStart, ifEnd);
        const value = data[key];
        
        const isTruthy = Array.isArray(value) ? value.length > 0 : 
                        typeof value === 'string' ? value.trim().length > 0 :
                        typeof value === 'number' ? value !== 0 :
                        typeof value === 'boolean' ? value :
                        value != null;
        
        const replacement = isTruthy ? renderSimpleTemplate(content, data, depth + 1, maxDepth) : '';
        output = output.substring(0, ifStart) + replacement + output.substring(ifEnd + 7);
        changed = true;
    }

    // Handle special skills string format
    if (data.skills && typeof data.skills === 'string') {
        const skillsHtml = data.skills.split(';').map((category: string) => {
            const parts = category.trim().split(':');
            if (parts.length < 2) {
                return `<p class="skills-item">${category.trim()}</p>`;
            }
            const [title, skillsList] = parts;
            return `<div class="skills-category"><h4 class="skills-title">${title.trim()}</h4><p class="skills-list">${skillsList.trim()}</p></div>`;
        }).join('');
        output = output.replace(/{{{skills}}}/g, skillsHtml);
    }
    
    // Replace simple placeholders
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                const placeholder = `{{{${key}}}}`;
                while (output.includes(placeholder)) {
                    output = output.replace(placeholder, String(value));
                }
            }
        }
    }
    
    return output;
}


/**
 * Converts the structured resume form data into a plain text string.
 * This is useful for providing context to the AI model.
 *
 * @param {ResumeFormValues} data - The resume data from the form.
 * @returns {string} A plain text representation of the resume.
 */
export const getResumeAsPlainText = (data: ResumeFormValues): string => {
    const responsibilitiesToString = (responsibilities: string[]) => {
        return (responsibilities || []).map(r => `- ${r}`).join('\n');
    }
    
    return `
      ${data.fullName}
      ${data.email} | ${data.phone}
      ${data.website ? `Website: ${data.website}` : ''}
      ${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
      ${data.github ? `GitHub: ${data.github}` : ''}

      Summary:
      ${data.summary}

      Experience:
      ${data.experience.map(exp => `
        ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
        ${exp.location}
        Responsibilities:
        ${responsibilitiesToString(exp.responsibilities)}
      `).join('\n')}

      Projects:
      ${(data.projects || []).map(proj => `
        ${proj.name} (${proj.url || ''})
        Technologies: ${proj.technologies}
        Description: ${proj.description}
      `).join('\n')}
      
      Education:
      ${data.education.map(edu => `
        ${edu.degree} from ${edu.institution} (${edu.graduationDate})
        ${edu.location}
      `).join('\n')}

      Certifications:
      ${(data.certifications || []).map(cert => `
        ${cert.name} from ${cert.issuer || ''} (${cert.date || ''})
        ${cert.url ? `Verify: ${cert.url}` : ''}
      `).join('\n')}

      Skills:
      ${data.skills}
    `;
};
