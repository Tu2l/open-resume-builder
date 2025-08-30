'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { ResumeFormValues } from '@/lib/schema';
import { Textarea } from '../ui/textarea';

interface ProjectsStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function ProjectsStep({ form }: ProjectsStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects"
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
          <FormField
            control={form.control}
            name={`projects.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E-commerce Platform" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`projects.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='h-32'
                    placeholder="Built a full-stack e-commerce platform..."
                    value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`projects.${index}.technologies`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies Used</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="React, Node.js, MongoDB" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`projects.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://github.com/username/project" value={field.value ?? ''} />
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
          description: '',
          technologies: '',
          url: ''
        })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
