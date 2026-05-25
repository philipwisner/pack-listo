import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  jsxFramework: "react",
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  exclude: [],
  theme: {
    tokens: {
      fonts: {
        sans: {
          value:
            'var(--font-dm-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
      fontSizes: {
        xs: { value: "0.75rem" }, // 12px
        sm: { value: "0.875rem" }, // 14px
        base: { value: "1rem" }, // 16px
        md: { value: "1.125rem" }, // 18px
        lg: { value: "1.25rem" }, // 20px
        xl: { value: "1.5rem" }, // 24px
        "2xl": { value: "2rem" }, // 32px
        "3xl": { value: "2.375rem" }, // 38px
        "4xl": { value: "2.5rem" }, // 40px
        "5xl": { value: "3rem" }, // 48px
      },
      fontWeights: {
        light: { value: "300" },
        regular: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
      },
      radii: {
        xs: { value: "2px" },
        sm: { value: "3px" },
        md: { value: "4px" },
        lg: { value: "8px" },
        xl: { value: "12px" },
        "2xl": { value: "16px" },
        full: { value: "9999px" },
      },
      spacing: {
        "1": { value: "0.25rem" }, // 4px
        "2": { value: "0.5rem" }, // 8px
        "3": { value: "0.75rem" }, // 12px
        "4": { value: "1rem" }, // 16px
        "5": { value: "1.25rem" }, // 20px
        "6": { value: "1.5rem" }, // 24px
        "7": { value: "1.75rem" }, // 28px
        "8": { value: "2rem" }, // 32px
        "9": { value: "2.25rem" }, // 36px
        "10": { value: "2.5rem" }, // 40px
        "11": { value: "2.75rem" }, // 44px
        "12": { value: "3rem" }, // 48px
        "14": { value: "3.5rem" }, // 56px
        "16": { value: "4rem" }, // 64px
        "20": { value: "5rem" }, // 80px
        "24": { value: "6rem" }, // 96px
        "32": { value: "8rem" }, // 128px
      },
      colors: {
        black: { value: "#0f172a" },
        white: { value: "#ffffff" },
        gray: {
          50: { value: "#F9FAFC" },
          100: { value: "#F1F5F9" },
          200: { value: "#E2E8F0" },
          300: { value: "#B9CADC" },
          400: { value: "#71839B" },
          500: { value: "#566A84" },
          600: { value: "#42546D" },
          700: { value: "#2F3E53" },
          800: { value: "#1A2433" },
          900: { value: "#0F172A" },
          950: { value: "#020617" },
        },
        yellow: {
          50: { value: "#FFFDF2" },
          100: { value: "#FFF9D6" },
          200: { value: "#FFF0AD" },
          300: { value: "#FFE275" },
          400: { value: "#FFD63D" },
          500: { value: "#FFCA08" },
          600: { value: "#E6B607" },
          700: { value: "#CCA206" },
          800: { value: "#997A05" },
          900: { value: "#665103" },
          950: { value: "#332902" },
        },
        red: {
          50: { value: "#FEF2F2" },
          100: { value: "#FEE2E2" },
          500: { value: "#EF4444" },
          600: { value: "#DC2626" },
        },
        green: {
          50: { value: "#F0FDF4" },
          100: { value: "#DCFCE7" },
          500: { value: "#22C55E" },
          600: { value: "#16A34A" },
        },
        blue: {
          50: { value: "#EFF6FF" },
          100: { value: "#DBEAFE" },
          500: { value: "#3B82F6" },
          600: { value: "#2563EB" },
          900: { value: "#1E3A8A" },
        },
        orange: {
          // subtleBase: { value: "#F59E0B" },
          50: { value: "#FFF7ED" },
          100: { value: "#FFEDD5" },
          500: { value: "#F97316" },
          600: { value: "#EA580C" },
        },
      },
    },
    extend: {
      semanticTokens: {
        colors: {
          background: {
            value: { base: "#ffffff", _dark: "#0a0a0a" },
          },
          foreground: {
            value: { base: "#171717", _dark: "#ededed" },
          },
          error: {
            bg: { value: "{colors.red.50}" },
            border: { value: "{colors.red.100}" },
            main: { value: "{colors.red.500}" },
            text: { value: "{colors.red.600}" },
            "bg-subtle": { value: "{colors.red.500/10}" },
          },
          success: {
            bg: { value: "{colors.green.50}" },
            border: { value: "{colors.green.100}" },
            main: { value: "{colors.green.500}" },
            text: { value: "{colors.green.600}" },
            "bg-subtle": { value: "{colors.green.500/10}" },
          },
          info: {
            bg: { value: "{colors.blue.50}" },
            border: { value: "{colors.blue.100}" },
            main: { value: "{colors.blue.500}" },
            text: { value: "{colors.blue.900}" },
            "bg-subtle": { value: "{colors.blue.500/10}" },
          },
          warning: {
            bg: { value: "{colors.orange.50}" },
            border: { value: "{colors.orange.100}" },
            main: { value: "{colors.orange.500}" },
            text: { value: "{colors.orange.600}" },
            "bg-subtle": { value: "{colors.orange.500/10}" },
          },
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      margin: "0",
      padding: "0",
      height: "100%",
      width: "100%",
      fontFamily: "sans",
    },
    body: {
      minHeight: "100vh",
      display: "grid",
    },
  },
  // The output directory for your css system
  outdir: "src/styled-system",
  importMap: "@/styled-system",
});
