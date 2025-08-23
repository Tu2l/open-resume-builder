'use client';

import { UseFormReturn } from 'react-hook-form';
import { Eye, Wand2, ArrowLeft, Home, History, Save, Pencil, FileWarning } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JobDescriptionValues } from '@/lib/schema';
import availableModels from '@/lib/models.json';

interface ResultStepProps {
  jdForm: UseFormReturn<JobDescriptionValues>;
  isLoading: boolean;
  error: string | null;
  editedHtml: string;
  isEditingHtml: boolean;
  enhancedResumeHtml: string | null;
  analysis: string | undefined;
  onBackToEdit: () => void;
  onStartNewResume: () => void;
  onRevert: () => void;
  onEditHtml: () => void;
  onSaveHtml: () => void;
  onEditHtmlChange: (value: string) => void;
  onSubmitEnhance: (data: JobDescriptionValues) => void;
}

export default function ResultStep({
  jdForm,
  isLoading,
  error,
  editedHtml,
  isEditingHtml,
  enhancedResumeHtml,
  analysis,
  onBackToEdit,
  onStartNewResume,
  onRevert,
  onEditHtml,
  onSaveHtml,
  onEditHtmlChange,
  onSubmitEnhance
}: ResultStepProps) {
  return (
    <Card className="shadow-lg w-full max-w-6xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Your Resume is Ready!</CardTitle>
            <CardDescription>Review, enhance, edit, and download your resume.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={onBackToEdit}>
              <ArrowLeft className="mr-2" /> Back to Edit
            </Button>
            <Button variant="outline" onClick={onStartNewResume}>
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
                    <Button variant="outline" size="sm" onClick={onRevert}>
                      <History className="mr-2" /> Revert to Original
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={isEditingHtml ? onSaveHtml : onEditHtml}>
                    {isEditingHtml ? <><Save className="mr-2" /> Save & Preview</> : <><Pencil className="mr-2" /> Edit HTML</>}
                  </Button>
                </div>
              </div>
              <div className="flex-grow mt-2 min-h-0">
                {isEditingHtml ? (
                  <Textarea
                    value={editedHtml}
                    onChange={(e) => onEditHtmlChange(e.target.value)}
                    className="h-[70vh] w-full resize-none font-mono text-xs"
                  />
                ) : (
                  <ScrollArea className="h-[70vh] w-full rounded-md border bg-muted">
                    <div className="resume-preview-container">
                      <div className="resume-preview" dangerouslySetInnerHTML={{ __html: editedHtml }} />
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="enhance" className="mt-4">
            <div className="space-y-6">
              <Form {...jdForm}>
                <form onSubmit={(e) => { e.preventDefault(); onSubmitEnhance(jdForm.getValues()); }}>
                  <FormField
                    control={jdForm.control}
                    name="jobDescriptionText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the job description here..."
                            className="h-40"
                            {...field}
                          />
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
                  {analysis && (
                    <Alert>
                      <Wand2 className="h-4 w-4" />
                      <AlertTitle>AI Suggestions Applied</AlertTitle>
                      <AlertDescription>
                        The current version includes enhancements based on the job description. You can revert to the original if you wish.
                      </AlertDescription>
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
}
