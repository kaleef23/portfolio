import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  return (
    <nav className="w-full px-4 sm:px-8 py-4 flex justify-between items-center z-10 h-24">
      <Button variant="link" asChild>
        <Link href="#" className="text-base sm:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider">Artists</Link>
      </Button>
      <div className="text-2xl sm:text-3xl font-bold font-headline tracking-widest text-center">
        <Link href="/">DELE KALEEF</Link>
      </div>
      <Button variant="link" asChild>
        <Link href="#" className="text-base sm:text-lg text-foreground/80 hover:text-foreground font-headline uppercase tracking-wider">About</Link>
      </Button>
    </nav>
  );
}
