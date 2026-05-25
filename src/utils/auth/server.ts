import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "../supabase/server";
import { AuthUser, MOCK_COOKIE_NAME, isMockMode } from "./shared";

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (isMockMode()) {
    try {
      const cookieStore = await cookies();
      const mockCookie = cookieStore.get(MOCK_COOKIE_NAME);
      if (!mockCookie || !mockCookie.value) return null;
      const parsed = JSON.parse(decodeURIComponent(mockCookie.value));
      return {
        id: parsed.id || "mock-user-123",
        email: parsed.email || "developer@packlisto.local",
        name: parsed.name || "Local Dev",
      };
    } catch {
      return null;
    }
  }

  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || null,
    };
  } catch (error) {
    console.error("Supabase getUser error:", error);
    return null;
  }
}
