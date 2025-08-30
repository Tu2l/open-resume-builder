import { getBaseUrl } from "@/lib/utils";

// Template metadata for display in UI
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
}

// Template configuration interface
interface TemplateConfig {
  templates: TemplateInfo[];
}

// Cache for loaded template configuration
let templateConfigCache: TemplateConfig | null = null;

/**
 * Load template configuration from JSON file
 */
const loadTemplateConfig = async (): Promise<TemplateConfig> => {
  if (templateConfigCache) {
    return templateConfigCache;
  }

  try {
    const url = `${getBaseUrl()}/templates/templates.json`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to load template config: ${response.statusText}`);
    }

    const config = await response.json() as TemplateConfig;
    templateConfigCache = config;
    return config;
  } catch (error) {
    console.error('Error loading template configuration:', error);
    // Fallback to empty configuration
    return { templates: [] };
  }
};

/**
 * Get all available templates
 */
export const getAvailableTemplates = async (): Promise<TemplateInfo[]> => {
  const config = await loadTemplateConfig();
  return config.templates;
};

// For backward compatibility, export availableTemplates as a promise
export const availableTemplates: Promise<TemplateInfo[]> = getAvailableTemplates();

// Template cache to store loaded templates
const templateCache: Record<string, string> = {};

/**
 * Load a template from the public directory
 * @param templateName The name of the template to load
 * @returns The template HTML string
 */
export const loadTemplate = async (templateName: string): Promise<string> => {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  const url = `${getBaseUrl()}/templates/html/${templateName}.html`;
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

/**
 * Get template info by ID
 */
export const getTemplateInfo = async (templateId: string): Promise<TemplateInfo | undefined> => {
  const templates = await getAvailableTemplates();
  return templates.find(template => template.id === templateId);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = async (category: string): Promise<TemplateInfo[]> => {
  const templates = await getAvailableTemplates();
  return templates.filter(template => template.category === category);
};

/**
 * Get all available categories with their templates
 */
export const getAllCategories = async (): Promise<Record<string, TemplateInfo[]>> => {
  const templates = await getAvailableTemplates();
  const categories: Record<string, TemplateInfo[]> = {};
  
  templates.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });
  
  return categories;
};

/**
 * Get list of unique category names
 */
export const getCategoryNames = async (): Promise<string[]> => {
  const templates = await getAvailableTemplates();
  const categorySet = new Set(templates.map(template => template.category));
  return Array.from(categorySet);
};

/**
 * Get all template IDs
 */
export const getTemplateIds = async (): Promise<string[]> => {
  const templates = await getAvailableTemplates();
  return templates.map(template => template.id);
};

/**
 * Get a specific template by ID - fully dynamic loading
 */
export const getTemplateById = async (templateId: string): Promise<string> => {
  // Verify the template exists in configuration
  const templateExists = await templateExistsInConfig(templateId);
  if (!templateExists) {
    throw new Error(`Template '${templateId}' not found in configuration`);
  }
  
  return loadTemplate(templateId);
};

/**
 * Check if template exists in configuration
 */
const templateExistsInConfig = async (templateId: string): Promise<boolean> => {
  const templates = await getAvailableTemplates();
  return templates.some(template => template.id === templateId);
};
