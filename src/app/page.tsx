"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Sample media data - replace with your actual content
const mediaItems = [
  {
    id: 1,
    type: "image",
    src: "https://cdn.pixabay.com/photo/2024/02/17/15/59/plum-blossoms-8579641_1280.jpg",
    title: "Urban Portrait Session",
    artist: "Brandon Kuzma",
    role: "Director, Cinematographer",
    description:
      "A captivating urban portrait session showcasing the raw energy and emotion of street photography. This project explores the intersection of light, shadow, and human expression in metropolitan environments.",
    category: "Portrait",
  },
  {
    id: 2,
    type: "video",
    src: "https://cdn.pixabay.com/video/2025/06/09/284566_tiny.mp4",
    title: "Fashion Editorial",
    artist: "Ike Edeani",
    role: "Photographer",
    description:
      "An avant-garde fashion editorial that pushes the boundaries of contemporary style and visual storytelling. Each frame captures the essence of modern fashion through innovative composition.",
    category: "Fashion",
  },
  {
    id: 3,
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/05/01/16/21/insect-9571817_640.jpg",
    title: "Landscape Series",
    artist: "Kent Andreasen",
    role: "Photographer, Director",
    description:
      "A breathtaking landscape series that captures the untamed beauty of natural environments. These images showcase the delicate balance between light and landscape.",
    category: "Landscape",
  },
  {
    id: 4,
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/04/24/05/23/woman-9554464_640.jpg",
    title: "Creative Direction",
    artist: "Bradley A. Murray",
    role: "Director, Cinematographer",
    description:
      "Innovative creative direction that blends traditional photography techniques with modern digital artistry. This work represents the evolution of visual storytelling.",
    category: "Creative",
  },
  {
    id: 5,
    type: "video",
    src: "https://cdn.pixabay.com/photo/2025/05/30/17/15/mountain-9631829_640.jpg",
    title: "Documentary Work",
    artist: "Nico Therin",
    role: "Photographer",
    description:
      "Compelling documentary photography that tells powerful human stories through intimate and authentic moments captured in time.",
    category: "Documentary",
  },
  {
    id: 6,
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/06/03/18/01/urban-fashion-9639853_640.jpg",
    title: "Choreography Visual",
    artist: "Jonte'",
    role: "Choreographer",
    description:
      "Dynamic visual representation of movement and dance, capturing the fluidity and grace of choreographed performance through still imagery.",
    category: "Dance",
  },
];

// Duplicate items for seamless carousel
const topCarouselItems = [...mediaItems, ...mediaItems];
const bottomCarouselItems = [...mediaItems.reverse(), ...mediaItems];

export default function Portfolio() {
  const [selectedMedia, setSelectedMedia] = useState<
    (typeof mediaItems)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: (typeof mediaItems)[0]) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black relative">
      {/* Top Carousel */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <div className="flex animate-scroll-left">
          {topCarouselItems.map((item, index) => {
            return (
              <div
                key={`top-${index}`}
                className="flex-shrink-0 relative cursor-pointer mr-4 hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(item)}
              >
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  width={175}
                  height={0}
                  style={{
                    height: "auto",
                  }}
                  className="rounded-lg"
                  sizes="175px"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{item.artist}</h3>
                    <p className="text-sm opacity-80">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Navigation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-light tracking-widest mb-8 opacity-90">
            FOR YOUR CONSIDERATION
          </h1>
          <nav className="flex items-center justify-center space-x-12 md:space-x-16">
            <button className="text-white text-lg md:text-xl font-light tracking-wider hover:opacity-60 transition-opacity duration-300">
              ARTISTS
            </button>
            <button className="text-white text-lg md:text-xl font-light tracking-wider hover:opacity-60 transition-opacity duration-300">
              PORTFOLIO
            </button>
            <button className="text-white text-lg md:text-xl font-light tracking-wider hover:opacity-60 transition-opacity duration-300">
              ABOUT
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Carousel */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="flex animate-scroll-right items-end">
          {bottomCarouselItems.map((item, index) => {
            return (
              <div
                key={`bottom-${index}`}
                className="flex-shrink-0 relative cursor-pointer mr-4 hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(item)}
              >
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  width={175}
                  height={0}
                  style={{
                    height: "auto",
                  }}
                  className="rounded-lg"
                  sizes="175px"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <div className="absolute top-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{item.artist}</h3>
                    <p className="text-sm opacity-80">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black border-0">
          <div className="flex h-full">
            {/* Left side - Media */}
            <div className="flex-1 relative">
              {selectedMedia && (
                <>
                  <Image
                    src={selectedMedia.src || "/placeholder.svg"}
                    alt={selectedMedia.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  {selectedMedia.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedMedia && (
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wider">
                      {selectedMedia.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light mt-2 mb-4">
                      {selectedMedia.title}
                    </h2>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedMedia.artist}
                    </h3>
                    <p className="text-gray-600">{selectedMedia.role}</p>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedMedia.description}
                  </p>

                  <div className="pt-6">
                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
                      View Full Project
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Navigation Overlay */}
      <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
          <nav className="flex items-center space-x-6">
            <button className="text-white text-sm font-light tracking-wider">
              ARTISTS
            </button>
            <button className="text-white text-sm font-light tracking-wider">
              PORTFOLIO
            </button>
            <button className="text-white text-sm font-light tracking-wider">
              ABOUT
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
