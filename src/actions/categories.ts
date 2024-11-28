"use server";
import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("category")
      .select("*, product: product(*)")
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error.message}`);

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
  if (!formData) return;

  const fileEntry = formData.get("file");

  if (!(fileEntry instanceof File))
    throw new Error("No file found in form data");

  const fileName = fileEntry.name;
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from("app-images")
      .upload(fileName, fileEntry as Blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(`Error uploading image: ${error.message}`);

    const {
      data: { publicUrl },
    } = await supabase.storage.from("app-images").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error(error);
    throw new Error(`Error uploading image`);
  }
};

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const slug = slugify(name, { lower: true });
  const supabase = createClient();

  const { data, error } = await supabase
    .from("category")
    .insert({ name, imageUrl, slug });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  revalidatePath("admin/categories");
  return data;
};

export const updateCategory = async ({
  imageUrl,
  name,
  slug,
}: UpdateCategorySchema) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category")
    .update({ name, imageUrl })
    .match({ slug });

  if (error) throw new Error(`Error updating category: ${error.message}`);

  revalidatePath("admin/categories");
  return data;
};

export const deleteCategory = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase.from("category").delete().match({ id });
  if (error) throw new Error(`Error deleting category: ${error.message}`);
  revalidatePath("admin/categories");
};
