"use client";

import { AuthUser, MOCK_COOKIE_NAME, isMockMode } from "./shared";

function getClientCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function getCurrentUserClient(): AuthUser | null {
  if (isMockMode()) {
    const session = getClientCookie(MOCK_COOKIE_NAME);
    if (!session) return null;
    try {
      const parsed = JSON.parse(decodeURIComponent(session));
      return {
        id: parsed.id || "mock-user-123",
        email: parsed.email || "developer@packlisto.local",
        name: parsed.name || "Local Dev",
      };
    } catch {
      return null;
    }
  }

  // Real client state would usually be managed via state or direct hook in components.
  return null;
}
