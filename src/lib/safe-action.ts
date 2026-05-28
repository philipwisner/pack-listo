import 'server-only';
import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/utils/supabase/server";

export const actionClient = createSafeActionClient();

export const protectedActionClient = createSafeActionClient().use(async ({ next }) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Session is required for this action.");
  }

  return next({ ctx: { userId: user.id } });
});
