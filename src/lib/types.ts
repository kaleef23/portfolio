import type { Timestamp } from 'firebase/firestore';

export interface PortfolioItem {
  id: string;
  artistName: string;
  title: string;
  description?: string;
  imageUrl: string;
  width: string;
  shopifyUrl: string;
  category: 'image' | 'video';
  orientation?: string;
}

export interface CollectionImage {
  url: string;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  posterImageUrl: string;
  posterImageCategory?: 'image' | 'video';
  images: CollectionImage[];
  createdAt?: string;
  tag?: string;
  orientation?: string;
}

export interface SiteContent {
  about: {
    col1: {
      paragraph1: string;
      paragraph2: string;
    };
    col2: {
      paragraph1: string;
      paragraph2: string;
    };
    exhibitions: string; // Storing as a single string, split by newline
  };
}

export interface WorksImages {
  images: {
    default: string;
    artistic: string;
    commercial: string;
  };
}