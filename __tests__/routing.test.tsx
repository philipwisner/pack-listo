import { describe, it, expect, vi, beforeEach } from "vitest";
import { isMockMode } from "../src/utils/auth/shared";

describe("Routing & Authentication Helper Tests", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear mock flags
    delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it("should activate mock mode when NEXT_PUBLIC_USE_MOCK_AUTH is set to true", () => {
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = "true";
    expect(isMockMode()).toBe(true);
  });

  it("should activate mock mode when Supabase keys are missing", () => {
    // Both missing
    expect(isMockMode()).toBe(true);
  });

  it("should disable mock mode only when flag is not true AND keys are present", () => {
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = "false";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_anon_key";

    expect(isMockMode()).toBe(false);
  });
});
