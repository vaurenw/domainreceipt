import { v4 as uuidv4 } from 'uuid';
import { Receipt, ReceiptFormData } from '../types/receipt';

export function generateReceiptNumber(): string {
  return `REC${Date.now().toString(36).toUpperCase()}`;
}

export function createReceipt(formData: ReceiptFormData): Receipt {
  return {
    ...formData,
    id: uuidv4(),
    createdAt: new Date(),
    receiptNumber: generateReceiptNumber(),
  };
}

export function saveReceipt(receipt: Receipt): void {
  const receipts = getStoredReceipts();
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export function getStoredReceipts(): Receipt[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('receipts');
  return stored ? JSON.parse(stored) : [];
}

export function getReceiptById(id: string): Receipt | undefined {
  const receipts = getStoredReceipts();
  return receipts.find((receipt) => receipt.id === id);
}