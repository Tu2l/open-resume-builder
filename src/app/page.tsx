
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getResumeAsPlainText, renderSimpleTemplate } from '@/lib/template-helpers';
import { resumeFormSchema, jobDescriptionSchema, type ResumeFormValues, type JobDescriptionValues } from '@/lib/schema';
import { ResumeTemplate, templates, testData } from '@/lib/data';
import availableModels from '@/lib/models.json';
import { TemplateThumbnail } from '@/components/resume-templates';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Loader2, Wand2, FileWarning, Pencil, Eye, FileType, Check, PlusCircle, Trash2, ArrowRight, ArrowLeft, RefreshCw, Save, History, Import, Share, TestTube2, Home } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


/**
 * Defines the possible states of the application UI.
 */
type AppState =
    | { step: 'welcome' }
    | { step: 'template' }
    | { step: 'form'; currentFormStep: number }
    | { step: 'result'; jobDescription?: string; analysis?: string };

/**
 * Defines the sequence of steps in the resume creation form.
 */
const formSteps = ['Contact', 'Summary', 'Experience', 'Projects', 'Education', 'Certifications', 'Skills'];

/**
 * Extracts a JSON object from a string, which may contain markdown code fences.
 */
const extractJsonFromResponse = (text: string): any => {
    try {
        const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonBlockRegex);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
    } catch (e) {
        console.error("Failed to parse JSON from code block:", e);
    }

    try {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        }
    } catch (e) {
        console.error("Failed to parse JSON from substring:", e);
    }

    throw new Error("Could not find or parse a valid JSON object in the AI's response.");
};


/**
 * A helper function to call the Gemini API from the client-side.
 */
