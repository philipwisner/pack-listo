import { styled } from "@/styled-system/jsx";

export const PrimaryHeading = styled("h1", {
  base: {
    fontSize: "{fontSizes.2xl}",
    lineHeight: "{lineHeights.none}",
    fontWeight: "{fontWeights.bold}",
  },
});

export const SecondaryHeading = styled("h2", {
  base: {
    fontSize: "{fontSizes.xl}",
    lineHeight: "{lineHeights.tight}",
    fontWeight: "{fontWeights.semibold}",
  },
});

export const MutedText = styled("p", {
  base: {
    display: "block",
    fontSize: "base",
    fontWeight: "semibold",
    color: "input.label",
    mb: "1",
  },
});
