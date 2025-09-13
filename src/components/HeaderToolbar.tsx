import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AppState } from '@/lib/AppState';
import { ResumeFormValues } from '@/lib/schema';
import { Download, FileText, FileType, Home, RefreshCw, Share, TestTube2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderToolbarProps {
    appState: AppState;
    resumeForm: ReturnType<typeof useForm<ResumeFormValues>>;
    handleResetForm: () => void;
    handleFillWithSampleData: () => void;
    originalResumeHtml: string | null;
    enhancedResumeHtml: string | null;
    handleExport: () => void;
    handleDownloadHtml: () => void;
    handlePrint: () => void;
    handleBackHome: () => void;
}

export default function HeaderToolbar({ appState, resumeForm, handleResetForm, handleFillWithSampleData, originalResumeHtml, enhancedResumeHtml, handleExport, handleDownloadHtml, handlePrint, handleBackHome }: HeaderToolbarProps) {
    return <header className="fixed top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-auto min-h-16 flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-color">{process.env.APP_NAME}</h1>
                <p className="text-sm text-muted-foreground"><sup>{process.env.APP_VERSION}</sup></p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                <ThemeToggle />
                {(appState.step !== 'welcome' && appState.step !== 'result') && <Button onClick={handleBackHome} size="sm" variant="outline"><Home className="mr-2" /> Home</Button>}
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
                                <p>Click to Generate and Download PDF</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                )}
            </div>
        </div>
    </header>;
}