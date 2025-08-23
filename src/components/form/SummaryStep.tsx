'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ResumeFormValues } from '@/lib/schema';

interface SummaryStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function SummaryStep({ form }: SummaryStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Summary</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Senior software engineer with 5+ years of experience in full-stack development..." 
                className="h-32"
                {...field} 
                value={field.value ?? ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
