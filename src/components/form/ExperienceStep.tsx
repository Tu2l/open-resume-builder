'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { ResumeFormValues } from '@/lib/schema';
import { Textarea } from '../ui/textarea';

interface ExperienceStepProps {
  form: UseFormReturn<ResumeFormValues>;
}

export default function ExperienceStep({ form }: ExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience"
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
          <FormField
            control={form.control}
            name={`experience.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Google" value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`experience.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Senior Software Engineer" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Mountain View, CA" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`experience.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2020" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Present" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`experience.${index}.responsibilities`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Responsibilities</FormLabel>
                <FormControl>
                  <Textarea
                  {...field}
                  className="h-32"
                  placeholder="Led a team of 5 engineers in developing a new feature"
                  value={field.value ? field.value.join('\n') : ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    field.onChange(lines);
                  }}
                  />
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
          company: '',
          location: '',
          title: '',
          startDate: '',
          endDate: '',
          responsibilities: ['']
        })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}
