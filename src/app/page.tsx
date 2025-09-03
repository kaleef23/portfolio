"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Collection, PortfolioItem } from "@/lib/types";
import Navigation from "@/components/navigation";
import { useRouter } from "next/navigation";
import { getCollections } from "./admin/action";

const menuItems = ["Home", "Work", "Shop", "About", "Contact"];

// Custom hook for time-based animation
const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
};

export default function Home() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections: Collection[] = await getCollections();
        const portfolioItems: PortfolioItem[] = collections.map(
          (collection) => ({
            id: collection.id,
            artistName: "Dele Kaleef",
            title: collection.title,
            imageUrl: collection.posterImageUrl,
            width: "180px",
            shopifyUrl: `/collection/${collection.id}`,
            category: collection.posterImageCategory || "image",
            // ADDED: Default orientation if not provided
            orientation: collection.orientation,
          })
        );
        console.log("items: ", portfolioItems);

        setItems(portfolioItems);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // MODIFIED: Arrange items in portrait-landscape alternating pattern
  const arrangeItemsInPattern = useCallback((allItems: PortfolioItem[]) => {
    // Separate items by orientation
    const portraitItems = allItems.filter(item => item.orientation === "portrait");
    const landscapeItems = allItems.filter(item => item.orientation === "landscape");
    
    const topItems: PortfolioItem[] = [];
    const bottomItems: PortfolioItem[] = [];
    
    // Create alternating pattern: portrait, landscape, portrait, landscape...
    let portraitIndex = 0;
    let landscapeIndex = 0;
    
    for (let i = 0; i < allItems.length; i++) {
      if (i % 2 === 0 && portraitIndex < portraitItems.length) {
        // Even index: portrait
        if (i % 4 < 2) {
          topItems.push(portraitItems[portraitIndex]);
        } else {
          bottomItems.push(portraitItems[portraitIndex]);
        }
        portraitIndex++;
      } else if (landscapeIndex < landscapeItems.length) {
        // Odd index: landscape
        if (i % 4 < 2) {
          topItems.push(landscapeItems[landscapeIndex]);
        } else {
          bottomItems.push(landscapeItems[landscapeIndex]);
        }
        landscapeIndex++;
      } else if (portraitIndex < portraitItems.length) {
        // If we run out of landscape items, continue with portraits
        if (i % 4 < 2) {
          topItems.push(portraitItems[portraitIndex]);
        } else {
          bottomItems.push(portraitItems[portraitIndex]);
        }
        portraitIndex++;
      }
    }
    
    return { topItems, bottomItems };
  }, []);

  const { topItems, bottomItems } = arrangeItemsInPattern(items);

  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Dynamic content width calculation - MODIFIED to account for different sizes
  const [topContentWidth, setTopContentWidth] = useState(0);
  const [bottomContentWidth, setBottomContentWidth] = useState(0);

  // Calculate content width when items load - MODIFIED for different sizes
  useEffect(() => {
    if (topItems.length > 0) {
      const width = topItems.reduce((total, item) => {
        return total + (item.orientation === "portrait" ? 200 : 300);
      }, 0);
      setTopContentWidth(width);
    }
    if (bottomItems.length > 0) {
      const width = bottomItems.reduce((total, item) => {
        return total + (item.orientation === "portrait" ? 200 : 300);
      }, 0);
      setBottomContentWidth(width);
    }
  }, [topItems, bottomItems]);

  // Separate speed controls for each marquee
  const topSpeed = useRef(1);
  const bottomSpeed = useRef(1);
  
  const topTargetSpeed = useRef(0.9);
  const bottomTargetSpeed = useRef(0.9);

  // Position tracking - initialize bottom to negative content width
  const topPosition = useRef(0);
  const bottomPosition = useRef(0);

  // Initialize bottom position when content width is calculated
  useEffect(() => {
    if (bottomContentWidth > 0) {
      bottomPosition.current = -bottomContentWidth;
    }
  }, [bottomContentWidth]);

  // Drag state
  const [topIsDragging, setTopIsDragging] = useState(false);
  const [bottomIsDragging, setBottomIsDragging] = useState(false);
  const topDragStart = useRef(0);
  const bottomDragStart = useRef(0);
  const topStartPosition = useRef(0);
  const bottomStartPosition = useRef(0);

  // Time-based animation callback
  const animate = useCallback((deltaTime: number) => {
    if (topTrackRef.current && bottomTrackRef.current && topContentWidth > 0 && bottomContentWidth > 0) {
      const normalizedDelta = deltaTime / 16.67; // Normalize to 60fps
      
      // Only animate automatically if not being dragged
      if (!topIsDragging) {
        topSpeed.current += (topTargetSpeed.current - topSpeed.current) * 0.1;
        topPosition.current -= 0.9 * topSpeed.current * normalizedDelta;

        // Reset position when it goes too far
        if (topPosition.current <= -topContentWidth) {
          topPosition.current = 0;
        }
      }

      if (!bottomIsDragging) {
        bottomSpeed.current += (bottomTargetSpeed.current - bottomSpeed.current) * 0.1;
        bottomPosition.current += 0.9 * bottomSpeed.current * normalizedDelta;

        // Reset position when it goes too far
        if (bottomPosition.current >= 0) {
          bottomPosition.current = -bottomContentWidth;
        }
      }

      // Apply transforms
      topTrackRef.current.style.transform = `translateX(${topPosition.current}px)`;
      bottomTrackRef.current.style.transform = `translateX(${bottomPosition.current}px)`;
    }
  }, [topIsDragging, bottomIsDragging, topContentWidth, bottomContentWidth]);

  // Use the custom animation frame hook
  useAnimationFrame(animate);

  // Hover handlers
  const handleTopHover = (slow: boolean) => {
    if (!topIsDragging) {
      topTargetSpeed.current = slow ? 0.3 : 0.9;
    }
  };

  const handleBottomHover = (slow: boolean) => {
    if (!bottomIsDragging) {
      bottomTargetSpeed.current = slow ? 0.3 : 0.9;
    }
  };

  // Drag handlers for top marquee
  const handleTopMouseDown = (e: React.MouseEvent) => {
    setTopIsDragging(true);
    topDragStart.current = e.clientX;
    topStartPosition.current = topPosition.current;
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const handleTopTouchStart = (e: React.TouchEvent) => {
    setTopIsDragging(true);
    topDragStart.current = e.touches[0].clientX;
    topStartPosition.current = topPosition.current;
    e.preventDefault();
  };

  // Drag handlers for bottom marquee
  const handleBottomMouseDown = (e: React.MouseEvent) => {
    setBottomIsDragging(true);
    bottomDragStart.current = e.clientX;
    bottomStartPosition.current = bottomPosition.current;
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const handleBottomTouchStart = (e: React.TouchEvent) => {
    setBottomIsDragging(true);
    bottomDragStart.current = e.touches[0].clientX;
    bottomStartPosition.current = bottomPosition.current;
    e.preventDefault();
  };

  // Global mouse/touch handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (topIsDragging && topContentWidth > 0) {
        const deltaX = e.clientX - topDragStart.current;
        topPosition.current = topStartPosition.current + deltaX;
        // Handle wrapping
        if (topPosition.current > 0) {
          topPosition.current =
            -topContentWidth + (topPosition.current % topContentWidth);
        } else if (topPosition.current < -topContentWidth) {
          topPosition.current = topPosition.current % topContentWidth;
        }
      }

      if (bottomIsDragging && bottomContentWidth > 0) {
        const deltaX = e.clientX - bottomDragStart.current;
        bottomPosition.current = bottomStartPosition.current + deltaX;
        // Handle wrapping
        if (bottomPosition.current > 0) {
          bottomPosition.current =
            -bottomContentWidth + (bottomPosition.current % bottomContentWidth);
        } else if (bottomPosition.current < -bottomContentWidth) {
          bottomPosition.current = bottomPosition.current % bottomContentWidth;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (topIsDragging && topContentWidth > 0) {
        const deltaX = e.touches[0].clientX - topDragStart.current;
        topPosition.current = topStartPosition.current + deltaX;
        // Handle wrapping
        if (topPosition.current > 0) {
          topPosition.current =
            -topContentWidth + (topPosition.current % topContentWidth);
        } else if (topPosition.current < -topContentWidth) {
          topPosition.current = topPosition.current % topContentWidth;
        }
      }

      if (bottomIsDragging && bottomContentWidth > 0) {
        const deltaX = e.touches[0].clientX - bottomDragStart.current;
        bottomPosition.current = bottomStartPosition.current + deltaX;
        // Handle wrapping
        if (bottomPosition.current > 0) {
          bottomPosition.current =
            -bottomContentWidth + (bottomPosition.current % bottomContentWidth);
        } else if (bottomPosition.current < -bottomContentWidth) {
          bottomPosition.current = bottomPosition.current % bottomContentWidth;
        }
      }
    };

    const handleMouseUp = () => {
      setTopIsDragging(false);
      setBottomIsDragging(false);
      document.body.style.cursor = "";
    };

    const handleTouchEnd = () => {
      setTopIsDragging(false);
      setBottomIsDragging(false);
    };

    if (topIsDragging || bottomIsDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [topIsDragging, bottomIsDragging, topContentWidth, bottomContentWidth]);

  const router = useRouter();

  const navigate = (id: string) => {
    router.push(`/collection/${id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br flex flex-col justify-between relative font-josephin">
      {/* Top Marquee (Left to Right) */}
      <div
        className="w-full fixed top-0 left-0 z-20 overflow-hidden whitespace-nowrap select-none flex items-center"
        onMouseEnter={() => handleTopHover(true)}
        onMouseLeave={() => handleTopHover(false)}
        style={{ cursor: topIsDragging ? "grabbing" : "grab" }}
      >
        <div
          ref={topTrackRef}
          className="inline-flex"
          style={{ willChange: "transform" }}
          onMouseDown={handleTopMouseDown}
          onTouchStart={handleTopTouchStart}
        >
          {[...topItems, ...topItems, ...topItems].map((item, i) => (
            <div
              onClick={() => navigate(item.id)}
              key={`top-${item.id}-${i}`}
              className="flex-shrink-0 cursor-pointer"
            >
              {item.category === "video" ? (
                <div className="bg-black">
                  <video
                    src={item.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    // MODIFIED: Different sizes based on orientation
                    className={item.orientation === "portrait" 
                      ? "w-[200px] h-[300px] object-cover" 
                      : "w-[300px] h-[200px] object-cover"}
                    preload="metadata"
                    style={{
                      border: "none !important",
                      outline: "none !important",
                      boxShadow: "none !important",
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={item.imageUrl}
                  alt="Gallery image"
                  // MODIFIED: Different sizes based on orientation
                  width={item.orientation === "portrait" ? 200 : 300}
                  height={item.orientation === "portrait" ? 300 : 200}
                  className={item.orientation === "portrait" 
                    ? "w-[200px] h-[300px] object-cover" 
                    : "w-[300px] h-[200px] object-cover"}
                  priority={i < 3}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Menu */}
      <Navigation />

      {/* Bottom Marquee (Right to Left) */}
      <div
        className="w-full fixed bottom-0 left-0 z-20 overflow-hidden whitespace-nowrap select-none flex items-end"
        onMouseEnter={() => handleBottomHover(true)}
        onMouseLeave={() => handleBottomHover(false)}
        style={{ cursor: bottomIsDragging ? "grabbing" : "grab" }}
      >
        <div
          ref={bottomTrackRef}
          className="inline-flex items-end"
          style={{ willChange: "transform" }}
          onMouseDown={handleBottomMouseDown}
          onTouchStart={handleBottomTouchStart}
        >
          {[...bottomItems, ...bottomItems, ...bottomItems].map((item, i) => (
            <div
              onClick={() => navigate(item.id)}
              key={`bottom-${item.id}-${i}`}
              className="flex-shrink-0 cursor-pointer"
            >
              {item.category === "video" ? (
                <div className="bg-black">
                  <video
                    src={item.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    // MODIFIED: Different sizes based on orientation
                    className={item.orientation === "portrait" 
                      ? "w-[200px] h-[300px] object-cover" 
                      : "w-[300px] h-[200px] object-cover"}
                    preload="metadata"
                    style={{
                      transform: "translateZ(0)", // The key fix - forces GPU layer
                      backfaceVisibility: "hidden",
                      perspective: 1000,
                      border: "none", // Keeps your original fix for borders
                      outline: "none",
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={item.imageUrl}
                  alt="Gallery image"
                  // MODIFIED: Different sizes based on orientation
                  width={item.orientation === "portrait" ? 200 : 300}
                  height={item.orientation === "portrait" ? 300 : 200}
                  className={item.orientation === "portrait" 
                    ? "w-[200px] h-[300px] object-cover" 
                    : "w-[300px] h-[200px] object-cover"}
                  priority={i < 3}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
