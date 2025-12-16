"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteContent, WorksImages } from "@/lib/types";
import { getSiteContent, getWorksImages } from "../admin/action";

const imageHints = {
  default: "abstract texture",
  artistic: "artistic portrait",
  commercial: "product photography",
};

// Fallback images in case of errors
const fallbackImages = {
  default:
    process.env.NEXT_PUBLIC_DEFAULT_URL ?? "https://cdn.pixabay.com/photo/2023/06/27/10/51/pier-8091934_960_720.jpg",
  artistic:
    process.env.NEXT_PUBLIC_ARTISTIC_URL ?? "https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/kaleef_lawal_07.jpg?updatedAt=175204105271",
  commercial:
    process.env.NEXT_PUBLIC_COMMERCIAL_URL ?? "https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/schlau%20x%20kaleef%2032.jpg?updatedAt=1752041052497",
};

export default function WorksPage() {
  const [images, setImages] = useState<WorksImages['images']>(fallbackImages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: any;

    async function fetchContent() {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching works images...");
        const worksImages = await getWorksImages();
        console.log("works images received:", worksImages);

        if (worksImages && worksImages.images) {
          setImages(worksImages.images);
        } else {
          console.warn("No works data found, using fallback images");
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
        setError("Failed to load content. Using default images.");
        setImages(fallbackImages);
      } finally {
        // take extra 1/3 secs to display page
        timeoutId = setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }

    fetchContent();
  }, []);

  const [activeCategory, setActiveCategory] = useState<
    "default" | "artistic" | "commercial"
  >("default");

  // Show loading state while images are being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background font-josephin"
        // style={{
        //   background: "linear-gradient(135deg, #2c3e50, #4ca1af)",
        //   backgroundSize: "400% 400%",
        //   animation: "gradientShift 15s ease infinite"
        // }}
      >
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xs sm:text-3xl font-bold font-headline tracking-widest text-center animate-pulse">
            <span>KALEEF LAWAL</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-josephin"
      style={{
        background: "linear-gradient(135deg, #2c3e50, #4ca1af)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite"
      }}
    >
      <Header />

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
        <AnimatePresence>
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={images[activeCategory]}
              alt={activeCategory}
              fill
              className="object-cover"
              data-ai-hint={imageHints[activeCategory]}
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        <div
          className="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-8 sm:flex-row"
          onMouseLeave={() => setActiveCategory("default")}
        >
          <Link href="/works/artistic" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white text-xl sm:text-2xl px-4 sm:px-12 py-8 font-headline tracking-wider backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setActiveCategory("artistic")}
            >
              Artistic
            </Button>
          </Link>
          <Link href="/works/commercial" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white text-xl sm:text-2xl px-4 sm:px-12 py-8 font-headline tracking-wider backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setActiveCategory("commercial")}
            >
              Commercial
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}