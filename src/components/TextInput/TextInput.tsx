import { styled } from "@/styled-system/jsx";
import { type ComponentProps } from "react";

export const InputStyled = styled("input", {
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
    _placeholder: {
      color: "input.placeholder.default",
      opacity: 1,
    },
    _disabled: {
      opacity: 0.8,
      backgroundColor: "input.background.disabled",
      cursor: "not-allowed",
      _hover: { borderColor: "input.border.default" },
    },
    _peerInvalid: {
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
        // _placeholder: {
        //   color: "input.placeholder.error",
        // },
      },
    },
    hasSuccess: {
      true: {
        borderColor: "input.border.success",
        bg: "input.background.success",
        _focus: {
          borderColor: "input.border.focusSuccess",
          outline: "1.5px solid",
          outlineColor: "input.focusRing.success",
        },
        _hover: { borderColor: "input.border.hoverSuccess" },
        // _placeholder: {
        //   color: "input.placeholder.success",
        // },
      },
    },
  },
});

export const Input = ({
  hasError,
  ...props
}: ComponentProps<typeof InputStyled>) => {
  return <InputStyled {...props} hasError={hasError} />;
};
