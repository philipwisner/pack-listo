import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";

export const PageContainer = styled("div", {
  base: {
    padding: token("spacing.8"),
    maxWidth: token("sizes.pageContainer"),
    margin: "0 auto",
  },
});
