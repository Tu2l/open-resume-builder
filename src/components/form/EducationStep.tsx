'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { ResumeFormValues } from '@/lib/schema';

interface EducationStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function EducationStep({ form }: EducationStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education"
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
          <FormField
            control={form.control}
            name={`education.${index}.institution`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Stanford University" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Bachelor of Science in Computer Science" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Stanford, CA" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`education.${index}.graduationDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Date</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2020" value={field.value ?? ''} />
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
          institution: '', 
          location: '', 
          degree: '', 
          graduationDate: '' 
        })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
