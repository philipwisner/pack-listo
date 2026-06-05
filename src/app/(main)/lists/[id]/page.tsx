import React from "react";
import { listService } from "@/features/list/list.service";
import { itemService } from "@/features/item/item.service";
import { ManifestEditor } from "@/components/lists/ManifestEditor";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const userId = user.id;

  const list = await listService.getById(id, userId);
  const items = await itemService.getAll(userId);
  console.log("list:", list);

  if (!list) {
    notFound();
  }

  // Transform data to match client component needs
  const transformedItems = list?.items.map((li: any) => ({
    id: li.id,
    quantity: li.quantity,
    isPacked: li.isPacked,
    item: {
      name: li.item.name,
      category: li.category,
    },
  }));

  return (
    <ManifestEditor
      listId={list.id}
      name={list.name}
      items={transformedItems}
      availableItems={items}
    />
  );
}
