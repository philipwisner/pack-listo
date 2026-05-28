"use client";
import { DarkModeProvider } from "./DarkModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      {/* Add future global client providers here */}
      {children}
    </DarkModeProvider>
  );
}
