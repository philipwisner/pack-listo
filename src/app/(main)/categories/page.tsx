import { categoryService } from "@/services/category.service";
import CategoriesClient from "./CategoriesClient";
import { getCurrentUser } from "@/lib/auth";

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  let categories: any[] = [];
  if (user) {
    categories = await categoryService.getAll(user.id);
  }

  return <CategoriesClient initialCategories={categories} />;
}
