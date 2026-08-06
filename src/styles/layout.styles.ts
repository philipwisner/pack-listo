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

export const ListContainer = styled("div", {
  base: {
    marginTop: token("spacing.8"),
  },
});

export const ListItemContainer = styled("div", {
  base: {
    border: "1px solid",
    marginBottom: token("spacing.2"),
    borderColor: {
      base: "gray.300",
      _dark: "gray.600",
    },
    background: {
      base: "white",
      _dark: "gray.900",
    },
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    padding: token("spacing.4"),
    borderRadius: token("radii.sm"),
    width: "100%",
    flexWrap: "wrap",
  },
});

export const InlineButtonsContainer = styled("div", {
  base: {
    flex: "1 1 200px",
    display: "flex",
    justifyContent: "flex-end",
    gap: token("spacing.2"),
  },
});

export const ColorTag = styled("span", {
  base: {
    paddingInline: token("spacing.2"),
    paddingBlock: token("spacing.1"),
    borderRadius: token("radii.sm"),
    color: token("colors.white"),
    width: "80px",
    fontWeight: token("fontWeights.semibold"),
    textAlign: "center",
    display: "inline-block",
    fontSize: token("fontSizes.sm"),
  },
});