const callGeminiApi = async (prompt: string, apiKey: string, model: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error Body:", errorBody);
        throw new Error(`Gemini API Error: ${errorBody.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};


export default function HomePage() {
    const [appState, setAppState] = useState<AppState>({ step: 'welcome' });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please wait...');
    const [error, setError] = useState<string | null>(null);

    const [originalResumeHtml, setOriginalResumeHtml] = useState<string | null>(null);
    const [enhancedResumeHtml, setEnhancedResumeHtml] = useState<string | null>(null);
    const [isEditingHtml, setIsEditingHtml] = useState(false);

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmDialogContent, setConfirmDialogContent] = useState({
        title: '',
        description: '',
        onConfirm: () => { },
    });

    const currentHtml = enhancedResumeHtml || originalResumeHtml;
    const [editedHtml, setEditedHtml] = useState(currentHtml || '');

    useEffect(() => {
        if (currentHtml) {
            setEditedHtml(currentHtml);
        }
    }, [currentHtml]);

    const importFileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const defaultFormValues: ResumeFormValues = {
        fullName: '', email: '', phone: '', website: '', linkedin: '', github: '', summary: '',
        experience: [{ company: '', location: '', title: '', startDate: '', endDate: '', responsibilities: [''] }],
        projects: [{ name: '', description: '', technologies: '', url: '' }],
        education: [{ institution: '', location: '', degree: '', graduationDate: '' }],
        certifications: [{ name: '', issuer: '', date: '', url: '' }],
        skills: '',
        template: 'modern',
    };

    const resumeForm = useForm<ResumeFormValues>({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: defaultFormValues,
        mode: 'onChange',
    });

    const jdForm = useForm<JobDescriptionValues>({
        resolver: zodResolver(jobDescriptionSchema),
        defaultValues: {
            jobDescriptionText: '',
            apiKey: '',
            model: availableModels[0].id,
        }
    });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control: resumeForm.control,
        name: "experience",
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control: resumeForm.control,
        name: "education",
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control: resumeForm.control,
        name: "projects",
    });

    const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
        control: resumeForm.control,
        name: "certifications",
    });

    const triggerValidation = async (fields: (keyof ResumeFormValues)[]) => {
        return await resumeForm.trigger(fields);
    };

    const handleRequestConfirmation = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialogContent({ title, description, onConfirm });
        setIsConfirmDialogOpen(true);
    };

    const handleFillWithSampleData = () => {
        const action = () => {
            resumeForm.reset(testData);
            toast({ title: 'Sample Data Loaded', description: 'The form has been filled with sample data.' });
        };

        if (!!resumeForm.watch('fullName')) {
            handleRequestConfirmation(
                'Overwrite Existing Data?',
                'You already have data in the form. Are you sure you want to overwrite it with sample data?',
                action
            );
        } else {
            action();
        }
    };

    const handleResetForm = () => {
        const action = () => {
            resumeForm.reset(defaultFormValues);
            setAppState({ step: 'form', currentFormStep: 0 });
            toast({ title: 'Form Reset', description: 'All fields have been cleared.' });
        };

        if (!!resumeForm.watch('fullName')) {
            handleRequestConfirmation(
                'Are you sure you want to reset the form?',
                'All your current progress will be lost. This action cannot be undone.',
                action
            );
        } else {
            action();
        }
    };

    const handleNextStep = async () => {
        if (appState.step !== 'form') return;

        let isValid = false;
        switch (appState.currentFormStep) {
            case 0: isValid = await triggerValidation(['fullName', 'email', 'phone', 'website', 'linkedin', 'github']); break;
            case 1: isValid = await triggerValidation(['summary']); break;
            case 2: isValid = await triggerValidation(['experience']); break;
            case 3: isValid = await triggerValidation(['projects']); break;
            case 4: isValid = await triggerValidation(['education']); break;
            case 5: isValid = await triggerValidation(['certifications']); break;
            case 6: isValid = await triggerValidation(['skills']); break;
        }

        if (isValid) {
            if (appState.currentFormStep < formSteps.length - 1) {
                setAppState({ step: 'form', currentFormStep: appState.currentFormStep + 1 });
            } else {
                handleGenerateResume(resumeForm.getValues());
            }
        }
    };

    const handlePrevStep = () => {
        if (appState.step !== 'form') return;
        if (appState.currentFormStep > 0) {
            setAppState({ step: 'form', currentFormStep: appState.currentFormStep - 1 });
        } else {
            setAppState({ step: 'template' });
        }
    };

    const handleGenerateResume = (data: ResumeFormValues) => {
        setIsLoading(true);
        setLoadingMessage('Generating your resume...');
        setError(null);

        try {
            const validationResult = resumeFormSchema.safeParse(data);
            if (!validationResult.success) {
                const firstError = validationResult.error.errors[0];
                const errorMessage = `Please fix the issues in the form. The '${firstError.path.join('.')}' field has an error: ${firstError.message}`;
                toast({ variant: 'destructive', title: 'Invalid Data', description: errorMessage, duration: 5000 });
                setAppState({ step: 'form', currentFormStep: 0 });
                setIsLoading(false);
                return;
            }

            const selectedTemplate = templates.find(t => t.id === data.template);
            if (!selectedTemplate) {
                throw new Error("Invalid template selected.");
            }

            generateOriginalResumeFromTemplate(selectedTemplate, data);
        } catch (err: any) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast({ variant: 'destructive', title: 'Error', description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const generateOriginalResumeFromTemplate = (selectedTemplate: ResumeTemplate, data: ResumeFormValues) => {
        selectedTemplate.html.
            then(templateHtml => {
                const html = renderSimpleTemplate(templateHtml, data);
                setOriginalResumeHtml(html);
                setEnhancedResumeHtml(null);
                setAppState({ step: 'result' });
            })
            .catch(err => {
                throw new Error(`Failed to load template: ${err.message}`);
            });

    }

    const handleEnhanceSubmit = async (data: JobDescriptionValues) => {
        setIsLoading(true);
        setError(null);
        const { apiKey, jobDescriptionText, model } = data;
        const resumeData = resumeForm.getValues();
        const resumePlainText = getResumeAsPlainText(resumeData);

        try {
            // Step 1: Get AI Analysis
            setLoadingMessage('Analyzing your resume and the job description...');
            const analysisPrompt = `You are an AI resume expert. Analyze the provided resume and job description, and provide suggestions on how to improve the resume to better align with the job description. Focus on skills, experience, and keywords.

        Resume:
        ${resumePlainText}
        
        Job Description:
        ${jobDescriptionText}
        
        Return only the analysis as a plain text string.`;

            const analysisResult = await callGeminiApi(analysisPrompt, apiKey, model);

            if (!analysisResult) {
                throw new Error('AI analysis failed to produce a result.');
            }

            // Step 2: Generate updated resume JSON
            setLoadingMessage('Applying enhancements to your resume...');
            const jsonSchema = JSON.stringify(zodToJsonSchema(resumeFormSchema), null, 2);
            const generationPrompt = `You are an expert resume writer and data extraction specialist. Your task is to rewrite the provided "Original Resume" to be better tailored for the "Job Description", using the "AI Analysis" as a guide. Then, you must output the result as a single, valid JSON object that strictly conforms to the provided "JSON Schema".

        Instructions:
        1.  The output MUST be a single, valid JSON object wrapped in \`\`\`json ... \`\`\` markdown fences. Do not include any text, notes, or explanations outside of the JSON object. Just return the JSON.
        2.  Rewrite the resume content, focusing on the summary and experience sections to align them with the target job.
        3.  Incorporate keywords and skills from the job description where appropriate.
        4.  Ensure all sections from the original resume (contact info, education, projects, etc.) are included in the final output.
        5.  For the 'responsibilities' within each 'experience' item, format them as a JSON array of strings. Each sentence or bullet point should be a separate string in the array.
        6.  For the 'skills' field, parse the user's input into a structured string. Example: "Languages: Java, Kotlin; Frameworks: React, NextJs".
        7.  If a required field from the schema is missing from the resume text (like 'email'), create a realistic placeholder.

        JSON Schema to follow:
        \`\`\`json
        ${jsonSchema}
        \`\`\`

        Original Resume:
        ${resumePlainText}
        
        Job Description:
        ${jobDescriptionText}
        
        AI Analysis:
        ${analysisResult}
        `;

            const generationResultText = await callGeminiApi(generationPrompt, apiKey, model);
            const generationResultJson = extractJsonFromResponse(generationResultText);

            const validatedData = resumeFormSchema.parse(generationResultJson);

            const selectedTemplate = templates.find(t => t.id === validatedData.template);
            if (!selectedTemplate) {
                throw new Error("Invalid template selected after enhancement.");
            }

            resumeForm.reset(validatedData);

            generateEnhancedResumeFromTemplate(selectedTemplate, validatedData, jobDescriptionText, analysisResult);

        } catch (err: any) {
            console.error("Error during AI enhancement:", err);
            const errorMessage = err.message || 'An unexpected error occurred during analysis.';
            setError(errorMessage);
            toast({ variant: 'destructive', title: 'Error', description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }

    const generateEnhancedResumeFromTemplate = (selectedTemplate: ResumeTemplate, validatedData: any, jobDescriptionText: string, analysisResult: any) => {
        selectedTemplate.html.
            then(templateHtml => {
                const html = renderSimpleTemplate(templateHtml, validatedData);
                setEnhancedResumeHtml(html);
                setAppState({ step: 'result', jobDescription: jobDescriptionText, analysis: analysisResult });
            })
            .catch(err => {
                throw new Error(`Failed to load template: ${err.message}`);
            });
    }

    const handleRevert = () => {
        setEnhancedResumeHtml(null);
        setAppState({ step: 'result' }); // Reset state to remove analysis
        toast({ title: "Reverted", description: "Showing the original version of your resume." });
    }

    const handleExport = () => {
        const data = resumeForm.getValues();
        const exportData = {
            ...data,
            projects: data.projects || [],
            certifications: data.certifications || [],
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.fullName.replace(' ', '_')}_resume_data.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Your resume data has been downloaded." });
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);
                const validatedData = resumeFormSchema.parse(data);
                resumeForm.reset(validatedData);
                handleGenerateResume(validatedData); // Generate resume locally
                toast({ title: "Import Successful", description: "Your resume data has been loaded and your resume generated." });
            } catch (err) {
                console.error(err);
                toast({ variant: 'destructive', title: "Import Failed", description: "The JSON file is invalid or corrupted." });
            } finally {
                if (importFileInputRef.current) importFileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    }

    const getTailwindStyles = () => {
        let css = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                if (sheet.cssRules) {
                    for (const rule of Array.from(sheet.cssRules)) {
                        css += rule.cssText;
                    }
                }
            } catch (e) {
                console.warn("Can't read stylesheet", e);
            }
        }
        return css;
    }

    const handlePrint = () => {
        const content = editedHtml;
        if (!content) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find resume content to print.' });
            return;
        }
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
              <html>
                  <head><title>Print Resume</title><style>${getTailwindStyles()}</style></head>
                  <body>${content}</body>
              </html>
          `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 250);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not open print window. Please disable your pop-up blocker.' });
        }
    };

    const handleDownloadHtml = () => {
        const content = editedHtml;
        if (!content) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find resume content to download.' });
            return;
        }
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleSaveHtml = () => {
        if (enhancedResumeHtml) {
            setEnhancedResumeHtml(editedHtml);
        } else {
            setOriginalResumeHtml(editedHtml);
        }
        setIsEditingHtml(false);
        toast({ title: "Changes Saved", description: "Your manual HTML edits have been saved." });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <Card className="shadow-lg w-full max-w-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (error && appState.step !== 'result') { // Show general error screen
            return (
                <Card className="shadow-lg w-full max-w-lg">
                    <CardContent className="pt-6">
                        <Alert variant="destructive" className="my-4">
                            <FileWarning className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Button onClick={() => { setError(null); setAppState({ step: 'welcome' }); }} className="w-full">
                            <RefreshCw className="mr-2" /> Try Again
                        </Button>
                    </CardContent>
                </Card>
            )
        }

        switch (appState.step) {
            case 'welcome':
                return (
                    <Card className="shadow-lg w-full max-w-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">Resume AI</CardTitle>
                            <CardDescription>Create a professional resume in minutes.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Button onClick={() => setAppState({ step: 'template' })} variant="default" size="lg">
                                <Pencil className="mr-2" /> Start From Scratch
                            </Button>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <p className="text-sm text-muted-foreground">Have a saved session?</p>
                            <Button onClick={() => importFileInputRef.current?.click()} variant="link" className="p-0 h-auto">
                                <Import className="mr-2" /> Import from JSON
                            </Button>
                            <input type="file" ref={importFileInputRef} onChange={handleImport} accept=".json" className="hidden" />
                        </CardFooter>
                    </Card>
                );
            case 'template':
                const selectedTemplateId = resumeForm.watch('template');
                return (
                    <Card className="shadow-lg max-w-3xl w-full">
                        <Form {...resumeForm}>
                            <form onSubmit={(e) => { e.preventDefault(); setAppState({ step: 'form', currentFormStep: 0 }); }}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Step 1: Choose a Template</CardTitle>
                                    <CardDescription>Select a visual style for your resume.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={resumeForm.control}
                                        name="template"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                                    >
                                                        {templates.map((template) => (
                                                            <FormItem key={template.id}>
                                                                <FormControl>
                                                                    <RadioGroupItem value={template.id} className="sr-only" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className={cn(
                                                                        "block rounded-lg border-2 border-muted bg-popover p-2 hover:border-accent cursor-pointer transition-all",
                                                                        field.value === template.id && "border-primary ring-2 ring-primary"
                                                                    )}
                                                                >
                                                                    <div className="relative aspect-[4/5.6] w-full overflow-hidden rounded-md">
                                                                        <TemplateThumbnail templateId={template.id} />
                                                                        {field.value === template.id && (
                                                                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                                                                <Check className="h-8 w-8 text-primary-foreground" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <span className="mt-2 block text-center font-medium">{template.name}</span>
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setAppState({ step: 'welcome' })}>
                                        <ArrowLeft className="mr-2" /> Back
                                    </Button>
                                    <Button type="submit" disabled={!selectedTemplateId}>
                                        Next <ArrowRight className="ml-2" />
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                );
            case 'form':
                return (
                    <Card className="shadow-lg max-w-3xl w-full">
                        <Form {...resumeForm}>
                            <form onSubmit={(e) => { e.preventDefault(); handleNextStep() }}>
                                <CardHeader>
                                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                                        <div className="space-y-1.5">
                                            <CardTitle className="text-2xl">Step 2: Build Your Resume</CardTitle>
                                            <CardDescription>You are on the <span className="font-semibold text-primary">{formSteps[appState.currentFormStep]}</span> section.</CardDescription>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-end gap-2">
                                            <Button type="button" variant="secondary" size="sm" onClick={() => setAppState({ step: 'template' })}>Change Template</Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {appState.currentFormStep === 0 && ( // Contact Info
                                        <div className="space-y-4">
                                            <FormField control={resumeForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormField control={resumeForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@email.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={resumeForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <FormField control={resumeForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="https://your-portfolio.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={resumeForm.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn (Optional)</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={resumeForm.control} name="github" render={({ field }) => (<FormItem><FormLabel>GitHub (Optional)</FormLabel><FormControl><Input placeholder="https://github.com/yourprofile" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                                            </div>
                                        </div>
                                    )}
                                    {appState.currentFormStep === 1 && (<FormField control={resumeForm.control} name="summary" render={({ field }) => (<FormItem><FormLabel>Professional Summary</FormLabel><FormControl><Textarea placeholder="A brief summary of your skills and experience..." className="h-40" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />)}
                                    {appState.currentFormStep === 2 && ( // Experience
                                        <div className="space-y-6">
                                            {experienceFields.map((field, index) => (
                                                <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <FormField control={resumeForm.control} name={`experience.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} placeholder="Software Engineer" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`experience.${index}.company`} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} placeholder="Tech Corp" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <FormField control={resumeForm.control} name={`experience.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="San Francisco, CA" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`experience.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} placeholder="May 2020" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`experience.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>End Date</FormLabel><FormControl><Input {...field} placeholder="Present" value={field.value ?? ''} /></FormControl></FormItem>)} />
                                                    </div>
                                                    <Controller
                                                        control={resumeForm.control}
                                                        name={`experience.${index}.responsibilities`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Responsibilities & Achievements</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                                                        onChange={e => field.onChange(e.target.value.split('\n'))}
                                                                        placeholder={"- Developed feature X, resulting in a 20% increase in user engagement.\n- Led a team of 5 engineers to deliver project Y on time."}
                                                                        className="h-32"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)} className="absolute -top-3 -right-3 h-7 w-7 rounded-full p-0"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => appendExperience({ company: '', location: '', title: '', startDate: '', endDate: '', responsibilities: [''] })}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                                            </Button>
                                        </div>
                                    )}
                                    {appState.currentFormStep === 3 && ( // Projects
                                        <div className="space-y-6">
                                            {projectFields.map((field, index) => (
                                                <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                                    <FormField control={resumeForm.control} name={`projects.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} placeholder="Resume Builder" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    <FormField control={resumeForm.control} name={`projects.${index}.technologies`} render={({ field }) => (<FormItem><FormLabel>Skills [Technologies] Used</FormLabel><FormControl><Input {...field} placeholder="Next.js, Tailwind CSS, Genkit" value={field.value ?? ''} /></FormControl><FormDescription>Comma-separated list of technologies.</FormDescription><FormMessage /></FormItem>)} />
                                                    <FormField control={resumeForm.control} name={`projects.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} placeholder="An AI-powered application to build and enhance resumes..." className="h-24" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    <FormField control={resumeForm.control} name={`projects.${index}.url`} render={({ field }) => (<FormItem><FormLabel>Project URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://github.com/user/project" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeProject(index)} className="absolute -top-3 -right-3 h-7 w-7 rounded-full p-0"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => appendProject({ name: '', description: '', technologies: '', url: '' })}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                                            </Button>
                                        </div>
                                    )}
                                    {appState.currentFormStep === 4 && ( // Education
                                        <div className="space-y-6">
                                            {educationFields.map((field, index) => (
                                                <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <FormField control={resumeForm.control} name={`education.${index}.institution`} render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} placeholder="University of Example" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} placeholder="B.S. in Computer Science" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <FormField control={resumeForm.control} name={`education.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="City, State" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`education.${index}.graduationDate`} render={({ field }) => (<FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} placeholder="May 2018" value={field.value ?? ''} /></FormControl></FormItem>)} />
                                                    </div>
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)} className="absolute -top-3 -right-3 h-7 w-7 rounded-full p-0"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => appendEducation({ institution: '', location: '', degree: '', graduationDate: '' })}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                                            </Button>
                                        </div>
                                    )}
                                    {appState.currentFormStep === 5 && ( // Certifications
                                        <div className="space-y-6">
                                            {certificationFields.map((field, index) => (
                                                <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                                    <FormField control={resumeForm.control} name={`certifications.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} placeholder="Professional Scrum Developer (PSD 1)" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <FormField control={resumeForm.control} name={`certifications.${index}.issuer`} render={({ field }) => (<FormItem><FormLabel>Issuing Body (Optional)</FormLabel><FormControl><Input {...field} placeholder="Scrum.org" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                        <FormField control={resumeForm.control} name={`certifications.${index}.date`} render={({ field }) => (<FormItem><FormLabel>Date Received (Optional)</FormLabel><FormControl><Input {...field} placeholder="2023" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    </div>
                                                    <FormField control={resumeForm.control} name={`certifications.${index}.url`} render={({ field }) => (<FormItem><FormLabel>Verification URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://verify-cert.com/123" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeCertification(index)} className="absolute -top-3 -right-3 h-7 w-7 rounded-full p-0"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => appendCertification({ name: '', issuer: '', date: '', url: '' })}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
                                            </Button>
                                        </div>
                                    )}
                                    {appState.currentFormStep === 6 && (<FormField control={resumeForm.control} name="skills" render={({ field }) => (<FormItem><FormLabel>Skills</FormLabel><FormControl><Textarea placeholder="Languages: TypeScript, Python; Frameworks: React, Next.js, FastAPI; Databases: PostgreSQL, Firestore" className="h-32" {...field} value={field.value ?? ''} /></FormControl><FormDescription>Categorize your skills for better readability, separating categories with semicolons.</FormDescription><FormMessage /></FormItem>)} />)}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={handlePrevStep}><ArrowLeft className="mr-2" /> Back</Button>
                                    <div className="flex items-center gap-2">
                                        {appState.currentFormStep < formSteps.length - 1 && resumeForm.formState.isValid && (
                                            <Button type="button" variant="secondary" onClick={() => handleGenerateResume(resumeForm.getValues())}>
                                                Finish
                                            </Button>
                                        )}
                                        <Button type="submit">
                                            {appState.currentFormStep < formSteps.length - 1 ? 'Next' : 'Generate Resume'} <ArrowRight className="ml-2" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                );
            case 'result':
                return (
                    <Card className="shadow-lg w-full max-w-6xl">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-2xl">Your Resume is Ready!</CardTitle>
                                    <CardDescription>Review, enhance, edit, and download your resume.</CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <Button variant="outline" onClick={() => setAppState({ step: 'form', currentFormStep: formSteps.length - 1 })}>
                                        <ArrowLeft className="mr-2" /> Back to Edit
                                    </Button>
                                    <Button variant="outline" onClick={() => setAppState({ step: 'welcome' })}>
                                        <Home className="mr-2" /> Start New Resume
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Tabs defaultValue="preview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="preview"><Eye className="mr-2" />Resume Preview</TabsTrigger>
                                    <TabsTrigger value="enhance"><Wand2 className="mr-2" />Enhance with AI</TabsTrigger>
                                </TabsList>
                                <TabsContent value="preview" className="mt-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center p-2 border rounded-md">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold">
                                                    {enhancedResumeHtml ? "Enhanced Version" : "Original Version"}
                                                </h3>
                                                {enhancedResumeHtml && (
                                                    <Button variant="outline" size="sm" onClick={handleRevert}><History className="mr-2" /> Revert to Original</Button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    if (isEditingHtml) {
                                                        handleSaveHtml();
                                                    }
                                                    setIsEditingHtml(!isEditingHtml);
                                                }}>
                                                    {isEditingHtml ? <><Save className="mr-2" /> Save & Preview</> : <><Pencil className="mr-2" /> Edit HTML</>}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex-grow mt-2 min-h-0">
                                            {isEditingHtml ? (
                                                <Textarea
                                                    value={editedHtml}
                                                    onChange={(e) => setEditedHtml(e.target.value)}
                                                    className="h-[70vh] w-full resize-none font-mono text-xs"
                                                />
                                            ) : (
                                                <ScrollArea className="h-[70vh] w-full rounded-md border bg-muted">
                                                    <div className="resume-preview-container">
                                                        <div className="resume-preview" dangerouslySetInnerHTML={{ __html: editedHtml || '' }} />
                                                    </div>
                                                </ScrollArea>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="enhance" className="mt-4">
                                    <div className="flex flex-col gap-4 p-4 border rounded-lg">
                                        <h3 className="text-lg font-semibold">Enhance with AI</h3>
                                        <p className="text-sm text-muted-foreground">Paste a job description and your Gemini API key below to get AI-powered suggestions tailored for the role.</p>

                                        <Form {...jdForm}>
                                            <form onSubmit={jdForm.handleSubmit(handleEnhanceSubmit)} className="space-y-4">
                                                <FormField
                                                    control={jdForm.control}
                                                    name="jobDescriptionText"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Job Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea placeholder="Paste job description here..." className="h-48" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={jdForm.control}
                                                        name="apiKey"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Gemini API Key</FormLabel>
                                                                <FormControl>
                                                                    <Input type="password" placeholder="Enter your Gemini API key" {...field} />
                                                                </FormControl>
                                                                <FormDescription>Your key is not stored.</FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={jdForm.control}
                                                        name="model"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>AI Model</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a model" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {availableModels.map(model => (
                                                                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                {appState.analysis && (
                                                    <Alert>
                                                        <Wand2 className="h-4 w-4" />
                                                        <AlertTitle>AI Suggestions Applied</AlertTitle>
                                                        <AlertDescription>The current version includes enhancements based on the job description. You can revert to the original if you wish.</AlertDescription>
                                                    </Alert>
                                                )}
                                                <Button type="submit" className="w-full" disabled={isLoading}>
                                                    <Wand2 className="mr-2" /> Enhance Resume
                                                </Button>
                                            </form>
                                        </Form>
                                        {error && (
                                            <Alert variant="destructive">
                                                <FileWarning className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    }


    return (
        <TooltipProvider>
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmDialogContent.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialogContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            confirmDialogContent.onConfirm();
                            setIsConfirmDialogOpen(false);
                        }}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col min-h-dvh bg-secondary/50 items-center justify-center">
                <header className="fixed top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto flex h-auto min-h-16 flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <FileText className="h-7 w-7 text-primary" />
                            <h1 className="text-2xl font-bold tracking-tight">Resume AI</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                            {appState.step === 'form' && (
                                <>
                                    {!!resumeForm.watch('fullName') && (
                                        <Button type="button" variant="outline" size="sm" onClick={handleResetForm}>
                                            <RefreshCw className="mr-2" /> Reset
                                        </Button>
                                    )}
                                    <Button type="button" variant="outline" size="sm" onClick={handleFillWithSampleData}>
                                        <TestTube2 className="mr-2" /> Fill with Sample Data
                                    </Button>
                                </>
                            )}
                            {appState.step === 'result' && (originalResumeHtml || enhancedResumeHtml) && (
                                <>
                                    <Button onClick={handleExport} size="sm" variant="outline"><Share className="mr-2" /> Export Data</Button>
                                    <Button onClick={handleDownloadHtml} size="sm" variant="outline"><Download className="mr-2" /> HTML</Button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handlePrint} size="sm" variant="default"><FileType className="mr-2" /> PDF</Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Use browser&apos;s &quot;Save as PDF&quot; option</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 container mx-auto p-4 pt-36 pb-36 sm:pt-24 sm:pb-24 lg:p-8 lg:pt-28 lg:pb-28 flex items-center justify-center">
                    {renderContent()}
                </main>
            </div>
        </TooltipProvider>
    );
}
