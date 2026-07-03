import { styled } from "@/styled-system/jsx";
import { LucideAlertCircle } from "lucide-react";
import { type ComponentProps, type ReactNode } from "react";

// 1. Define strict type props for your API layout
export interface ErrorProps extends ComponentProps<typeof ErrorStyled> {
  variant?: "primary" | "inverse" | "alternative";
  width?: "full" | "fit";
  canDismiss?: boolean;
  text: string;
}

// 2. The Master Style Recipe Builder
export const ErrorStyled = styled("div", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "4",
    py: "3",
    px: "4",
    borderRadius: "md",
    fontWeight: "regular",
    fontSize: "base",
  },
  variants: {
    variant: {
      primary: {
        bg: "error.bg",
        color: "error.text",
        border: "1px solid",
        borderColor: "error.border",
      },
      inverse: {
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
      full: { width: "100%" },
      fit: { width: "fit-content" },
    },
  },

  defaultVariants: {
    variant: "primary",
    width: "full",
  },
});

// 3. Render Component Structure
export const Error = ({
  variant = "primary",
  width = "full",
  canDismiss = false,
  text = "",
  ...props
}: ErrorProps) => {
  return (
    <ErrorStyled variant={variant} width={width} {...props}>
      <LucideAlertCircle size={20} />
      <p>{text}</p>
      {canDismiss && <span>x</span>}
    </ErrorStyled>
  );
};
