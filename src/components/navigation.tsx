import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <div className="flex-grow flex items-center justify-center z-30 mt-96 mb-64 sm:m-0">
      <div className="w-full max-w-7xl mx-auto">
        <nav className="text-center">
          <div className="flex sm:space-x-5 justify-center">
            <Button variant="link" asChild>
              <Link
                href="/works"
                className="text-[3px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Works
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href="#"
                className="text-[3px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Shop
              </Link>
            </Button>
            <div className="text-xs sm:text-3xl font-bold font-headline tracking-widest text-center">
              <Link href="/">KALEEF LAWAL</Link>
            </div>
            <Button variant="link" asChild>
              <Link
                href="/about"
                className="text-[3px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                About
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href="/contact"
                className="text-[3px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
              >
                Contact
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
