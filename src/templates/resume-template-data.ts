/**
 * @fileoverview This file contains static data used throughout the application,
 * such as test data and template definitions.
 */

import type { ResumeFormValues } from '../lib/schema';
import { getAvailableTemplates, getTemplateById } from '@/templates';

/**
 * Defines the structure for a resume template.
 */
export interface ResumeTemplate {
  id: string;
  name: string;
  html: Promise<string>;
}

/**
 * Get all available resume templates dynamically from configuration
 */
export const getTemplates = async (): Promise<ResumeTemplate[]> => {
  const availableTemplates = await getAvailableTemplates();
  return availableTemplates.map(template => ({
    id: template.id,
    name: template.name,
    html: getTemplateById(template.id)
  }));
};

/**
 * Get a specific template by ID
 */
export const getTemplateByIdWithMetadata = async (templateId: string): Promise<ResumeTemplate | null> => {
  try {
    const availableTemplates = await getAvailableTemplates();
    const templateInfo = availableTemplates.find(t => t.id === templateId);
    
    if (!templateInfo) {
      return null;
    }

    return {
      id: templateInfo.id,
      name: templateInfo.name,
      html: getTemplateById(templateInfo.id)
    };
  } catch (error) {
    console.error(`Error loading template ${templateId}:`, error);
    return null;
  }
};

/**
 * For backward compatibility, export templates as a promise
 */
export const templates: Promise<ResumeTemplate[]> = getTemplates();

/**
 * Default values for the resume form. This ensures that all fields are initialized
 * properly, preventing issues with uncontrolled components in React.
 */
export const resumeFormDefaultValues: ResumeFormValues = {
  fullName: '', email: '', phone: '', website: '', linkedin: '', github: '', summary: '',
  experience: [{ company: '', location: '', title: '', startDate: '', endDate: '', responsibilities: [''] }],
  projects: [{ name: '', description: '', technologies: '', url: '' }],
  education: [{ institution: '', location: '', degree: '', graduationDate: '' }],
  certifications: [{ name: '', issuer: '', date: '', url: '' }],
  skills: '',
  template: 'modern',
};

/**
 * Pre-filled sample data for the resume form. Useful for testing and demonstrations.
 */
export const testData: ResumeFormValues = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '123-456-7890',
  website: 'https://janedoe.dev',
  linkedin: 'https://linkedin.com/in/janedoe',
  github: 'https://github.com/janedoe',
  summary: 'A passionate and creative professional with experience in project management and user-centric design. Eager to contribute to a collaborative team and build innovative solutions.',
  experience: [
    {
      company: 'Tech Solutions Inc.',
      location: 'New York, NY',
      title: 'Project Manager',
      startDate: 'Jan 2021',
      endDate: 'Present',
      responsibilities: [
        'Led a team of 10 to deliver a new enterprise software product on time and under budget.',
        'Managed project timelines, resources, and stakeholder communications.',
        'Improved project delivery efficiency by 15% by implementing Agile methodologies.'
      ],
    },
    {
      company: 'Innovate Co.',
      location: 'San Francisco, CA',
      title: 'UX Designer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      responsibilities: [
        'Designed and prototyped user interfaces for mobile and web applications.',
        'Conducted user research and usability testing to inform design decisions.',
        'Collaborated with developers to ensure faithful implementation of designs.'
      ],
    },
  ],
  education: [
    {
      institution: 'State University',
      location: 'New York, NY',
      degree: 'B.S. in Business Administration',
      graduationDate: 'May 2018',
    },
  ],
  skills: 'Project Management: Agile, Scrum, Jira; Design: Figma, Sketch, Adobe XD; Communication: Stakeholder Management, Public Speaking',
  projects: [
    {
      name: 'E-commerce Website Redesign',
      description: 'Led the complete redesign of an e-commerce platform, resulting in a 30% increase in user conversion rates.',
      technologies: 'Figma, User Testing, A/B Testing',
      url: 'https://example-project.com',
    },
  ],
  certifications: [
    {
      name: 'Certified ScrumMaster (CSM)',
      issuer: 'Scrum Alliance',
      date: '2021',
      url: 'https://verify-cert.com/12345',
    },
  ],
  template: 'modern',
};
