import { listService } from "@/features/list/list.service";
import { getCurrentUser } from "@/lib/auth";
import ListClient from "./ListClient";

export type ListWithRelations = Awaited<ReturnType<typeof listService.getById>>;

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  let list: Awaited<ReturnType<typeof listService.getById>> = null;
  if (user) {
    list = await listService.getById(id, user.id);
  }

  if (!list) {
    return <div>List not found</div>;
  }

  return <ListClient initialList={list} />;
}
