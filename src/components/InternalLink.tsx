"use client";
import { styled } from "@/styled-system/jsx/factory";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface InternalLinkProps {
  text: string;
  url: string;
}

const LinkStyled = styled(Link, {
  base: {
    fontWeight: "semibold",
    textDecoration: "underline",
    color: "link.main",
    cursor: "pointer",
    _hover: {
      textDecoration: "underline",
      textDecorationColor: "accent",
      color: "link.hover",
    },
    _focusVisible: {
      outline: "1.5px solid",
      outlineColor: "input.focusRing.default",
      outlineOffset: "2px",
      textDecorationColor: "accent",
    },
    _active: {
      color: "link.active",
    },
  },
  variants: {
    isActive: {
      true: {
        textDecoration: "underline",
        textDecorationColor: "accent",
      },
    },
  },
});

export const InternalLink = ({
  text = "",
  url = "",
  ...props
}: InternalLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === url;
  return (
    <LinkStyled href={url} {...props} isActive={isActive} prefetch="auto">
      {text}
    </LinkStyled>
  );
};
