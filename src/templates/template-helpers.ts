import Handlebars from "handlebars";

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
 * @param {JSON} data The data object containing values to inject into the template.
 * @returns {string} The rendered HTML string.
 */
export function renderSimpleTemplate(template: string, data: ResumeFormValues): string {
  // Notice - homegrown logic is replaced with handlebars.js to make it compatible with universal templates
  // Transform skills string into structured data for template compatibility
  const transformedData = {
    ...data,
    skills: data.skills ? data.skills.split(';').map(category => {
      const [categoryName, skillsList] = category.split(':');

      // Handle non-categorized skills (no colon separator)
      if (!skillsList) {
        return {
          category: '', // empty category for non-categorized skills
          items: categoryName.trim()
        };
      }

      // Handle categorized skills (with colon separator)
      if (!categoryName || !skillsList) return null;

      return {
        category: categoryName.trim(),
        items: skillsList.trim()
      };
    }).filter(Boolean) : []
  };
  const mappedTemplate = Handlebars.compile(template);
  return mappedTemplate(transformedData);
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
