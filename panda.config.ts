import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      // Define your tokens here to match your CSS variables
      tokens: {
        colors: {
          background: { value: "var(--background)" },
          foreground: { value: "var(--foreground)" },
        },
        fonts: {
          sans: { value: "var(--font-geist-sans)" },
          mono: { value: "var(--font-geist-mono)" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
