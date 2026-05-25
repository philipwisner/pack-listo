"use client";

import { useDarkMode } from "@/contexts/DarkModeContext";

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Light mode" : "Dark mode"}
      style={{
        background: "none",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isDarkMode ? "white" : "black",
        borderRadius: "4px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="4" />
          <path d="M10 1V3M10 17V19M19 10H17M3 10H1" />
          <path d="M16.657 16.657L15.243 15.243M4.757 4.757L3.343 3.343M16.657 3.343L15.243 4.757M4.757 15.243L3.343 16.657" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};
