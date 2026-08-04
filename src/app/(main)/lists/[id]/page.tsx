import React from "react";
import { listService } from "@/features/list/list.service";
import { itemService } from "@/features/item/item.service";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PageContainer } from "@/styles/layout.styles";
import { PageHeader } from "@/components/PageHeader";

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

  //Move this to the client component so it stops blocking loading
  // const items = await itemService.getAll(userId);

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
    <PageContainer>
      <PageHeader text={list.name} button={{ text: "Edit List" }} />
    </PageContainer>
  );
}
