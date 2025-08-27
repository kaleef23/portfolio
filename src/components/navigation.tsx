import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <div  className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10">
    <nav className="w-full px-2 sm:px-8 lg:px-56 py-2 flex justify-between items-center z-10 h-20 bg-white">
      <Button variant="link" asChild>
        <Link
          href="/works"
          className="text-[4px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
        >
          Works
        </Link>
      </Button>
      <Button variant="link" asChild>
        <Link
          href="#"
          className="text-[4px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
        >
          Shop
        </Link>
      </Button>
      <div className="text-sm sm:text-3xl font-bold font-headline tracking-widest text-center">
        <Link href="/">KALEEF LAWAL</Link>
      </div>
      <Button variant="link" asChild>
        <Link
          href="/about"
          className="text-[4px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
        >
          About
        </Link>
      </Button>
      <Button variant="link" asChild>
        <Link
          href="/contact"
          className="text-[4px] sm:text-base md:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider"
        >
          Contact
        </Link>
      </Button>
    </nav>
    </div>
  );
}