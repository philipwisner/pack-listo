import { listService } from "@/services/list.service";
import { createClient } from "@/utils/supabase/server";
import ListsClient from "./ListsClient";

export default async function ListsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let lists: any[] = [];
  if (user) {
    lists = await listService.getAll(user.id);
  }

  return <ListsClient initialLists={lists} />;
}
