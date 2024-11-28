import { getCategoriesWithProducts } from "@/actions/categories";
import CategoryPageComponent from "@/app/admin/categories/page-component";

// TODO this is server side rendering

export default async function Categories() {
  const categories = await getCategoriesWithProducts();

  console.log(categories);

  return (
    <CategoryPageComponent categories={categories} />
  );
}
