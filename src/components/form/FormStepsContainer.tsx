'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ResumeFormValues } from '@/lib/schema';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

// Import form step components
import { useMemo } from 'react';
import CertificationsStep from './CertificationsStep';
import ContactStep from './ContactStep';
import EducationStep from './EducationStep';
import ExperienceStep from './ExperienceStep';
import ProjectsStep from './ProjectsStep';
import SkillsStep from './SkillsStep';
import SummaryStep from './SummaryStep';

interface FormStepsContainerProps {
  form: UseFormReturn<ResumeFormValues>;
  currentStep: number;
  formSteps: string[];
  onPrevStep: () => void;
  onNextStep: () => void;
  onChangeTemplate: () => void;
  onGenerateResume: (data: ResumeFormValues) => void;
}

export default function FormStepsContainer({
  form,
  currentStep,
  formSteps,
  onPrevStep,
  onNextStep,
  onChangeTemplate,
  onGenerateResume
}: FormStepsContainerProps) {
// Memoize the step components to avoid unnecessary re-renders

const stepComponents = useMemo(() => [
    <ContactStep form={form} />,
    <SummaryStep form={form} />,
    <ExperienceStep form={form} />,
    <ProjectsStep form={form} />,
    <EducationStep form={form} />,
    <CertificationsStep form={form} />,
    <SkillsStep form={form} />
], [form]);

const renderCurrentStep = () => stepComponents[currentStep] ?? null;

  return (
    <Card className="shadow-lg max-w-3xl w-full">
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); onNextStep(); }}>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div className="space-y-1.5">
                <CardTitle className="text-2xl">Step 2: Build Your Resume</CardTitle>
                <CardDescription>
                  You are on the <span className="font-semibold text-primary">{formSteps[currentStep]}</span> section.
                </CardDescription>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onChangeTemplate}
                >
                  Change Template
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevStep}>
              <ArrowLeft className="mr-2" /> Back
            </Button>
            <div className="flex items-center gap-2">
              {currentStep < formSteps.length - 1 && form.formState.isValid && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onGenerateResume(form.getValues())}
                >
                  Finish
                </Button>
              )}
              <Button type="submit">
                {currentStep < formSteps.length - 1 ? 'Next' : 'Generate Resume'} <ArrowRight className="ml-2" />
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
