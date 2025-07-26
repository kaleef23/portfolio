"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/slider', label: 'Works' },
  { href: '#', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const NavLink = ({ href, label, className }: { href: string; label: string; className?: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button variant="link" asChild>
      <Link
        href={href}
        className={cn(
          "text-base text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider",
          isActive && "text-foreground font-bold underline underline-offset-4",
          className
        )}
      >
        {label}
      </Link>
    </Button>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full px-4 sm:px-8 lg:px-16 py-2 flex justify-between items-center z-10 h-20 bg-white border-b">
      <div className="text-2xl sm:text-3xl font-bold font-headline tracking-widest">
        <Link href="/">KALEEF LAWAL</Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle></SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="text-2xl font-bold font-headline tracking-widest">
                  <Link href="/" onClick={() => setIsOpen(false)}>KALEEF LAWAL</Link>
                </div>
                {/* <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button> */}
              </div>
              <nav className="flex-1 flex flex-col items-center justify-center gap-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    className="text-2xl"
                  />
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
