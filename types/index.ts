export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  slug: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  compatibleModel?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}
