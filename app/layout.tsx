import React from 'react';
import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'KrishiMitra AI - Premium 3D Agriculture Dashboard',
  description: 'A premium nature-inspired agriculture dashboard featuring real-time AI disease scanning, 3D soil sensor telemetry, and agricultural assistants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
