import { styled } from "@/styled-system/jsx";
import { type ComponentProps, type ReactNode } from "react";

// 1. Define strict type props for your API layout
export interface ButtonProps extends ComponentProps<typeof ButtonStyled> {
  variant?: "primary" | "secondary" | "alternative";
  width?: "full" | "fit";
  size?: "small" | "base";
  primary?: boolean;
  text?: string;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

// 2. The Master Style Recipe Builder
export const ButtonStyled = styled("button", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    py: "3",
    px: "4",
    borderRadius: "md",
    fontWeight: "bold",
    fontSize: "base",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    // _focus: {
    //   outline: "2px solid",
    //   outlineOffset: "2px",
    // },
    _focusVisible: {
      outline: "2px solid",
      outlineOffset: "2px",
    },

    _active: {
      transform: "translateY(1px)",
      shadow: "sm",
    },

    _disabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      transform: "none",
      shadow: "none",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "button.primary.bg",
        color: "button.primary.text",
        _hover: {
          bg: "button.primary.hoverBg",
          shadow:
            "0 12px 20px -4px rgba(161, 126, 4, 0.35), 0 4px 8px -2px rgba(161, 126, 4, 0.2)",
          transform: "translateY(-1px)",
        },
        _focus: {
          outlineColor: "button.primary.focusRing",
        },
        _focusVisible: {
          outlineColor: "button.primary.focusRing",
        },
        _active: {
          bg: "button.primary.activeBg",
        },
        _disabled: {
          bg: "button.primary.disabledBg",
          color: "button.primary.disabledText",
          _hover: { bg: "button.primary.disabledBg" },
        },
      },
      secondary: {
        bg: "button.secondary.bg",
        color: "button.secondary.text",
        border: "1px solid",
        borderColor: "input.border.default",
        _hover: {
          bg: "button.secondary.hoverBg",
          shadow: "shadows.button.secondary",
          transform: "translateY(-1px)",
        },
        _focus: {
          outlineColor: "input.border.focus",
        },
        _focusVisible: {
          outlineColor: "input.border.focus",
        },
        _active: {
          bg: "button.secondary.activeBg",
        },
        _disabled: {
          bg: "input.background.disabled",
          color: "input.placeholder.default",
          _hover: { bg: "input.background.disabled" },
        },
      },
      alternative: {
        borderRadius: "full",
        border: "1px dashed",
        borderColor: { base: "gray.300", _dark: "gray.500" },
        color: "text.muted",
        fontWeight: "semibold",
        _hover: {
          bg: { base: "gray.100", _dark: "gray.900" },
          borderColor: { base: "gray.400", _dark: "gray.400" },
          color: "text.main",
          scale: "1.01",
        },
      },
    },

    // Width Sizing Rules
    width: {
      full: { width: "100%", mt: "2" },
      fit: { width: "fit-content" },
    },

    // Button sizing rules
    size: {
      small: {
        py: "1",
        px: "4",
        fontSize: "sm",
      },
      base: {
        py: "3",
        px: "4",
        fontSize: "base",
      },
    },
  },

  // Fallback production safety defaults
  defaultVariants: {
    variant: "primary",
    width: "full",
    size: "base",
  },
});

//Need variants (primary, secondary, tertiary, alternative), width (full, fit), size (small, base, large)
//Need loading state and icon support
//Need outline versions of the icons?

// 3. Render Component Structure
export const Button = ({
  variant = "primary",
  width = "full",
  size = "base",
  text = "",
  isLoading = false,
  loadingText = "",
  iconLeft,
  iconRight,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyled
      variant={variant}
      width={width}
      size={size}
      disabled={isLoading || disabled}
      data-loading={isLoading ? "true" : undefined}
      {...props}
    >
      {!isLoading && iconLeft && (
        <span className="button-icon">{iconLeft}</span>
      )}
      {isLoading && (
        <span className="button-spinner" aria-hidden="true">
          ... {/* Replace with an SVG spin-graphic or keyframe component */}
        </span>
      )}
      <span>{isLoading ? loadingText : text}</span>
      {!isLoading && iconRight && (
        <span className="button-icon">{iconRight}</span>
      )}
    </ButtonStyled>
  );
};
