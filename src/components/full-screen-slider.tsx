"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PortfolioItem } from "@/lib/types";
import Image from "next/image";

interface FullScreenSliderProps {
  items: PortfolioItem[];
}

const SliderItem = ({ item }: { item: PortfolioItem }) => {
  return (
    <div
      className="relative flex-shrink-0 h-full flex items-center justify-center overflow-hidden"
    >
      {item.category === "video" ? (
        <video
          src={item.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-auto h-auto max-w-full max-h-full object-contain"
        />
      ) : (
        <Image
          src={item.imageUrl}
          alt={`${item.title} by ${item.artistName}`}
          width={1200}
          height={800}
          className="w-auto h-auto max-w-full max-h-full object-contain"
          data-ai-hint="portrait fashion"
          priority
        />
      )}
    </div>
  );
};


export default function FullScreenSlider({ items }: FullScreenSliderProps) {
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTouchRef = useRef<number | null>(null);
  const lastTranslateRef = useRef(0);
  const isDraggingRef = useRef(false);

  const getBoundaries = () => {
    if (!containerRef.current) return { min: 0, max: 0 };
    const max = 0;
    const min = -(containerRef.current.scrollWidth - window.innerWidth);
    return { min, max };
  };

  const handleInteractionStart = (clientX: number) => {
    isDraggingRef.current = true;
    startTouchRef.current = clientX;
    lastTranslateRef.current = translateX;
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
        containerRef.current.style.userSelect = 'none';
    }
  };

  const handleInteractionMove = (clientX: number) => {
    if (!isDraggingRef.current || startTouchRef.current === null) return;
    
    const deltaX = clientX - startTouchRef.current;
    const newTranslateX = lastTranslateRef.current + deltaX;

    const { min, max } = getBoundaries();
    const boundedX = Math.max(Math.min(newTranslateX, max), min);
    
    setTranslateX(boundedX);
  };

  const handleInteractionEnd = () => {
    isDraggingRef.current = false;
    startTouchRef.current = null;
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
        containerRef.current.style.userSelect = 'auto';
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scrollAmount = e.deltaX + e.deltaY;
    
    const newTranslateX = translateX - scrollAmount;
    const { min, max } = getBoundaries();
    const boundedX = Math.max(Math.min(newTranslateX, max), min);

    setTranslateX(boundedX);
  };

  const handleTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleInteractionMove(e.touches[0].clientX);

  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX);

  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleInteractionEnd}
      onWheel={handleWheel}
    >
      <div
        ref={containerRef}
        className="flex w-max h-full"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDraggingRef.current ? "none" : "transform 0.3s ease-out",
        }}
      >
        {items.map((item) => (
          <SliderItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
