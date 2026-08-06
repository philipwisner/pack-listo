import { styled } from "@/styled-system/jsx";
import { type ComponentProps } from "react";

export const SelectStyled = styled("select", {
  base: {
    width: "100%",
    px: "4",
    py: "3",
    borderRadius: "md",
    border: "1px solid",
    borderColor: "input.border.default",
    background: "input.background.default",
    color: "input.text",
    outline: "none",
    fontSize: "base",
    cursor: "pointer",
    transition: "all 0.2s ease",
    _hover: {
      borderColor: "input.border.hover",
    },
    _focus: {
      borderColor: "input.border.focus",
      outline: "1.5px solid",
      outlineColor: "input.focusRing.default",
      outlineOffset: "2px",
    },
    _disabled: {
      opacity: 0.8,
      backgroundColor: "input.background.disabled",
      cursor: "not-allowed",
      _hover: { borderColor: "input.border.default" },
    },
  },
  variants: {
    hasError: {
      true: {
        borderColor: "input.border.error",
        bg: "input.background.error",
        _focus: {
          borderColor: "input.border.focusError",
          outline: "1.5px solid",
          outlineColor: "input.focusRing.error",
        },
        _hover: { borderColor: "input.border.hoverError" },
      },
    },
  },
});

export interface SelectProps extends ComponentProps<typeof SelectStyled> {
  hasError?: boolean;
}

export const Select = ({ hasError, ...props }: SelectProps) => {
  return <SelectStyled {...props} hasError={hasError} />;
};
