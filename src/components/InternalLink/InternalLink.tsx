import { styled } from "@/styled-system/jsx/factory";
import { Sign } from "crypto";
import Link from "next/link";

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
    _focus: {
      outline: "1.5px solid",
      outlineColor: "input.focusRing.default",
      outlineOffset: "2px",
      textDecorationColor: "accent",
    },
    _active: {
      color: "link.active",
    },
  },
});

export const InternalLink = ({
  text = "",
  url = "",
  ...props
}: InternalLinkProps) => {
  return (
    <LinkStyled href={url} {...props}>
      {text}
    </LinkStyled>
  );
};
