import { styled } from "@/styled-system/jsx";
import { type ComponentProps } from "react";

export const Input = styled("input", {
  base: {
    width: "100%",
    px: "4",
    py: "3",
    borderRadius: "md",
    border: "1px solid",
    borderColor: "input.border",
    background: "input.background",
    color: "input.text",
    outline: "none",
    fontSize: "sm",
    transition: "all 0.2s ease",
    _focus: {
      borderColor: "input.focus",
      // boxShadow: "0 0 0 3px {colors.gray.500/15}",
    },
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  variants: {
    hasError: {
      true: {
        // Tied directly into your configured semantic error tokens!
        borderColor: "error.main",
        _focus: {
          borderColor: "error.main",
          boxShadow: "0 0 0 3px {colors.red.500/15}",
        },
      },
    },
  },
});

export type InputProps = ComponentProps<typeof Input>;
