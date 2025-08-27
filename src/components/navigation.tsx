import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <div className="fixed left-0 w-full top-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <nav className="w-full sm:px-8 lg:px-56 py-2 flex justify-center items-center h-20 bg-white pointer-events-auto">
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
      </nav>
    </div>
  );
}