import { itemService } from "@/features/item/item.service";
import { categoryService } from "@/features/category/category.service";
import ItemsClient from "./ItemsClient";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Items",
};
export default async function ItemsPage() {
  const user = await getCurrentUser();

  let items: any[] = [];
  let categories: any[] = [];

  if (user) {
    [items, categories] = await Promise.all([
      itemService.getAll(user.id),
      categoryService.getAll(user.id),
    ]);
  }

  return <ItemsClient initialItems={items} categories={categories} />;
}
