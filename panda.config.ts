import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  jsxFramework: "react",
  include: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
  ],
  exclude: [],
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    tokens: {
      fonts: {
        sans: {
          value: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
        },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        base: { value: "1rem" },
        md: { value: "1.125rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.5rem" },
        "2xl": { value: "2rem" },
        "3xl": { value: "2.375rem" },
        "4xl": { value: "2.5rem" },
        "5xl": { value: "3rem" },
      },
      fontWeights: {
        light: { value: "300" },
        regular: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
      },
      lineHeights: {
        none: { value: "1" },
        tight: { value: "1.25" },
        snug: { value: "1.375" },
        normal: { value: "1.5" },
        relaxed: { value: "1.625" },
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
        "1": { value: "0.25rem" },
        "2": { value: "0.5rem" },
        "3": { value: "0.75rem" },
        "4": { value: "1rem" },
        "5": { value: "1.25rem" },
        "6": { value: "1.5rem" },
        "7": { value: "1.75rem" },
        "8": { value: "2rem" },
        "9": { value: "2.25rem" },
        "10": { value: "2.5rem" },
        "11": { value: "2.75rem" },
        "12": { value: "3rem" },
        "14": { value: "3.5rem" },
        "16": { value: "4rem" },
        "20": { value: "5rem" },
        "24": { value: "6rem" },
        "32": { value: "8rem" },
      },
      colors: {
        black: { value: "#000000" },
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
          25: { value: "#FFF8F8" },
          50: { value: "#FEF2F2" },
          100: { value: "#FEE2E2" },
          200: { value: "#FECACA" },
          300: { value: "#FCA5A5" },
          400: { value: "#F87171" },
          500: { value: "#EF4444" },
          600: { value: "#DC2626" },
          700: { value: "#B91C1C" },
          800: { value: "#991B1B" },
          900: { value: "#7F1D1D" },
          950: { value: "#450A0A" },
        },
        green: {
          25: { value: "#F7FDF9" },
          50: { value: "#F0FDF4" },
          100: { value: "#DCFCE7" },
          200: { value: "#BBF7D0" },
          300: { value: "#86EFAC" },
          400: { value: "#4ADE80" },
          500: { value: "#22C55E" },
          600: { value: "#16A34A" },
          700: { value: "#15803D" },
          800: { value: "#166534" },
          900: { value: "#14532D" },
          950: { value: "#052E16" },
        },
        blue: {
          50: { value: "#EFF6FF" },
          100: { value: "#DBEAFE" },
          500: { value: "#3B82F6" },
          600: { value: "#2563EB" },
          900: { value: "#1E3A8A" },
        },
        orange: {
          50: { value: "#FFF7ED" },
          100: { value: "#FFEDD5" },
          500: { value: "#F97316" },
          600: { value: "#EA580C" },
        },
      },
    },
    semanticTokens: {
      colors: {
        accent: {
          value: { base: "{colors.yellow.500}", _dark: "{colors.yellow.500}" },
        },
        background: {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.950}" },
        },
        text: {
          main: {
            value: { base: "{colors.gray.950}", _dark: "{colors.gray.50}" },
          },
          muted: {
            value: { base: "{colors.gray.700}", _dark: "{colors.gray.300}" },
          },
          active: {
            value: { base: "{colors.gray.700}", _dark: "{colors.gray.200}" },
          },
        },
        link: {
          main: {
            value: { base: "{colors.gray.950}", _dark: "{colors.gray.50}" },
          },
          hover: {
            value: { base: "{colors.gray.800}", _dark: "{colors.gray.100}" },
          },
          active: {
            value: { base: "{colors.gray.700}", _dark: "{colors.gray.200}" },
          },
        },
        logo: {
          text: {
            value: { base: "{colors.gray.950}", _dark: "{colors.gray.50}" },
          },
        },
        button: {
          primary: {
            text: {
              value: {
                base: "{colors.gray.950}",
                _dark: "{colors.yellow.950}",
              },
            },
            bg: {
              value: {
                base: "{colors.yellow.500}",
                _dark: "{colors.yellow.500}",
              },
            },
            hoverBg: {
              value: {
                base: "{colors.yellow.400}",
                _dark: "{colors.yellow.400}",
              },
            },
            activeBg: {
              value: {
                base: "{colors.yellow.600}",
                _dark: "{colors.yellow.600}",
              },
            },
            disabledBg: {
              value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
            },
            disabledText: {
              value: { base: "{colors.gray.400}", _dark: "{colors.gray.500}" },
            },
            focusRing: {
              value: {
                base: "{colors.gray.400}",
                _dark: "{colors.yellow.300}",
              },
            },
          },
          secondary: {
            text: {
              value: { base: "{colors.gray.950}", _dark: "{colors.white}" },
            },
            bg: {
              value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
            },
            hoverBg: {
              value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
            },
            activeBg: {
              value: { base: "{colors.gray.300}", _dark: "{colors.gray.600}" },
            },
          },
        },
        input: {
          label: {
            value: { base: "{colors.gray.700}", _dark: "{colors.gray.200}" },
          },
          border: {
            default: {
              value: { base: "{colors.gray.300}", _dark: "{colors.gray.500}" },
            },
            focus: {
              value: { base: "{colors.gray.400}", _dark: "{colors.gray.300}" },
            },
            hover: {
              value: { base: "{colors.gray.400}", _dark: "{colors.gray.300}" },
            },
            error: {
              value: { base: "{colors.red.400}", _dark: "{colors.red.300}" },
            },
            focusError: {
              value: { base: "{colors.red.600}", _dark: "{colors.red.500}" },
            },
            hoverError: {
              value: { base: "{colors.red.600}", _dark: "{colors.red.500}" },
            },
            success: {
              value: {
                base: "{colors.green.400}",
                _dark: "{colors.green.300}",
              },
            },
            focusSuccess: {
              value: {
                base: "{colors.green.600}",
                _dark: "{colors.green.500}",
              },
            },
            hoverSuccess: {
              value: {
                base: "{colors.green.600}",
                _dark: "{colors.green.500}",
              },
            },
          },
          placeholder: {
            default: {
              value: { base: "{colors.gray.400}", _dark: "{colors.gray.300}" },
            },
            error: {
              value: { base: "{colors.red.300}", _dark: "{colors.red.300}" },
            },
            success: {
              value: {
                base: "{colors.green.300}",
                _dark: "{colors.green.300}",
              },
            },
          },
          background: {
            default: {
              value: { base: "{colors.white}", _dark: "{colors.gray.700}" },
            },
            disabled: {
              value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
            },
            error: {
              value: { base: "{colors.red.25}", _dark: "{colors.red.500/10}" },
            },
            success: {
              value: {
                base: "{colors.green.25}",
                _dark: "{colors.green.500/10}",
              },
            },
          },
          text: {
            value: { base: "{colors.gray.950}", _dark: "{colors.gray.50}" },
          },
          focusRing: {
            default: {
              value: {
                base: "{colors.yellow.300}",
                _dark: "{colors.yellow.300}",
              },
            },
            error: {
              value: {
                base: "{colors.red.300}",
                _dark: "{colors.red.300}",
              },
            },
            success: {
              value: {
                base: "{colors.green.300}",
                _dark: "{colors.green.300}",
              },
            },
          },
        },
        shadows: {
          button: {
            primary: {
              default: {
                value: {
                  _light: "0 2px 4px 0 rgba(161, 126, 4, 0.15)",
                  _dark: "0 2px 4px 0 rgba(0, 0, 0, 0.4)",
                },
              },
              hover: {
                value: {
                  _light:
                    "0 12px 20px -4px rgba(161, 126, 4, 0.35), 0 4px 8px -2px rgba(161, 126, 4, 0.2)",
                  _dark:
                    "0 0 25px 2px rgba(255, 202, 8, 0.25), 0 8px 16px -4px rgba(0, 0, 0, 0.7)",
                },
              },
            },
            secondary: {
              default: {
                value: {
                  _light: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
                  _dark: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
                },
              },
              hover: {
                value: {
                  _light:
                    "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
                  _dark:
                    "0 10px 20px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
                },
              },
            },
          },
        },
        error: {
          bg: { value: "{colors.red.50}" },
          border: { value: "{colors.red.100}" },
          main: { value: "{colors.red.500}" },
          active: { value: "{colors.red.600}" },
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
    textStyles: {
      bodyXs: {
        value: {
          fontSize: "{fontSizes.xs}",
          lineHeight: "{lineHeights.normal}",
          fontWeight: "{fontWeights.regular}",
        },
      },
      bodySm: {
        value: {
          fontSize: "{fontSizes.sm}",
          lineHeight: "{lineHeights.normal}",
          fontWeight: "{fontWeights.regular}",
        },
      },
      bodyBase: {
        value: {
          fontSize: "{fontSizes.base}",
          lineHeight: "{lineHeights.relaxed}",
          fontWeight: "{fontWeights.regular}",
        },
      },
      headingMd: {
        value: {
          fontSize: "{fontSizes.md}",
          lineHeight: "{lineHeights.tight}",
          fontWeight: "{fontWeights.semibold}",
        },
      },
      headingLg: {
        value: {
          fontSize: "{fontSizes.lg}",
          lineHeight: "{lineHeights.tight}",
          fontWeight: "{fontWeights.bold}",
        },
      },
      headingXl: {
        value: {
          fontSize: "{fontSizes.xl}",
          lineHeight: "{lineHeights.tight}",
          fontWeight: "{fontWeights.bold}",
        },
      },
      heading2xl: {
        value: {
          fontSize: "{fontSizes.2xl}",
          lineHeight: "{lineHeights.none}",
          fontWeight: "{fontWeights.bold}",
        },
      },
      navLink: {
        value: {
          fontSize: "{fontSizes.sm}",
          lineHeight: "{lineHeights.snug}",
          fontWeight: "{fontWeights.medium}",
        },
      },
      link: {
        value: {
          fontSize: "inherit",
          lineHeight: "inherit",
          fontWeight: "{fontWeights.medium}",
        },
      },
      label: {
        value: {
          fontSize: "{fontSizes.sm}",
          lineHeight: "{lineHeights.snug}",
          fontWeight: "{fontWeights.medium}",
        },
      },
      buttonBase: {
        value: {
          fontSize: "{fontSizes.base}",
          lineHeight: "{lineHeights.snug}",
          fontWeight: "{fontWeights.semibold}",
        },
      },
      buttonSm: {
        value: {
          fontSize: "{fontSizes.sm}",
          lineHeight: "{lineHeights.snug}",
          fontWeight: "{fontWeights.semibold}",
        },
      },
    },
  },
  // globalCss: {
  //   "html, body": {
  //     margin: "0",
  //     padding: "0",
  //     height: "100%",
  //     width: "100%",
  //     fontFamily: "sans-serif",
  //     overflow: "hidden",
  //   },
  //   body: {
  //     // minHeight: "100vh",
  //     display: "grid",
  //   },
  // },
  outdir: "src/styled-system",
  importMap: "@/styled-system",
});
