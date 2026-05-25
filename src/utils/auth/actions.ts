"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "../supabase/server";
import { MOCK_COOKIE_NAME, isMockMode } from "./shared";
import { prisma } from "../db";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (isMockMode()) {
    const mockUser = {
      id: "mock-user-123",
      email: email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
    };
    const cookieStore = await cookies();
    cookieStore.set(MOCK_COOKIE_NAME, encodeURIComponent(JSON.stringify(mockUser)), {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });
    redirect("/dashboard");
  }

  let success = false;
  try {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
    success = true;
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }

  if (success) {
    redirect("/dashboard");
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Name, email, and password are required" };
  }

  if (isMockMode()) {
    const mockUser = {
      id: "mock-user-123",
      email: email,
      name: name,
    };
    const cookieStore = await cookies();
    cookieStore.set(MOCK_COOKIE_NAME, encodeURIComponent(JSON.stringify(mockUser)), {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });
    redirect("/dashboard");
  }

  let success = false;
  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: { email: data.user.email || email, name },
          create: { id: data.user.id, email: data.user.email || email, name },
        });
      } catch (dbErr) {
        console.warn("Prisma user upsert skipped/failed (likely offline database):", dbErr);
      }
    }
    success = true;
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }

  if (success) {
    redirect("/dashboard");
  }
}

export async function logoutAction() {
  if (isMockMode()) {
    const cookieStore = await cookies();
    cookieStore.delete(MOCK_COOKIE_NAME);
    redirect("/login");
  }

  try {
    const supabase = await createSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Signout error:", err);
  }

  redirect("/login");
}
