// src/utils/auth/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
// CHANGED: Use the named export to match our unified chunk-safe database client configuration
import { prisma } from "@/lib/prisma";
import { LoginSchema, SignupSchema, AuthActionState } from "./auth.schema";

async function cloneDefaultsForUser(userId: string) {
  try {
    const existingCount = await prisma.category.count({ where: { userId } });
    if (existingCount > 0) return;

    const [defaultCategories, defaultBagTypes, defaultItems] =
      await Promise.all([
        prisma.category.findMany({ where: { userId: null } }),
        prisma.bagType.findMany({ where: { userId: null } }),
        prisma.item.findMany({
          where: { userId: null },
          include: { categories: true },
        }),
      ]);

    const categoryMap = new Map<string, string>();
    for (const cat of defaultCategories) {
      const created = await prisma.category.create({
        data: { name: cat.name, icon: cat.icon, color: cat.color, userId },
      });
      categoryMap.set(cat.id, created.id);
    }

    for (const bt of defaultBagTypes) {
      await prisma.bagType.create({
        data: { name: bt.name, icon: bt.icon, color: bt.color, userId },
      });
    }

    for (const it of defaultItems) {
      const connectCats = (it.categories || [])
        .map((c) => ({ id: categoryMap.get(c.id) }))
        .filter((c) => c.id) as { id: string }[];

      await prisma.item.create({
        data: {
          name: it.name,
          defaultWeight: it.defaultWeight,
          userId,
          categories: { connect: connectCats },
        },
      });
    }
  } catch (err) {
    console.warn("Failed to clone default data for user:", err);
  }
}

/**
 * LOGIN SERVER ACTION
 */
export async function loginAction(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawFields = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  };

  const validatedFields = LoginSchema.safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Please fix the validation parameters below.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, redirectTo } = validatedFields.data;

  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // FIX: Force Next.js 16 to await the resolution of the server client session cache.
    // This guarantees that setAll completes its cookie-mapping loops before redirect() drops execution.
    if (data?.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }
  } catch (err: any) {
    return {
      success: false,
      error:
        err?.message || "An unexpected error occurred during authorization.",
    };
  }

  redirect(redirectTo || "/dashboard");
}

/**
 * SIGNUP SERVER ACTION
 */
export async function signupAction(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawFields = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = SignupSchema.safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Please fill out all identity components correctly.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: { email: data.user.email || email, name },
          create: { id: data.user.id, email: data.user.email || email, name },
        });
        await cloneDefaultsForUser(data.user.id);
      } catch (dbErr) {
        console.warn("Prisma user upsert failed:", dbErr);
      }
    } else {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const admin = createAdminClient();
          const { data: adminData, error: adminError } =
            await admin.auth.admin.createUser({
              email,
              password,
              user_metadata: { name },
            });

          if (adminError) {
            return { success: false, error: adminError.message };
          }

          const createdUser = adminData?.user;
          if (createdUser) {
            try {
              await prisma.user.upsert({
                where: { id: createdUser.id },
                update: { email: createdUser.email || email, name },
                create: {
                  id: createdUser.id,
                  email: createdUser.email || email,
                  name,
                },
              });
              await cloneDefaultsForUser(createdUser.id);
            } catch (dbErr) {
              console.warn(
                "Prisma user upsert skipped after admin fallback hook:",
                dbErr,
              );
            }
          }
        } catch (adminErr: any) {
          return {
            success: false,
            error: adminErr?.message || "Admin user creation sequence failure.",
          };
        }
      } else {
        return {
          success: false,
          error:
            "Signup requires email confirmation. Check your email to complete registration.",
        };
      }
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred.",
    };
  }

  redirect("/dashboard");
}

/**
 * LOGOUT SERVER ACTION
 */
export async function logoutAction() {
  try {
    const supabase = await createSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Signout failure encountered:", err);
  }

  redirect("/login");
}
