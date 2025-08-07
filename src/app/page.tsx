"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { Collection, PortfolioItem } from "@/lib/types";
import Navigation from "@/components/navigation";
import PortfolioCarousel from "@/components/portfolio-carousel";
import { getCollections } from "./admin/action";

export default function Home() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnterAnimationComplete, setIsEnterAnimationComplete] = useState(false);
  const topCarouselRef = useRef<HTMLDivElement>(null);
  const bottomCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections: Collection[] = await getCollections();
        const portfolioItems: PortfolioItem[] = collections.map(
          (collection) => ({
            id: collection.id,
            artistName: 'Dele Kaleef',
            title: collection.title,
            imageUrl: collection.posterImageUrl,
            width: '180px',
            shopifyUrl: `/collection/${collection.id}`,
            category: collection.posterImageCategory || 'image',
          })
        );
        setItems(portfolioItems);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Split items evenly between top and bottom
  const halfLength = Math.ceil(items.length / 2);
  const topItems = items.slice(0, halfLength);
  const bottomItems = items.slice(halfLength);

  // Handle enter animation completion
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsEnterAnimationComplete(true);
      }, 1000); // Wait 1 second after loading before starting scroll
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-background text-foreground overflow-hidden">
      {/* Top Carousel */}
      <motion.div
        ref={topCarouselRef}
        className="absolute top-0 left-0 w-full h-1/2"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // Custom easing for smoother entry
        }}
      >
        <PortfolioCarousel
          items={topItems}
          direction="left"
          alignment="top"
          shouldAnimate={isEnterAnimationComplete} // Only animate after entrance
        />
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.5, 
          ease: "easeInOut" 
        }}
      >
        <Navigation />
      </motion.div>

      {/* Bottom Carousel */}
      <motion.div
        ref={bottomCarouselRef}
        className="absolute bottom-0 left-0 w-full h-1/2"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // Custom easing for smoother entry
        }}
      >
        <PortfolioCarousel
          items={bottomItems}
          direction="right"
          alignment="bottom"
          shouldAnimate={isEnterAnimationComplete} // Only animate after entrance
        />
      </motion.div>
    </div>
  );
}