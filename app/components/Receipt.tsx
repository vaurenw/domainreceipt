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
      try {
        // Wait for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dataUrl = await htmlToImage.toPng(receiptRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: 'white',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
        });
        
        const link = document.createElement('a');
        link.download = `receipt-${receipt.receiptNumber}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating receipt image:', error);
      }
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <Card
        ref={receiptRef}
        className="p-8 w-[400px] bg-white"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          fontFamily: 'Courier, monospace',
        }}
      >
        {/* Receipt Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-black border-dashed">
          <div className="text-2xl font-bold tracking-wider mb-2">DOMAIN RECEIPT</div>
          <div className="text-sm">{format(receipt.createdAt, 'EEEE, MMMM d, yyyy').toUpperCase()}</div>
          <div className="text-sm mt-1 font-bold">ORDER #{receipt.receiptNumber}</div>
        </div>

        {/* Receipt Items */}
        <div className="space-y-6 mb-6">
          {receipt.domains.map((domain, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold">DOMAIN NAME:</span>
                <span>{domain.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold">REGISTERED:</span>
                <span>{format(domain.registrationDate, 'MM/dd/yyyy')}</span>
              </div>
              {domain.notes && (
                <div className="text-sm mt-2 border-l-2 border-gray-300 pl-2">
                  <span className="font-bold">NOTE:</span>
                  <br />
                  <span className="whitespace-pre-wrap">{domain.notes}</span>
                </div>
              )}
              {index < receipt.domains.length - 1 && (
                <div className="border-b border-gray-300 border-dotted my-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* QR Code */}
        {receipt.twitterHandle && (
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <QRCodeSVG
                value={`https://twitter.com/${receipt.twitterHandle}`}
                size={120}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        )}

        {/* Receipt Footer */}
        <div className="text-center space-y-2 pt-4 border-t-2 border-black border-dashed">
          <div className="text-sm">{format(new Date(), 'h:mm:ss a')}</div>
          {receipt.twitterHandle && (
            <div className="text-sm">@{receipt.twitterHandle}</div>
          )}
          <div className="font-bold mt-4 text-lg">THANK YOU FOR YOUR BUSINESS!</div>
        </div>
      </Card>

      <Button 
        onClick={downloadReceipt}
        className="mt-4 px-6"
      >
        Download Receipt
      </Button>
    </div>
  );
}