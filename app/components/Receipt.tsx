'use client';

import { Receipt as ReceiptType } from '../types/receipt';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/button';

interface ReceiptProps {
  receipt: ReceiptType;
  baseUrl: string;
}

export function Receipt({ receipt, baseUrl }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const dataUrl = await htmlToImage.toPng(receiptRef.current);
      const link = document.createElement('a');
      link.download = `receipt-${receipt.receiptNumber}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <Card
        ref={receiptRef}
        className="p-6 max-w-[380px] mx-auto bg-white dark:bg-gray-900 font-mono text-sm leading-tight"
        style={{ 
          backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.02) 50%, transparent 50%)', 
          backgroundSize: '100% 4px'
        }}
      >
        <div className="text-center mb-6 pb-4 border-b border-dashed">
          <h1 className="text-xl font-bold tracking-wide">DOMAIN RECEIPT</h1>
          <p>{format(receipt.createdAt, 'EEEE, MMMM d, yyyy').toUpperCase()}</p>
          <p className="mt-1">ORDER #{receipt.receiptNumber}</p>
        </div>

        <div className="space-y-4 mb-6">
          {receipt.domains.map((domain, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>DOMAIN NAME</span>
                <span>{domain.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span>REGISTERED</span>
                <span>{format(domain.registrationDate, 'MM/dd/yyyy')}</span>
              </div>
              {domain.notes && (
                <div className="text-[13px] mt-1">
                  <span>NOTE: {domain.notes}</span>
                </div>
              )}
              {index < receipt.domains.length - 1 && (
                <div className="border-b border-dotted my-2"></div>
              )}
            </div>
          ))}
        </div>

        {receipt.twitterHandle && (
          <div className="flex justify-center mb-4">
            <QRCodeSVG 
              value={`https://twitter.com/${receipt.twitterHandle}`} 
              size={120}
              className="border-8 border-white"
            />
          </div>
        )}

        <div className="text-center space-y-1 pt-4 border-t border-dashed">
          <p>{format(new Date(), 'h:mm:ss a')}</p>
          {receipt.twitterHandle && (
            <p>@{receipt.twitterHandle}</p>
          )}
          <p className="font-bold mt-2">THANK YOU FOR YOUR BUSINESS!</p>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button onClick={downloadReceipt}>Download Receipt</Button>
      </div>
    </div>
  );
}