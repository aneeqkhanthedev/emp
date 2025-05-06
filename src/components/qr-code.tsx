'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface QRCodeDisplayProps {
  text: string;
  size?: number;
  alt?: string;
}

export default function QRCodeDisplay({ text, size = 200, alt = 'QR Code' }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setError(null); // Reset error on text change

    if (!text) {
        setError('No text provided for QR code generation.');
        setQrCodeUrl(null); // Clear previous QR code if text is empty
        return;
    }

    QRCode.toDataURL(text, { errorCorrectionLevel: 'H', width: size })
      .then(url => {
        if (isMounted) {
          setQrCodeUrl(url);
        }
      })
      .catch(err => {
        console.error('QR Code generation failed:', err);
        if (isMounted) {
            setError('Failed to generate QR code.');
            setQrCodeUrl(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text, size]); // Re-generate when text or size changes

  if (error) {
    return <div className="text-destructive text-center p-4 border border-destructive rounded-md bg-destructive/10" style={{ width: size, height: size }}>{error}</div>;
  }

  if (!qrCodeUrl) {
    return <Skeleton className="rounded-lg" style={{ width: size, height: size }} />;
  }

  return (
    <Image
      src={qrCodeUrl}
      alt={alt}
      width={size}
      height={size}
      className="rounded-lg shadow-md"
    />
  );
}
