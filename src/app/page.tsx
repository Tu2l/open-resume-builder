
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { useToast } from '@/hooks/use-toast';
import { ResumeTemplate, templates, testData } from '@/lib/data';
import availableModels from '@/lib/models.json';
import { jobDescriptionSchema, resumeFormSchema, type JobDescriptionValues, type ResumeFormValues } from '@/lib/schema';
import { getResumeAsPlainText, renderSimpleTemplate } from '@/lib/template-helpers';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, FileText, FileType, RefreshCw, Share, TestTube2 } from 'lucide-react';

// Form Step Components
import ErrorView from '@/components/form/ErrorView';
import FormStepsContainer from '@/components/form/FormStepsContainer';
import LoadingView from '@/components/form/LoadingView';
import ResultStep from '@/components/form/ResultStep';
import TemplateSelectionStep from '@/components/form/TemplateSelectionStep';
import WelcomeStep from '@/components/form/WelcomeStep';


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
        selectedTemplate.html
            .then(templateHtml => {
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

    const generateEnhancedResumeFromTemplate = (selectedTemplate: ResumeTemplate, validatedData: ResumeFormValues, jobDescriptionText: string, analysisResult: string) => {
        selectedTemplate.html
            .then(templateHtml => {
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

    // Memoize step components for performance
    const renderContent = () => {
        const stepComponentMap = {
            welcome: (
                <WelcomeStep
                    setAppState={setAppState}
                    importFileInputRef={importFileInputRef}
                    handleImport={handleImport}
                />
            ),
            template: (
                <TemplateSelectionStep
                    form={resumeForm}
                    onBack={() => setAppState({ step: 'welcome' })}
                    onNext={() => setAppState({ step: 'form', currentFormStep: 0 })}
                />
            ),
            form: (
                <FormStepsContainer
                    form={resumeForm}
                    currentStep={appState.step === 'form' ? appState.currentFormStep : 0}
                    formSteps={formSteps}
                    onPrevStep={handlePrevStep}
                    onNextStep={handleNextStep}
                    onChangeTemplate={() => setAppState({ step: 'template' })}
                    onGenerateResume={handleGenerateResume}
                />
            ),
            result: (
                <ResultStep
                    jdForm={jdForm}
                    isLoading={isLoading}
                    error={error}
                    editedHtml={editedHtml}
                    isEditingHtml={isEditingHtml}
                    enhancedResumeHtml={enhancedResumeHtml}
                    analysis={appState.analysis}
                    onBackToEdit={() => setAppState({ step: 'form', currentFormStep: formSteps.length - 1 })}
                    onStartNewResume={() => setAppState({ step: 'welcome' })}
                    onRevert={handleRevert}
                    onEditHtml={() => setIsEditingHtml(true)}
                    onSaveHtml={handleSaveHtml}
                    onEditHtmlChange={setEditedHtml}
                    onSubmitEnhance={handleEnhanceSubmit}
                />
            ),
        };

        // Only re-render loading/error views when relevant state changes
        if (isLoading) {
            return <LoadingView message={loadingMessage} />;
        }

        if (error && appState.step !== 'result') {
            return (
                <ErrorView
                    error={error}
                    onTryAgain={() => {
                        setError(null);
                        setAppState({ step: 'welcome' });
                    }}
                />
            );
        }

        return stepComponentMap[appState.step] || null;
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
