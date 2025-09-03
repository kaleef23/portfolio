"use client"

import { Josefin_Sans } from 'next/font/google';

export const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin-sans',
  weight: ['300', '400', '600', '700'],
});
// import type {Metadata} from 'next';
import "./globals.css";
import PageTransition from "@/components/page-transition";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" className={josefinSans.variable}>
      <head>
        <link
          rel="preload"
          href="/public/fonts/HelveticaNeue/HelveticaNeue-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        ></link>
        <link rel="preload" href="/public/fonts/HelveticaNeue/HelveticaNeue-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous"></link>
        <title>Kaleef Lawal</title>
        <meta
          name="description"
          content="A portfolio for photographer KALEEF LAWAL"
        />
      </head>
      <body className="font-body antialiased">
        <PageTransition pageKey={pathname}>{children}</PageTransition>
      </body>
    </html>
  );
}
