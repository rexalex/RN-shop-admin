import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
  category: Category;
  created_at: string;
  heroImage: string;
  id: number;
  imagesUrl: string[]; // ?? images_url ??
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
}

export type ProductsWithCategoriesResponse = ProductWithCategory[]

export type UpdateProductsSchema = {
  category: number;
  heroImage: string;
  imagesUrl: string[];
  maxQuantity: number;
  price: number;
  slug: string;
  title: string;
}
