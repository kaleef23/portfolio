"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PortfolioItem } from "@/lib/types";
import Image from "next/image";

interface PortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PortfolioModal({ item, isOpen, onClose }: PortfolioModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-auto max-h-[90vh] p-0 border-0 flex flex-col md:flex-row overflow-hidden rounded-lg shadow-2xl bg-card text-card-foreground">
        <div className="relative w-full md:w-3/5 h-64 md:h-auto flex-shrink-0">
          <Image 
            src={item.imageUrl} 
            alt={item.title} 
            fill
            sizes="(max-width: 768px) 90vw, 50vw"
            style={{ objectFit: 'cover' }} 
            data-ai-hint="portrait fashion"
          />
        </div>
        <div className="flex flex-col flex-1 p-8 overflow-y-auto">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl font-headline mb-2 text-primary-foreground">{item.artistName}</DialogTitle>
            <p className="text-muted-foreground font-body text-lg">{item.title}</p>
          </DialogHeader>
          <div className="my-6 text-base font-body text-foreground/80 leading-relaxed prose prose-invert">
            <p>{item.description}</p>
          </div>
          <div className="mt-auto pt-6">
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href={item.shopifyUrl} target="_blank" rel="noopener noreferrer">
                Purchase
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
