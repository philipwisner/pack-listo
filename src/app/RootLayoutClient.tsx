"use client";

import { DarkModeProvider } from "@/contexts/DarkModeContext";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return <DarkModeProvider>{children}</DarkModeProvider>;
}
