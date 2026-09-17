import { Product } from "./products";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Geyim",
    slug: "geyim",
    image: "/cat-geyim.png",
  },
  {
    id: "cat-2",
    name: "Ayaqqabı",
    slug: "ayaqqabi",
    image: "/cat-ayaqqabi.png",
  },
  {
    id: "cat-3",
    name: "Aksesuar",
    slug: "aksesuar",
    image: "/cat-aksesuar.png",
  },
  {
    id: "cat-4",
    name: "Beauty",
    slug: "beauty",
    image: "/cat-beauty.png",
  },
  {
    id: "cat-5",
    name: "Ev & Yaşam",
    slug: "ev-yasam",
    image: "/cat-ev-yasam.png",
  },
  {
    id: "cat-6",
    name: "Elektronika",
    slug: "elektronika",
    image: "/cat-elektronika.png",
  },
  {
    id: "cat-7",
    name: "Digər",
    slug: "diger",
    image: "/cat-diger.png",
  },
];

export interface PopularProduct {
  id: string;
  name: string;
  storeName: string;
  storeVerified: boolean;
  price: number;
  oldPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewCount: number;
  image: string;
  slug?: string;
}

export const POPULAR_PRODUCTS: PopularProduct[] = [
  {
    id: "pop-1",
    name: "Oversize Hoodie",
    storeName: "TERZME STORE",
    storeVerified: true,
    price: 79,
    oldPrice: 99,
    discountBadge: "-20%",
    rating: 4.9,
    reviewCount: 24,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pop-2",
    name: "Air Force 1",
    storeName: "TRZ STORE",
    storeVerified: true,
    price: 149,
    oldPrice: 175,
    discountBadge: "-15%",
    rating: 4.8,
    reviewCount: 18,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pop-3",
    name: "Cap",
    storeName: "AG'GARA",
    storeVerified: true,
    price: 39,
    rating: 4.9,
    reviewCount: 32,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pop-4",
    name: "T-shirt",
    storeName: "SABAH STORE",
    storeVerified: true,
    price: 49,
    oldPrice: 70,
    discountBadge: "-30%",
    rating: 4.7,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pop-5",
    name: "Backpack",
    storeName: "Urban Goods",
    storeVerified: true,
    price: 89,
    rating: 4.8,
    reviewCount: 12,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pop-6",
    name: "Parfum",
    storeName: "Luxe Beauty",
    storeVerified: true,
    price: 119,
    oldPrice: 135,
    discountBadge: "-10%",
    rating: 4.9,
    reviewCount: 21,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
  },
];
