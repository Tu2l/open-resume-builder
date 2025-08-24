import { getBaseUrl } from "@/lib/utils";

// Define template types
type TemplateName = 
  | 'classic' 
  | 'modern' 
  | 'creative' 
  | 'minimalist'
  | 'professional'
  | 'executive'
  | 'technical'
  | 'two-column'
  | 'elegant'
  | 'compact'
  | 'modern-executive'
  | 'academic'
  | 'sales';

// Template metadata for display in UI
export interface TemplateInfo {
  id: TemplateName;
  name: string;
  description: string;
  category: 'traditional' | 'modern' | 'creative' | 'professional' | 'specialized';
  features: string[];
}

// Available templates with metadata
export const availableTemplates: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format with clean typography',
    category: 'traditional',
    features: ['Clean layout', 'Professional typography', 'ATS-friendly']
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with subtle styling',
    category: 'modern',
    features: ['Modern design', 'Color accents', 'Professional']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic template for creative professionals',
    category: 'creative',
    features: ['Colorful design', 'Creative elements', 'Portfolio-friendly']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple design with maximum readability',
    category: 'modern',
    features: ['Minimal design', 'Excellent readability', 'Clean lines']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate-style template with gradient header',
    category: 'professional',
    features: ['Corporate style', 'Gradient header', 'Professional colors']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated template for senior-level positions',
    category: 'professional',
    features: ['Executive styling', 'Elegant typography', 'Premium look']
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Developer-focused template with code aesthetics',
    category: 'specialized',
    features: ['Tech-focused', 'Code-style fonts', 'Developer-friendly']
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Space-efficient layout with sidebar',
    category: 'modern',
    features: ['Two-column layout', 'Space efficient', 'Sidebar design']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with decorative elements',
    category: 'creative',
    features: ['Elegant styling', 'Decorative elements', 'Artistic flair']
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Optimized for maximum content in minimal space',
    category: 'specialized',
    features: ['Space-optimized', 'Compact layout', 'Content-heavy']
  },
  {
    id: 'modern-executive',
    name: 'Modern Executive',
    description: 'Contemporary executive template with gradient design',
    category: 'professional',
    features: ['Executive level', 'Modern gradient', 'Leadership focus']
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research-focused template for academics',
    category: 'specialized',
    features: ['Academic format', 'Publication focus', 'Research-oriented']
  },
  {
    id: 'sales',
    name: 'Sales Professional',
    description: 'Performance-focused template for sales roles',
    category: 'specialized',
    features: ['Metrics-focused', 'Achievement highlights', 'Sales-optimized']
  }
];

// Template cache to store loaded templates
const templateCache: Record<string, string> = {};

/**
 * Load a template from the public directory
 * @param templateName The name of the template to load
 * @returns The template HTML string
 */
export const loadTemplate = async (templateName: TemplateName): Promise<string> => {
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
export const getTemplateInfo = (templateId: TemplateName): TemplateInfo | undefined => {
  return availableTemplates.find(template => template.id === templateId);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: TemplateInfo['category']): TemplateInfo[] => {
  return availableTemplates.filter(template => template.category === category);
};

// Individual template exports
export const classicTemplate = loadTemplate('classic');
export const modernTemplate = loadTemplate('modern');
export const creativeTemplate = loadTemplate('creative');
export const minimalistTemplate = loadTemplate('minimalist');
export const professionalTemplate = loadTemplate('professional');
export const executiveTemplate = loadTemplate('executive');
export const technicalTemplate = loadTemplate('technical');
export const twoColumnTemplate = loadTemplate('two-column');
export const elegantTemplate = loadTemplate('elegant');
export const compactTemplate = loadTemplate('compact');
export const modernExecutiveTemplate = loadTemplate('modern-executive');
export const academicTemplate = loadTemplate('academic');
export const salesTemplate = loadTemplate('sales');
