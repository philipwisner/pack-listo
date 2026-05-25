export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export const MOCK_COOKIE_NAME = "mock-auth-session";

export function isMockMode(): boolean {
  // If the env variable says true, or if Supabase URL/key are not configured, use Mock Mode
  const envMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
  const noKeys = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return envMock || noKeys;
}
