import { styled } from "@/styled-system/jsx";

export const InputLabelStyled = styled("label", {
  base: {
    display: "block",
    fontSize: "base",
    fontWeight: "semibold",
    color: "input.label",
    mb: "1",
  },
});

export interface InputLabelProps {
  label: string;
  htmlFor: string;
}

export const InputLabel = ({ label, htmlFor }: InputLabelProps) => {
  return <InputLabelStyled htmlFor={htmlFor}>{label}</InputLabelStyled>;
};
