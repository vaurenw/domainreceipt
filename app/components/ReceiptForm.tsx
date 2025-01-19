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
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Domain Receipt Generator</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="field-row-stacked">
                <div className="field-row">
                  <Label htmlFor={`domains.${index}.name`}>Domain Name</Label>
                  <Input
                    {...form.register(`domains.${index}.name`)}
                    placeholder="example.com"
                    className="w-full"
                  />
                </div>
                {form.formState.errors.domains?.[index]?.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.domains[index]?.name?.message}
                  </p>
                )}

                <div className="field-row">
                  <Label>Registration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="button" type="button">
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
                        onSelect={(date) => {
                          if (date) {
                            handleDateChange(date, index);
                            form.setValue(`domains.${index}.registrationDate`, date, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }
                        }}
                        initialFocus
                        disabled={(date) => date > new Date()}
                        className="w-full"
                        classNames={{
                          months: "flex flex-col space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-bold",
                          nav: "space-x-1 flex items-center",
                          nav_button: "button h-7 w-7 bg-transparent p-0",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-black w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "button h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                          day_selected: "bg-[#000080] text-white hover:bg-[#000080] hover:text-white focus:bg-[#000080] focus:text-white",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "opacity-50",
                          day_disabled: "opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="button"
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
            <div className="field-row">
              <Twitter className="h-5 w-5" />
              <Input
                {...form.register('twitterHandle')}
                placeholder="username"
              />
            </div>
          </div>

          <div className="field-row">
            <button
              type="button"
              onClick={() => append({ name: '', registrationDate: new Date() })}
              className="button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Domain
            </button>
            <button type="submit" className="button">
              Generate Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}