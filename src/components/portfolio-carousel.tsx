"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PortfolioItem as PortfolioItemType } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PortfolioItemComponent = ({
  item,
  alignment,
}: {
  item: PortfolioItemType;
  // onItemClick: (item: PortfolioItemType) => void;
  alignment: "top" | "bottom";
}) => {
  const router = useRouter()

  const navigate = (id: string) => {
    router.push(`/collection/${id}`)
  }

  const infoPositionClass = alignment === "top" ? "top-0" : "bottom-0";

  return (
    <button
      onClick={() => navigate(item.id)}
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
          priority
        />
      )}
      <div className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/20 group-hover:ring-4 group-hover:ring-accent" />
      <span></span>
    </button>
  );
};

interface PortfolioCarouselProps {
  items: PortfolioItemType[];
  direction: "left" | "right";
  alignment: "top" | "bottom";
  // onItemClick: (item: PortfolioItemType) => void;
}

export default function PortfolioCarousel({
  items,
  direction,
  alignment,
  // onItemClick,
}: PortfolioCarouselProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [itemsWidth, setItemsWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const startTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastTranslateRef = useRef(0);
  const interactionStartTime = useRef(0);
  const interactionStartPos = useRef({ x: 0, y: 0 });

  // const duplicatedItems = [...items, ...items, ...items];
  // const speed = direction === "left" ? -0.01 : 0.01;

  const duplicatedItems = items.length > 5 ? [...items, ...items, ...items] : items;
  const speed = direction === 'left' ? -0.03 : 0.03;

  useEffect(() => {
    if (containerRef.current) {
      let totalWidth = 0;
      const itemElements = containerRef.current.querySelectorAll('[data-item-id]');
      itemElements.forEach((el) => {
        totalWidth += (el as HTMLElement).offsetWidth;
      });
      // const singleSetWidth = totalWidth / 3;
      const singleSetWidth = items.length > 5 ? totalWidth / 3 : totalWidth;
      setItemsWidth(singleSetWidth);
      if (direction === 'right') {
        setTranslateX(-singleSetWidth);
      }
    }
  }, [items, direction]);

  const animate = useCallback(
    (currentTime: number) => {
      // if (!isUserInteracting) {
      if (!isUserInteracting && items.length > 5) {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = currentTime;
        }

        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        const effectiveSpeed = isHovering ? speed / 4 : speed;

        setTranslateX((prev) => {
          let newTranslate = prev + effectiveSpeed * deltaTime;

          if (direction === "left" && newTranslate <= -itemsWidth) {
            newTranslate += itemsWidth;
          } else if (direction === "right" && newTranslate >= 0) {
            newTranslate -= itemsWidth;
          }

          return newTranslate;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isUserInteracting, itemsWidth, speed, direction, isHovering, items]
  );

  useEffect(() => {
    // if (itemsWidth > 0) {
    if (itemsWidth > 0 && items.length > 5) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, itemsWidth, items]);

  const handleInteractionStart = (clientX: number, clientY: number) => {
    setIsUserInteracting(true);
    startTouchRef.current = { x: clientX, y: clientY };
    interactionStartPos.current = { x: clientX, y: clientY };
    lastTranslateRef.current = translateX;
    lastTimeRef.current = 0;
    interactionStartTime.current = Date.now();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!startTouchRef.current) return;

    const deltaX = clientX - startTouchRef.current.x;
    const deltaY = Math.abs(clientY - startTouchRef.current.y);

    if (Math.abs(deltaX) > deltaY) {
      setTranslateX(lastTranslateRef.current + deltaX);
    }
  };

  const handleInteractionEnd = (clientX: number) => {
    const endX = clientX;
    const deltaX = endX - interactionStartPos.current.x;
    const deltaTime = Date.now() - interactionStartTime.current;

    if (deltaTime < 200 && Math.abs(deltaX) < 10) {
      const clickedElement = document.elementFromPoint(endX, interactionStartPos.current.y);
      const itemContainer = clickedElement?.closest('[data-item-id]');
      if (itemContainer) {
        const itemId = itemContainer.getAttribute('data-item-id');
        const item = items.find(i => i.id.toString() === itemId);
        // if (item) {
        //   onItemClick(item);
        // }
      }
    }
    
    startTouchRef.current = null;
    setIsUserInteracting(false);
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
        handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => handleInteractionEnd(e.changedTouches[0].clientX);
  
  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX, e.clientY);
  const handleMouseUp = (e: React.MouseEvent) => handleInteractionEnd(e.clientX);

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (startTouchRef.current) {
        handleMouseUp({ clientX: startTouchRef.current.x } as React.MouseEvent);
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsUserInteracting(true); // Pause auto-scroll during wheel

    const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    let scrollAmount = 0;

    if (isHorizontalGesture) {
      scrollAmount = e.deltaX * 2;
    } else {
      scrollAmount = e.deltaY * 1.5;
    }
    
    setTranslateX(prev => {
        let newTranslate = prev - scrollAmount;
        if(items.length > 5) {
         if (direction === "left" && newTranslate <= -itemsWidth) {
            newTranslate += itemsWidth;
          } else if (direction === "right" && newTranslate >= 0) {
            newTranslate -= itemsWidth;
          } else if (direction === "left" && newTranslate > 0) {
            newTranslate -= itemsWidth;
          } else if (direction === "right" && newTranslate < -itemsWidth) {
            newTranslate += itemsWidth;
          }
        }
        return newTranslate;
    });
    
    // Debounce to re-enable auto-scroll
    const timer = setTimeout(() => setIsUserInteracting(false), 200);
    return () => clearTimeout(timer);
  };

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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className={`flex w-max h-full transition-transform duration-300 ease-out ${alignmentClass}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isUserInteracting ? "none" : "transform 0.3s ease-out",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} data-item-id={item.id}>
            <PortfolioItemComponent
              item={item}
              alignment={alignment}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
