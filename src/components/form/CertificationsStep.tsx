'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { ResumeFormValues } from '@/lib/schema';

interface CertificationsStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function CertificationsStep({ form }: CertificationsStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications"
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
          <FormField
            control={form.control}
            name={`certifications.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Professional Scrum Developer (PSD 1)" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`certifications.${index}.issuer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Body (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Scrum.org" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`certifications.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Received (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2023" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`certifications.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://verify-cert.com/123" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            onClick={() => remove(index)} 
            className="absolute -top-3 -right-3 h-7 w-7 rounded-full p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ 
          name: '', 
          issuer: '', 
          date: '', 
          url: '' 
        })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
