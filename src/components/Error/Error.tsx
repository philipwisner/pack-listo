import { styled } from "@/styled-system/jsx";
import { LucideAlertCircle } from "lucide-react";
import { type ComponentProps } from "react";

// 1. Define strict type props for your API layout
export interface ErrorProps extends ComponentProps<typeof ErrorStyled> {
  variant?: "input" | "message" | "inverse";
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
    fontWeight: "regular",
    fontSize: "base",
  },
  variants: {
    variant: {
      input: {
        color: "error.text",
        pt: "2",
        pb: "0",
        px: "0",
        gap: "2",
        mb: "-2",
        fontSize: "sm",
      },
      message: {
        borderRadius: "md",
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
    variant: "input",
    width: "full",
  },
});

// 3. Render Component Structure
export const Error = ({
  variant = "input",
  width = "full",
  canDismiss = false,
  text = "",
  ...props
}: ErrorProps) => {
  return (
    <ErrorStyled variant={variant} width={width} {...props}>
      <LucideAlertCircle size={variant === "input" ? 16 : 20} />
      <p>{text}</p>
      {canDismiss && <span>x</span>}
    </ErrorStyled>
  );
};
