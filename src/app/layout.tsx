'use client'

import type {Metadata} from 'next';
import './globals.css';
import PageTransition from '@/components/page-transition';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <title>Kaleef Lawal</title>
        <meta name="description" content="A portfolio for photographer KALEEF LAWAL" />
      </head>
      <body className="font-body antialiased">
        <PageTransition pageKey={pathname}>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
