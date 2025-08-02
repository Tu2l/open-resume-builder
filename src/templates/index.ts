// Define template types
type TemplateName = 'classic' | 'modern' | 'creative';

// Template cache to store loaded templates
const templateCache: Record<string, string> = {};

/**
 * Load a template from the public directory
 * @param templateName The name of the template to load
 * @returns The template HTML string
 */
const loadTemplate = async (templateName: TemplateName): Promise<string> => {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  const url = `/templates/html/${templateName}.html`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Template Load Error Body:", errorBody);
    throw new Error(`Template Load Error: ${response.statusText}`);
  }

  const html = await response.text();
  templateCache[templateName] = html;
  return html;
};



// Individual template exports
export const classicTemplate = loadTemplate('classic');
export const modernTemplate = loadTemplate('modern');
export const creativeTemplate = loadTemplate('creative');
