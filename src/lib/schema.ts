/**
 * @fileoverview This file defines the Zod schemas for form validation.
 * Keeping schemas in a separate file improves modularity and makes them
 * reusable across the application, for example, in both client-side forms
 * and server-side AI flows.
 */

import * as z from 'zod';

/**
 * Zod schema for validating the main resume form.
 */
export const resumeFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(1, "Phone number is required."),
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    summary: z.string().min(10, "Summary should be at least 10 characters.").max(1000, "Summary cannot exceed 1000 characters."),
    experience: z.array(z.object({
        company: z.string().min(1, "Company name is required."),
        location: z.string().min(1, "Location is required."),
        title: z.string().min(1, "Job title is required."),
        startDate: z.string().min(1, "Start date is required."),
        endDate: z.string().min(1, "End date is required."),
        responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty.")).min(1, "Please list at least one responsibility."),
    })),
    education: z.array(z.object({
        institution: z.string().min(1, "Institution name is required."),
        location: z.string().min(1, "Location is required."),
        degree: z.string().min(1, "Degree is required."),
        graduationDate: z.string().min(1, "Graduation date is required."),
    })),
    skills: z.string().min(1, "Please list at least one skill."),
    projects: z.array(z.object({
        name: z.string().min(1, "Project name is required."),
        description: z.string().min(1, "Description is required."),
        technologies: z.string().optional().or(z.literal('')),
        url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    })).optional(),
    certifications: z.array(z.object({
        name: z.string().min(1, "Certification name is required."),
        issuer: z.string().optional().or(z.literal('')),
        date: z.string().optional().or(z.literal('')),
        url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    })).optional(),
    template: z.enum([
        'classic', 'modern', 'creative', 'minimalist', 'professional', 'executive', 
        'technical', 'two-column', 'elegant', 'compact', 'modern-executive', 'academic', 'sales'
    ]),
});

/**
 * TypeScript type inferred from the resumeFormSchema.
 */
export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

/**
 * Zod schema for validating the job description input form.
 */
export const jobDescriptionSchema = z.object({
    jobDescriptionText: z.string().min(20, "Please enter a job description of at least 20 characters."),
    apiKey: z.string().min(1, 'A Gemini API key is required.'),
    model: z.string().min(1, 'Please select a model.'),
});

/**
 * TypeScript type inferred from the jobDescriptionSchema.
 */
export type JobDescriptionValues = z.infer<typeof jobDescriptionSchema>;