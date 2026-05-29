import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Strategy 1: Check native cookie store
          const nativeCookies = cookieStore.getAll();
          if (nativeCookies.length > 0) return nativeCookies;

          // Strategy 2: Fallback to the explicit forwarded header chain
          const rawCookieHeader = headerStore.get("cookie");
          if (rawCookieHeader) {
            return rawCookieHeader.split(";").map((str) => {
              const [name, ...valueParts] = str.split("=");
              return {
                name: name.trim(),
                value: valueParts.join("=").trim(),
              };
            });
          }

          return [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Handled for read-only page contexts
          }
        },
      },
    },
  );
}
