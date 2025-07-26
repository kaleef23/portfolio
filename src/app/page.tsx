
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioItems } from "@/data/portfolio-items";
import type { PortfolioItem } from "@/lib/types";
import Navigation from "@/components/navigation";
import PortfolioCarousel from "@/components/portfolio-carousel";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="relative h-full bg-background text-foreground overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <PortfolioCarousel
          items={portfolioItems}
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
          items={[...portfolioItems].reverse()}
          direction="right"
          alignment="bottom"
          // onItemClick={handleItemClick}
        />
      </motion.div>
      
      
    </div>
  );
}
