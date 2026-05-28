import React from "react";
import { itemService } from "@/services/item.service";
import { categoryService } from "@/services/category.service";
import { createClient } from "@/utils/supabase/server";
import ItemsClient from "./ItemsClient";

export default async function ItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
