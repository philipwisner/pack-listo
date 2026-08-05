import ItemsClient from "./ItemsClient";
import { getCurrentUser } from "@/lib/auth";
import { Item, Category } from "@/generated/prisma/browser";
import { getItemsAction } from "@/features/item/item.actions";

export const metadata = {
  title: "Items",
};
export default async function ItemsPage() {
  const user = await getCurrentUser();

  let items: (Item & { category: Category | null })[] = [];

  if (user) {
    const itemsResult = await getItemsAction();
    items =
      (itemsResult?.data as (Item & { category: Category | null })[]) || [];
  }

  return <ItemsClient initialItems={items} />;
}
