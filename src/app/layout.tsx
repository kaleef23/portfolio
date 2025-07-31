"use client";

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
    <html lang="en">
      <head>
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
      </body>
    </html>
  );
}
