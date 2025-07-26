<<<<<<< HEAD
"use client";

// import type {Metadata} from 'next';
import "./globals.css";
import PageTransition from "@/components/page-transition";
import { usePathname } from "next/navigation";
=======
'use client'

import type {Metadata} from 'next';
import './globals.css';
import PageTransition from '@/components/page-transition';
import { usePathname } from 'next/navigation';
>>>>>>> 7bbf5bdef6f05944d7729f6d5d7c3f59651e1c3a

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
<<<<<<< HEAD
        <link
          rel="preload"
          href="/public/fonts/HelveticaNeue-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        ></link>
        <link rel="preload" href="/public/fonts/HelveticaNeue-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous"></link>
        <title>Kaleef Lawal</title>
        <meta
          name="description"
          content="A portfolio for photographer KALEEF LAWAL"
        />
      </head>
      <body className="font-body antialiased">
        <PageTransition pageKey={pathname}>{children}</PageTransition>
=======
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
>>>>>>> 7bbf5bdef6f05944d7729f6d5d7c3f59651e1c3a
      </body>
    </html>
  );
}
