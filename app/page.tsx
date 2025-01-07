'use client';

import { useState } from 'react';
import { ReceiptForm } from './components/ReceiptForm';
import { Receipt } from './components/Receipt';
import { ReceiptFormData } from './types/receipt';
import { createReceipt, saveReceipt } from './utils/receipt';

export default function Home() {
  const [currentReceipt, setCurrentReceipt] = useState<ReturnType<typeof createReceipt> | null>(null);

  const handleSubmit = (data: ReceiptFormData) => {
    const receipt = createReceipt(data);
    saveReceipt(receipt);
    setCurrentReceipt(receipt);
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-mono">Domain Receipt Generator</h1>
          <p className="text-sm text-muted-foreground">Generate receipts for domain registrations</p>
        </div>

        {!currentReceipt ? (
          <ReceiptForm onSubmit={handleSubmit} />
        ) : (
          <Receipt receipt={currentReceipt} baseUrl={window.location.origin} />
        )}
      </div>
    </main>
  );
}