import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  jsxFramework: "react", // or 'next'
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "gray.50",
    },
    body: {
      minHeight: "100vh",
      display: "grid",
      background: "background",
      fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    },
  },
  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          background: {
            value: { base: "#ffffff", _dark: "#0a0a0a" },
          },
          foreground: {
            value: { base: "#171717", _dark: "#ededed" },
          },
        },
      },
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
  outdir: "src/styled-system",
  importMap: "@/styled-system",
});
