import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <div className="fixed left-0 w-full top-1/2 -translate-y-1/2 z-30 pointer-events-none font-josephin">
      <nav className="w-full sm:px-8 lg:px-56 md:space-x-8 py-2 flex justify-around items-center h-20 bg-transparent pointer-events-auto">
        <Button variant="link" asChild>
          <Link
            href="/works"
            className="text-[2px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
          >
            Works
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link
            href="https://kaleeflawalprints.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[2px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
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
            className="text-[2px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
          >
            About
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link
            href="/contact"
            className="text-[2px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
          >
            Contact
          </Link>
        </Button>
      </nav>
    </div>
  );
}