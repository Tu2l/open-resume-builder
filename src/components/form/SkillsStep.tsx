'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ResumeFormValues } from '@/lib/schema';

interface SkillsStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function SkillsStep({ form }: SkillsStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Languages: TypeScript, Python; Frameworks: React, Next.js, FastAPI; Databases: PostgreSQL, Firestore" 
                className="h-32" 
                {...field} 
                value={field.value ?? ''} 
              />
            </FormControl>
            <FormDescription>
              Categorize your skills for better readability, separating categories with semicolons.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
