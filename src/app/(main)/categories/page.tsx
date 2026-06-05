// import { categoryService } from "@/features/category/category.service";
import CategoriesClient from "./CategoriesClient";
import { getCurrentUser } from "@/lib/auth";
import { getCategoriesAction } from "@/features/category/category.actions";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  let categories: any[] = [];
  if (user) {
    const result = await getCategoriesAction();
    categories = result?.data || [];
    // categories = await categoryService.getAll(user.id);
  }

  return <CategoriesClient initialCategories={categories} />;
}
