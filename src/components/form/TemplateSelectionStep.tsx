'use client';

import { UseFormReturn } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ResumeFormValues } from '@/lib/schema';
import { templates } from '@/lib/data';
import { TemplateThumbnail } from '@/components/resume-templates';

interface TemplateSelectionStepProps {
  form: UseFormReturn<ResumeFormValues>;
  onBack: () => void;
  onNext: () => void;
}

export default function TemplateSelectionStep({ form, onBack, onNext }: TemplateSelectionStepProps) {
  const selectedTemplateId = form.watch('template');

  return (
    <Card className="shadow-lg max-w-3xl w-full">
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <CardHeader>
            <CardTitle className="text-2xl">Step 1: Choose a Template</CardTitle>
            <CardDescription>Select a visual style for your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
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
            <Button type="button" variant="outline" onClick={onBack}>
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
}
