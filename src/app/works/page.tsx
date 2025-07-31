
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const images = {
  default: 'https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/kaleef_lawal_07.jpg?updatedAt=1752041052715',
  artistic: 'https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/kaleef_lawal_07.jpg?updatedAt=175204105271',
  commercial: 'https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/schlau%20x%20kaleef%2032.jpg?updatedAt=1752041052497',
};

const imageHints = {
  default: 'abstract texture',
  artistic: 'artistic portrait',
  commercial: 'product photography',
};

export default function WorksPage() {
  const [activeCategory, setActiveCategory] = useState<'default' | 'artistic' | 'commercial'>('default');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
        <AnimatePresence>
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={images[activeCategory]}
              alt={activeCategory}
              fill
              className="object-cover"
              data-ai-hint={imageHints[activeCategory]}
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        <div 
          className="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-8 sm:flex-row"
          onMouseLeave={() => setActiveCategory('default')}
        >
          <Link href="/artistic">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white text-xl sm:text-2xl px-12 py-8 font-headline tracking-wider backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setActiveCategory('artistic')}
            >
              Artistic
            </Button>
          </Link>
          <Link href="/commercial" >
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white text-xl sm:text-2xl px-12 py-8 font-headline tracking-wider backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setActiveCategory('commercial')}
            >
              Commercial
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
