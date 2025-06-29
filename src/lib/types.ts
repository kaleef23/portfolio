export interface PortfolioItem {
  id: number;
  artistName: string;
  title: string;
  description: string;
  imageUrl: string;
  width: string;
  shopifyUrl: string;
  category: 'image' | 'video';
}
