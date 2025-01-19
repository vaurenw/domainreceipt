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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`domains.${index}.name`}>Domain Name</Label>
                <Input
                  {...form.register(`domains.${index}.name`)}
                  placeholder="example.com"
                />
                {form.formState.errors.domains?.[index]?.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.domains[index]?.name?.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Registration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !form.getValues(`domains.${index}.registrationDate`) &&
                          'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.getValues(`domains.${index}.registrationDate`) ? (
                        format(
                          form.getValues(`domains.${index}.registrationDate`),
                          'PPP'
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.getValues(`domains.${index}.registrationDate`)}
                      onSelect={(date) => handleDateChange(date, index)}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Domain
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="twitterHandle">Twitter Handle (optional)</Label>
          <div className="relative">
            <Twitter className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              {...form.register('twitterHandle')}
              placeholder="username"
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ name: '', registrationDate: new Date() })
            }
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Domain
          </Button>
          <Button type="submit" className="w-full">
            Generate Receipt
          </Button>
        </div>
      </div>
    </form>
  );
}