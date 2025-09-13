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
  fullName: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '',
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
  fullName: 'Arjun Sharma',
  email: 'arjun.sharma@example.com',
  phone: '+91-9876543210',
  location: 'Bangalore, Karnataka, India',
  website: 'https://arjunsharma.dev',
  linkedin: 'https://linkedin.com/in/arjunsharma',
  github: 'https://github.com/arjunsharma',
  summary: 'A passionate and innovative software engineer with experience in full-stack development and AI/ML solutions. Eager to contribute to cutting-edge technology projects and build scalable applications.',
  experience: [
    {
      company: 'Infosys Limited',
      location: 'Bangalore, Karnataka',
      title: 'Senior Software Engineer',
      startDate: 'Jul 2022',
      endDate: 'Present',
      responsibilities: [
        'Led development of microservices architecture serving 10M+ users for a fintech application.',
        'Optimized database queries and API performance, reducing response time by 40%.',
        'Mentored junior developers and implemented CI/CD pipelines using Jenkins and Docker.'
      ],
    },
    {
      company: 'Tata Consultancy Services',
      location: 'Mumbai, Maharashtra',
      title: 'Software Developer',
      startDate: 'Aug 2020',
      endDate: 'Jun 2022',
      responsibilities: [
        'Developed and maintained React.js applications for banking sector clients.',
        'Collaborated with cross-functional teams to deliver features using Agile methodology.',
        'Implemented automated testing suites, improving code coverage by 85%.'
      ],
    },
  ],
  education: [
    {
      institution: 'Indian Institute of Technology (IIT) Delhi',
      location: 'New Delhi, India',
      degree: 'B.Tech in Computer Science and Engineering',
      graduationDate: 'May 2020',
    },
  ],
  skills: 'Programming Languages: JavaScript, Python, Java, TypeScript; Frameworks: React.js, Node.js, Express.js, Django; Databases: MongoDB, PostgreSQL, MySQL; Cloud: AWS, Azure; Tools: Git, Docker, Kubernetes',
  projects: [
    {
      name: 'Smart Agriculture IoT Platform',
      description: 'Built an IoT-based platform for precision farming using sensor data analytics, helping farmers increase crop yield by 25%.',
      technologies: 'React.js, Node.js, MongoDB, AWS IoT, Python',
      url: 'https://github.com/arjunsharma/smart-agriculture',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: 'https://aws.amazon.com/verification',
    },
  ],
  template: 'modern',
};
