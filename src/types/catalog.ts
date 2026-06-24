export type Tag = {
  id: string;
  name: string;
  type: string;
};

export type ProductImage = {
  id: string;
  url: string;
};

export type Product = {
  id: string;
  title: string;
  tags: Tag[];
  price: number;
  currency: string;
  main_image: string | null;
  article: string;
  is_favorite: boolean;
  created_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  pages: number;
  results: T[];
};

export type MiniProductImage = {
  id: string;
  image: string | null;
};

export type DetailProduct = {
  id: string;
  title: string;
  tags: Tag[];
  price: number;
  currency: string;
  description: string;
  main_image: string | null;
  article: string;
  images: MiniProductImage[];
  created_at: string;
};

export type SelectedTag = {
  id: string;
  type: string;
};