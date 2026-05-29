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

// Function to get the current authenticated user, seamlessly handling
// Just-In-Time profiling for both Local Docker and Live Production environments.
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Just-In-Time Sync: If the user doesn't exist in the public."User" table yet
    // (like a fresh deployment or a new local docker instance), create them on the fly.
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email || "",
      },
      create: {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
        isAdmin: false, // Default to false on automated creation
      },
      select: { isAdmin: true },
    });

    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || null,
      isAdmin: dbUser.isAdmin,
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
