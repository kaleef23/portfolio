
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Collection, PortfolioItem } from "@/lib/types";
import Navigation from "@/components/navigation";
import PortfolioCarousel from "@/components/portfolio-carousel";
import { getCollections } from "./admin/action";

export default function Home() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections: Collection[] = await getCollections();
        const portfolioItems: PortfolioItem[] = collections.map(
          (collection) => ({
            id: collection.id, // Use Firestore document ID
            artistName: 'Dele Kaleef',
            title: collection.title,
            // description: collection.description,
            imageUrl: collection.posterImageUrl,
            width: '180px', // or make this dynamic if needed
            shopifyUrl: `/collection/${collection.id}`, // Link to collection page
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

  const topItems = items.slice(0, 24);
  const bottomItems = items.slice(24, 48);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-background text-foreground overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <PortfolioCarousel
          items={topItems}
          direction="left"
          alignment="top"
          // onItemClick={handleItemClick}
        />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
      >
        <Navigation />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <PortfolioCarousel
          items={bottomItems.length > 0 ? bottomItems : [...topItems].reverse()}
          direction="right"
          alignment="bottom"
          // onItemClick={handleItemClick}
        />
      </motion.div>
      
      
    </div>
  );
}
