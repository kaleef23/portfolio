import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex-grow flex items-center justify-center z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <nav className="hidden md:block text-center">
          <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
            <Button variant="link" asChild className="flex-1 min-w-[80px]">
              <Link
                href="/works"
                className="text-sm md:text-base text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Works
              </Link>
            </Button>
            <Button variant="link" asChild className="flex-1 min-w-[80px]">
              <Link
                href="#"
                className="text-sm md:text-base text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Shop
              </Link>
            </Button>
            <div className="flex-1 text-lg sm:text-xl md:text-2xl font-bold font-headline tracking-widest text-center min-w-[180px] mx-2">
              <Link href="/">KALEEF LAWAL</Link>
            </div>
            <Button variant="link" asChild className="flex-1 min-w-[80px]">
              <Link
                href="/about"
                className="text-sm md:text-base text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                About
              </Link>
            </Button>
            <Button variant="link" asChild className="flex-1 min-w-[80px]">
              <Link
                href="/contact"
                className="text-sm md:text-base text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Contact
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          <div className="text-lg font-bold font-headline tracking-widest">
            <Link href="/">KALEEF LAWAL</Link>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-foreground/80 hover:text-foreground"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <Button variant="link" asChild className="justify-start">
                <Link
                  href="/works"
                  className="text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Works
                </Link>
              </Button>
              <Button variant="link" asChild className="justify-start">
                <Link
                  href="#"
                  className="text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
              </Button>
              <Button variant="link" asChild className="justify-start">
                <Link
                  href="/about"
                  className="text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </Button>
              <Button variant="link" asChild className="justify-start">
                <Link
                  href="/contact"
                  className="text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}