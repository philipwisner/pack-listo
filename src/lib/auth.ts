import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
// 1. CHANGED: Explicitly import the named instantiation instance to bypass the stale default cache boundary
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  isAdmin?: boolean;
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    // DIAGNOSTIC LOG: Print out exactly what cookie keys are physically landing inside this execution function
    const cookieStore = await cookies();
    const activeCookieKeys = cookieStore.getAll().map((c) => c.name);
    console.log(
      "EXECUTION ENVIRONMENT - Active Request Cookie Keys:",
      activeCookieKeys,
    );

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("DIAGNOSTIC - Supabase Core Auth Engine Error:", authError);
    }

    if (!user) {
      console.log(
        "DIAGNOSTIC - No authenticated user found in active session context.",
      );
      return null;
    }

    console.log("DIAGNOSTIC - Supabase user verified successfully:", user.id);

    // Just-In-Time Sync using the explicit named database instance
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email || "",
      },
      create: {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
        isAdmin: false,
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

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect("/dashboard");
  }
  return user;
}
