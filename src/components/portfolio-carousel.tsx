"use client";

import type { PortfolioItem as PortfolioItemType } from "@/lib/types";
import Image from "next/image";

const PortfolioItemComponent = ({ item, onItemClick, alignment }: { item: PortfolioItemType, onItemClick: (item: PortfolioItemType) => void, alignment: 'top' | 'bottom' }) => {
  const infoPositionClass = alignment === 'top' ? 'top-0' : 'bottom-0';

  return (
    <button
      onClick={() => onItemClick(item)}
      className="relative flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background max-h-[60vh] cursor-pointer"
      style={{ width: item.width }}
      aria-label={`View details for ${item.title} by ${item.artistName}`}
    >
      <Image
        src={item.imageUrl}
        alt={`${item.title} by ${item.artistName}`}
        width={400}
        height={600}
        sizes={`(max-width: 768px) 50vw, 33vw`}
        className="w-full h-auto object-cover"
        data-ai-hint="portrait fashion"
      />
      <div className={`absolute left-0 w-full p-2 bg-white/90 text-black ${infoPositionClass}`}>
        <h3 className="text-sm font-headline font-semibold">{item.artistName}</h3>
        <p className="text-xs font-body">{item.title}</p>
      </div>
    </button>
  );
};

interface PortfolioCarouselProps {
  items: PortfolioItemType[];
  direction: 'left' | 'right';
  alignment: 'top' | 'bottom';
  onItemClick: (item: PortfolioItemType) => void;
}

export default function PortfolioCarousel({ items, direction, alignment, onItemClick }: PortfolioCarouselProps) {
  const duplicatedItems = [...items, ...items];
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';
  const alignmentClass = alignment === 'top' ? 'items-start' : 'items-end';

  return (
    <div className="w-full h-full overflow-visible" role="region" aria-label="Portfolio Carousel">
      <div className={`flex w-max h-full ${animationClass} ${alignmentClass}`}>
        {duplicatedItems.map((item, index) => (
          <PortfolioItemComponent key={`${item.id}-${index}`} item={item} onItemClick={onItemClick} alignment={alignment} />
        ))}
      </div>
    </div>
  );
}
