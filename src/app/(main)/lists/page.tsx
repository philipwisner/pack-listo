import { listService } from "@/features/list/list.service";
import ListsClient from "./ListsClient";
import { List } from "@/generated/prisma/browser";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Lists",
};

export default async function ListsPage() {
  const user = await getCurrentUser();

  let lists: List[] = [];
  if (user) {
    lists = await listService.getAll(user.id);
  }

  return <ListsClient initialLists={lists} />;
}
