import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";

export const PageContainer = styled("div", {
  base: {
    padding: token("spacing.8"),
    maxWidth: token("sizes.pageContainer"),
    margin: "0 auto",
  },
});

export const PageOverlay = styled("div", {
  base: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100vh",
    width: "100vw",
    zIndex: 100,
    background: "black",
    opacity: 0.4,
  },
});
