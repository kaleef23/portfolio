"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PortfolioItem as PortfolioItemType } from "@/lib/types";
import Image from "next/image";

const PortfolioItemComponent = ({
  item,
  onItemClick,
  alignment,
}: {
  item: PortfolioItemType;
  onItemClick: (item: PortfolioItemType) => void;
  alignment: "top" | "bottom";
}) => {
  const infoPositionClass = alignment === "top" ? "top-0" : "bottom-0";

  return (
    <button
      onClick={() => onItemClick(item)}
      className="relative group flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background max-h-[65vh] cursor-pointer"
      style={{ width: item.width }}
      aria-label={`View details for ${item.title} by ${item.artistName}`}
    >
      {item.category === 'video' ? (
        <video
          src={item.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={item.imageUrl}
          alt={`${item.title} by ${item.artistName}`}
          width={400}
          height={600}
          sizes={`(max-width: 768px) 50vw, 33vw`}
          className="w-full h-auto object-cover"
          data-ai-hint="portrait fashion"
        />
      )}
      <div className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/20 group-hover:ring-4 group-hover:ring-accent" />
    </button>
  );
};

interface PortfolioCarouselProps {
  items: PortfolioItemType[];
  direction: "left" | "right";
  alignment: "top" | "bottom";
  onItemClick: (item: PortfolioItemType) => void;
}

export default function PortfolioCarousel({
  items,
  direction,
  alignment,
  onItemClick,
}: PortfolioCarouselProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsWidth, setItemsWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const startTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastTranslateRef = useRef(0);

  const duplicatedItems = [...items, ...items, ...items]; // Triple for smoother infinite scroll
  const speed = direction === "left" ? -0.01 : 0.01; // pixels per millisecond

  // Calculate widths
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      setContainerWidth(containerRect.width);

      // Calculate total width of items
      const itemElements = container.querySelectorAll("[data-item]");
      let totalWidth = 0;
      itemElements.forEach((el) => {
        totalWidth += el.getBoundingClientRect().width;
      });
      setItemsWidth(totalWidth / 3); // Divide by 3 because we tripled the items
    }
  }, [items]);

  // Auto-scroll animation
  const animate = useCallback(
    (currentTime: number) => {
      if (!isUserInteracting && itemsWidth > 0) {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = currentTime;
        }

        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;
        
        const effectiveSpeed = isHovering ? speed / 4 : speed;

        setTranslateX((prev) => {
          let newTranslate = prev + effectiveSpeed * deltaTime;

          // Reset position for infinite scroll
          if (direction === "left" && newTranslate <= -itemsWidth) {
            newTranslate = 0;
          } else if (direction === "right" && newTranslate >= 0) {
            newTranslate = -itemsWidth;
          }

          return newTranslate;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isUserInteracting, itemsWidth, speed, direction, isHovering]
  );

  // Start animation
  useEffect(() => {
    if (itemsWidth > 0) {
      // Set initial position
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, itemsWidth, direction]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startTouchRef.current = { x: touch.clientX, y: touch.clientY };
    lastTranslateRef.current = translateX;
    setIsUserInteracting(true);
    lastTimeRef.current = 0; // Reset animation timer
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startTouchRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouchRef.current.x;
    const deltaY = Math.abs(touch.clientY - startTouchRef.current.y);

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > deltaY) {
      e.preventDefault();
      setTranslateX(lastTranslateRef.current + deltaX);
    }
  };

  const handleTouchEnd = () => {
    startTouchRef.current = null;
    setIsUserInteracting(false);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    startTouchRef.current = { x: e.clientX, y: e.clientY };
    lastTranslateRef.current = translateX;
    setIsUserInteracting(true);
    lastTimeRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startTouchRef.current) return;

    const deltaX = e.clientX - startTouchRef.current.x;
    const deltaY = Math.abs(e.clientY - startTouchRef.current.y);

    if (Math.abs(deltaX) > deltaY) {
      e.preventDefault();
      setTranslateX(lastTranslateRef.current + deltaX);
    }
  };

  const handleMouseUp = () => {
    startTouchRef.current = null;
    setIsUserInteracting(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if(startTouchRef.current){
        handleMouseUp();
    }
  }

  const alignmentClass = alignment === "top" ? "items-start" : "items-end";

  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      role="region"
      aria-label="Portfolio Carousel"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={startTouchRef.current ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
    >
      <div
        className={`flex w-max h-full transition-transform duration-300 ease-out ${alignmentClass}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transitionDuration: isUserInteracting ? "0ms" : "300ms",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} data-item>
            <PortfolioItemComponent
              item={item}
              onItemClick={onItemClick}
              alignment={alignment}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
