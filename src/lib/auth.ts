import { cache } from "react";
import { createClient as createSupabaseClient } from "../utils/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  isAdmin?: boolean;
}

// Wrapping in cache ensures this logic runs only once per request
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const supabase = await createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isAdmin: true },
    });

    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || null,
      isAdmin: dbUser?.isAdmin ?? false,
    };
  } catch (error) {
    console.error("Supabase getUser error:", error);
    return null;
  }
});

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect("/dashboard");
  }
  return user;
}
