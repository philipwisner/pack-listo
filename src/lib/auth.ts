import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  isAdmin?: boolean;
}

//Function to get the current authenticated user, including their admin status from the database. This is cached for the duration of the request to avoid redundant database calls.
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const supabase = await createClient();
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

// Function to check if users isAdmin
export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect("/dashboard");
  }
  return user;
}
