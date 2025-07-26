"use client"

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background text-foreground/60 py-6 px-4 sm:px-8 lg:px-16 border-t">
      <div className="max-w-5xl mx-auto text-center text-sm font-body">
        <p>&copy; {currentYear} Kaleef Lawal. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
