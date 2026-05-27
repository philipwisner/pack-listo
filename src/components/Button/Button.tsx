import { styled } from "@/styled-system/jsx";
import { type ComponentProps, type ReactNode } from "react";

// 1. Define strict type props for your API layout
export interface ButtonProps extends ComponentProps<typeof ButtonStyled> {
  visual?: "primary" | "secondary";
  width?: "full" | "fit";
  text: string;
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
    gap: "2", // Perfect spacing balance for when icons are added
    py: "3",
    px: "4",
    borderRadius: "md",
    fontWeight: "bold",
    fontSize: "base",
    fontFamily: "sans",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

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
    visual: {
      primary: {
        bg: "button.primary.bg",
        color: "button.primary.text",
        _hover: {
          bg: "button.primary.hoverBg",
          shadow:
            "0 12px 20px -4px rgba(161, 126, 4, 0.35), 0 4px 8px -2px rgba(161, 126, 4, 0.2)",
          transform: "translateY(-1px)",
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
    },

    // Width Sizing Rules
    width: {
      full: { width: "100%", mt: "2" },
      fit: { width: "fit-content" },
    },
  },

  // Fallback production safety defaults
  defaultVariants: {
    visual: "primary",
    width: "full",
  },
});

// 3. Render Component Structure
export const Button = ({
  visual = "primary",
  width = "full",
  type = "button",
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
      type={type}
      visual={visual}
      width={width}
      disabled={isLoading || disabled}
      data-loading={isLoading ? "true" : undefined} // Excellent for target styling rules
      {...props}
    >
      {/* Left Icon Render Block */}
      {!isLoading && iconLeft && (
        <span className="button-icon">{iconLeft}</span>
      )}

      {/* Operational Spinner Element (Optional/Customizable) */}
      {isLoading && (
        <span className="button-spinner" aria-hidden="true">
          🌀 {/* Replace with an SVG spin-graphic or keyframe component */}
        </span>
      )}

      {/* Primary Display Text Block */}
      <span>{isLoading ? loadingText : text}</span>

      {/* Right Icon Render Block */}
      {!isLoading && iconRight && (
        <span className="button-icon">{iconRight}</span>
      )}
    </ButtonStyled>
  );
};
