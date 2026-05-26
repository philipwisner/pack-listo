import { styled } from "@/styled-system/jsx/factory";

export interface ButtonProps {
  primary?: boolean;
  type?: "button" | "submit" | "reset";
  text: string;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

const ButtonStyled = styled("button", {
  base: {
    width: "100%",
    py: "3",
    px: "4",
    mt: "2",
    borderRadius: "md",
    bg: "button.primary.bg",
    color: "button.primary.text",
    fontWeight: "semibold",
    fontSize: "base",
    shadow: "lg",
    cursor: "pointer",
    transition: "all 0.2s ease",
    _hover: {
      shadow: "0 10px 20px -10px rgba(99, 102, 241, 0.5)",
      transform: "translateY(-1px)",
    },
    _active: {
      transform: "translateY(1px)",
    },
    _disabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      transform: "none",
    },
  },
});

//Need to handle the different types - themes
//Widths?
//Icons?

const Button = ({
  primary = false,
  type = "button",
  text = "",
  isLoading = false,
  loadingText = "",
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyled type={type} disabled={isLoading} {...props}>
      {isLoading ? loadingText : text}
    </ButtonStyled>
  );
};

export default Button;
