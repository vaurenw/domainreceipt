'use client';

import { useEffect, useState } from 'react';
import { Receipt } from '@/app/components/Receipt';
import { getReceiptById } from '@/app/utils/receipt';
import { Receipt as ReceiptType } from '@/app/types/receipt';

export default function ReceiptPage({
  params,
}: {
  params: { id: string };
}) {
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);

  useEffect(() => {
    const foundReceipt = getReceiptById(params.id);
    if (foundReceipt) {
      setReceipt(foundReceipt);
    }
  }, [params.id]);

  if (!receipt) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
        <p className="text-muted-foreground">
          The receipt you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Receipt receipt={receipt} baseUrl={window.location.origin} />
    </div>
  );
}