'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReceiptFormData, receiptFormSchema } from '../types/receipt';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ReceiptFormProps {
  onSubmit: (data: ReceiptFormData) => void;
}

export function ReceiptForm({ onSubmit }: ReceiptFormProps) {
  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      domains: [{ name: '', registrationDate: new Date() }],
      twitterHandle: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'domains',
  });

  const handleDateChange = (date: Date | undefined, index: number) => {
    if (date && date <= new Date()) {
      form.setValue(`domains.${index}.registrationDate`, date);
    }
  };

  return (
    <div className="window w-full max-w-[95vw] md:max-w-[600px] mx-auto">
      <div className="title-bar">
        <div className="title-bar-text">Domain Receipt Generator</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body p-2 md:p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="field-row-stacked">
                <div className="field-row flex-col md:flex-row gap-2">
                  <Label htmlFor={`domains.${index}.name`} className="min-w-[100px]">Domain Name</Label>
                  <Input
                    {...form.register(`domains.${index}.name`)}
                    placeholder="example.com"
                    className="w-full"
                  />
                </div>
                {form.formState.errors.domains?.[index]?.name && (
                  <p className="text-xs md:text-sm text-red-500">
                    {form.formState.errors.domains[index]?.name?.message}
                  </p>
                )}

                <div className="field-row flex-col md:flex-row gap-2">
                  <Label className="min-w-[100px]">Registration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="button w-full md:w-auto" type="button">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.getValues(`domains.${index}.registrationDate`) ? (
                          format(
                            form.getValues(`domains.${index}.registrationDate`),
                            'PPP'
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="window" 
                      align="start"
                      style={{ 
                        background: '#c0c0c0',
                        border: '2px outset #fff',
                        padding: '4px',
                        width: 'min(100vw - 32px, 300px)',
                        position: 'relative',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <Calendar
                        mode="single"
                        selected={form.getValues(`domains.${index}.registrationDate`)}
                        onSelect={(date) => handleDateChange(date!, index)}
                        initialFocus
                        disabled={(date) => date > new Date()}
                        className="w-full"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="button w-full md:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Domain
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="field-row-stacked">
            <Label htmlFor="twitterHandle">Twitter Handle (optional)</Label>
            <div className="field-row flex-col md:flex-row gap-2">
              <Twitter className="h-5 w-5" />
              <Input
                {...form.register('twitterHandle')}
                placeholder="username"
                className="w-full"
              />
            </div>
          </div>

          <div className="field-row flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={() => append({ name: '', registrationDate: new Date() })}
              className="button w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Domain
            </button>
            <button type="submit" className="button w-full md:w-auto">
              Generate Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}