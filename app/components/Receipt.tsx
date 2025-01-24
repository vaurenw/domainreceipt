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
    <div className="window w-full max-w-[95vw] md:max-w-[600px] mx-auto">
      <div className="title-bar">
        <div className="title-bar-text">Domain Receipt</div>
      </div>
      <div className="window-body">
        <div className="space-y-4 flex flex-col items-center">
          <Card
            ref={receiptRef}
            className="p-4 md:p-8 w-full max-w-[350px] md:max-w-[400px] bg-white"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              fontFamily: 'Courier, monospace',
            }}
          >
            {/* Receipt Header */}
            <div className="text-center mb-4 md:mb-6 pb-4 border-b-2 border-black border-dashed">
              <div className="text-xl md:text-2xl font-bold tracking-wider mb-2">DOMAIN RECEIPT</div>
              <div className="text-xs md:text-sm">{format(receipt.createdAt, 'EEEE, MMMM d, yyyy').toUpperCase()}</div>
              <div className="text-xs md:text-sm mt-1 font-bold">ORDER #{receipt.receiptNumber}</div>
            </div>

            {/* Receipt Items */}
            <div className="space-y-4 md:space-y-6 mb-4 md:mb-6">
              {receipt.domains.map((domain, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm">
                    <span className="font-bold">DOMAIN NAME:</span>
                    <span className="break-all">{domain.name}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm">
                    <span className="font-bold">REGISTERED:</span>
                    <span>{format(domain.registrationDate, 'MM/dd/yyyy')}</span>
                  </div>
                  {index < receipt.domains.length - 1 && (
                    <div className="border-b border-gray-300 border-dotted my-3 md:my-4"></div>
                  )}
                </div>
              ))}
            </div>

            {/* QR Code */}
            {receipt.twitterHandle && (
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={`https://twitter.com/${receipt.twitterHandle}`}
                    size={100}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            )}

            {/* Receipt Footer */}
            <div className="text-center space-y-2 pt-4 border-t-2 border-black border-dashed">
              <div className="text-xs md:text-sm">{format(new Date(), 'h:mm:ss a')}</div>
              {receipt.twitterHandle && (
                <div className="text-xs md:text-sm">@{receipt.twitterHandle}</div>
              )}
              <div className="font-bold mt-2 md:mt-4 text-base md:text-lg">THANK YOU FOR YOUR BUSINESS!</div>
            </div>
          </Card>

          <Button 
            onClick={downloadReceipt}
            className="mt-4 px-4 md:px-6 w-full md:w-auto"
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}