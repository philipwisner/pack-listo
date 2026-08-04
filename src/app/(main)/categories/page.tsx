// import { categoryService } from "@/features/category/category.service";
import CategoriesClient from "./CategoriesClient";
import { getCurrentUser } from "@/lib/auth";
import { getCategoriesAction } from "@/features/category/category.actions";
import { Category } from "@/generated/prisma/browser";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  let categories: Category[] = [];
  if (user) {
    const result = await getCategoriesAction();
    categories = (result?.data as Category[]) || [];
  }

  return <CategoriesClient initialCategories={categories} />;
}
