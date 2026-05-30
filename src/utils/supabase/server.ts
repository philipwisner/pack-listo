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
          if (!rawCookieHeader) return [];

          return rawCookieHeader
            .split(";")
            .map((str) => {
              const parts = str.trim();
              if (!parts) return null;

              const equalIndex = parts.indexOf("=");
              if (equalIndex === -1) return null;

              const name = parts.substring(0, equalIndex).trim();
              const value = parts.substring(equalIndex + 1).trim();

              // Avoid passing empty or broken cookie references down to the client
              if (!name || !value) return null;

              return { name, value };
            })
            .filter(
              (cookie): cookie is { name: string; value: string } =>
                cookie !== null,
            );
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // Ensure cookies consistently flow correctly through internal domain routing
                path: options.path ?? "/",
              });
            });
          } catch {
            // Safely caught when evaluated inside Server Component layouts or read-only streams
          }
        },
      },
    },
  );
}
