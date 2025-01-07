import { z } from 'zod';

export const domainSchema = z.object({
  name: z.string().min(1, 'Domain name is required'),
  registrationDate: z.date({
    required_error: 'Registration date is required',
  }),
  notes: z.string().optional(),
  twitterHandle: z.string().optional(),
});

export const receiptFormSchema = z.object({
  domains: z.array(domainSchema).min(1, 'At least one domain is required'),
  twitterHandle: z.string().optional(),
});

export type DomainEntry = z.infer<typeof domainSchema>;
export type ReceiptFormData = z.infer<typeof receiptFormSchema>;

export interface Receipt extends ReceiptFormData {
  id: string;
  createdAt: Date;
  receiptNumber: string;
}