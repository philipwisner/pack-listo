import { styled } from "@/styled-system/jsx";

export const PageBackground = styled("div", {
  base: {
    transition: "all 0.2s ease",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    px: "8",
    py: "12",
    bg: "background",
  },
});

export const AuthContainerContent = styled("div", {
  base: {
    maxWidth: "450px",
    width: "100%",
    height: "auto",
  },
});

export const FormContainer = styled("form", {
  base: {
    width: "100%",
    marginTop: "8",
    gap: "5",
    display: "flex",
    flexDirection: "column",
  },
});
