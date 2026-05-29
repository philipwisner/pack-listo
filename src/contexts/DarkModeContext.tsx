"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeType = "light" | "dark" | "auto";

interface DarkModeContextType {
  mode: DarkModeType;
  isDarkMode: boolean;
  setMode: (mode: DarkModeType) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DarkModeType>("auto");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Initialize mode from localStorage and system preference
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(
      "darkModeConfig",
    ) as DarkModeType | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setSystemPrefersDark(prefersDark);

    const initialMode = (stored || "auto") as DarkModeType;
    setModeState(initialMode);

    // Set initial isDarkMode based on mode and system preference
    if (initialMode === "auto") {
      setIsDarkMode(prefersDark);
    } else {
      setIsDarkMode(initialMode === "dark");
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
      // Only update isDarkMode if in auto mode
      if (mode === "auto") {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isClient, mode]);

  // Update isDarkMode when mode changes
  useEffect(() => {
    if (!isClient) return;

    if (mode === "auto") {
      setIsDarkMode(systemPrefersDark);
    } else {
      setIsDarkMode(mode === "dark");
    }
  }, [mode, isClient, systemPrefersDark]);

  // Update the DOM when dark mode changes
  useEffect(() => {
    if (!isClient) return;

    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [isDarkMode, isClient]);

  const setMode = (newMode: DarkModeType) => {
    setModeState(newMode);
    localStorage.setItem("darkModeConfig", newMode);
  };

  return (
    <DarkModeContext.Provider value={{ mode, isDarkMode, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
