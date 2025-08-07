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
}
