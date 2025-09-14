"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PortfolioItem } from "@/lib/types";
import Image from "next/image";
import RetryImage from "./retry-image";

interface FullScreenSliderProps {
  items: PortfolioItem[];
}

const SliderItem = ({ item }: { item: PortfolioItem }) => {
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  return (
    <div className="h-full flex-shrink-0 flex items-center justify-center overflow-hidden">
      {item.category === "video" ? (
        <video
          src={item.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-auto h-auto max-w-full max-h-screen object-contain"
        />
      ) : (
        <Image
          src={item.imageUrl}
          alt={`${item.title} by ${item.artistName}`}
          width={1000}
          height={1000}
          className={`w-auto object-contain ${isPortrait ? "h-screen object-contain" : "max-h-[80%]"}`}
          onLoadingComplete={(img) => {
            setIsPortrait(img.naturalHeight > img.naturalWidth);
          }}
        />
      )}
    </div>
  );
}

export default function FullScreenSlider({ items }: FullScreenSliderProps) {
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTouchRef = useRef<number | null>(null);
  const lastTranslateRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getBoundaries = () => {
    if (!containerRef.current) return { min: 0, max: 0 };
    const max = 0;
    const min = -(containerRef.current.scrollWidth - window.innerWidth);
    return { min, max };
  };

  const handleInteractionStart = (clientX: number) => {
    if (isMobile) return;
    isDraggingRef.current = true;
    startTouchRef.current = clientX;
    lastTranslateRef.current = translateX;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
      containerRef.current.style.userSelect = 'none';
    }
  };

  const handleInteractionMove = (clientX: number) => {
    if (isMobile || !isDraggingRef.current || startTouchRef.current === null) return;

    const deltaX = clientX - startTouchRef.current;
    const newTranslateX = lastTranslateRef.current + deltaX;

    const { min, max } = getBoundaries();
    const boundedX = Math.max(Math.min(newTranslateX, max), min);

    setTranslateX(boundedX);
  };

  const handleInteractionEnd = () => {
    if (isMobile) return;
    isDraggingRef.current = false;
    startTouchRef.current = null;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
      containerRef.current.style.userSelect = 'auto';
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isMobile) return;

    e.preventDefault();
    const scrollAmount = e.deltaX + e.deltaY;

    const newTranslateX = translateX - scrollAmount;
    const { min, max } = getBoundaries();
    const boundedX = Math.max(Math.min(newTranslateX, max), min);

    setTranslateX(boundedX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) handleInteractionStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) handleInteractionMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center">
        {items.map((item) => (
          <div key={item.id} className="flex justify-center h-[220px] w-full">
            {item.category === "video" ? (
              <video
                src={item.imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="object-contain w-full h-full"
              />
            ) : (
              <RetryImage
                src={item.imageUrl}
                alt={`${item.title} by ${item.artistName}`}
                width={1000}
                height={1000}
                className="object-contain w-full h-full"
              />
            )}
          </div>
        ))}
      </div>
    );
  }



  return (
    <div
      className={`w-full ${isMobile ? 'overflow-y-auto overflow-x-hidden' : 'h-full overflow-hidden cursor-grab'}`}
      onMouseDown={isMobile ? undefined : handleMouseDown}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseUp={isMobile ? undefined : handleInteractionEnd}
      onMouseLeave={isMobile ? undefined : handleInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleInteractionEnd}
      onWheel={isMobile ? undefined : handleWheel}
    >
      <div
        ref={containerRef}
        className="flex w-max h-full"
        style={{
          transform: isMobile ? 'none' : `translateX(${translateX}px)`,
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