"use client";

import { useState } from "react";
import { portfolioItems } from "@/data/portfolio-items";
import type { PortfolioItem } from "@/lib/types";
import Navigation from "@/components/navigation";
import PortfolioCarousel from "@/components/portfolio-carousel";
import PortfolioModal from "@/components/portfolio-modal";

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
      <div className="absolute top-0 left-0 w-full h-1/2">
        <PortfolioCarousel
          items={portfolioItems}
          direction="left"
          alignment="top"
          onItemClick={handleItemClick}
        />
      </div>

      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10">
        <Navigation />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2">
        <PortfolioCarousel
          items={[...portfolioItems].reverse()}
          direction="right"
          alignment="bottom"
          onItemClick={handleItemClick}
        />
      </div>
      
      <PortfolioModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
}
