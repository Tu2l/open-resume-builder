'use client';

import { UseFormReturn } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ResumeFormValues } from '@/lib/schema';
import { availableTemplates, getTemplatesByCategory, TemplateInfo } from '@/templates';
import { TemplateThumbnail } from '@/components/resume-templates';

interface TemplateSelectionStepProps {
  form: UseFormReturn<ResumeFormValues>;
  onBack: () => void;
  onNext: () => void;
}

export default function TemplateSelectionStep({ form, onBack, onNext }: TemplateSelectionStepProps) {
  const selectedTemplateId = form.watch('template');
  
  // Group templates by category
  const templatesByCategory = {
    traditional: getTemplatesByCategory('traditional'),
    modern: getTemplatesByCategory('modern'),
    professional: getTemplatesByCategory('professional'),
    creative: getTemplatesByCategory('creative'),
    specialized: getTemplatesByCategory('specialized'),
  };

  const CategorySection = ({ title, templates }: { title: string; templates: TemplateInfo[] }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <FormItem key={template.id}>
            <FormControl>
              <RadioGroupItem value={template.id} className="sr-only" />
            </FormControl>
            <FormLabel
              className={cn(
                "block rounded-lg border-2 border-muted bg-popover p-3 hover:border-accent cursor-pointer transition-all",
                selectedTemplateId === template.id && "border-primary ring-2 ring-primary"
              )}
            >
              <div className="relative aspect-[4/5.6] w-full overflow-hidden rounded-md mb-2">
                <TemplateThumbnail templateId={template.id} />
                {selectedTemplateId === template.id && (
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                    <Check className="h-8 w-8 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="block text-center font-medium text-sm">{template.name}</span>
                <p className="text-xs text-muted-foreground text-center">{template.description}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {template.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-muted px-1 py-0.5 rounded text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </FormLabel>
          </FormItem>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg max-w-6xl w-full">
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <CardHeader>
            <CardTitle className="text-2xl">Step 1: Choose a Template</CardTitle>
            <CardDescription>
              Select a visual style for your resume. We now offer {availableTemplates.length} professional templates optimized for A4 printing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-6"
                    >
                      <CategorySection title="Traditional" templates={templatesByCategory.traditional} />
                      <CategorySection title="Modern" templates={templatesByCategory.modern} />
                      <CategorySection title="Professional" templates={templatesByCategory.professional} />
                      <CategorySection title="Creative" templates={templatesByCategory.creative} />
                      <CategorySection title="Specialized" templates={templatesByCategory.specialized} />
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
