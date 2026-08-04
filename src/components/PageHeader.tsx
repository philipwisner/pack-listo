import { styled } from "@/styled-system/jsx";
import { css } from "@/styled-system/css/css";
import { type ComponentProps } from "react";
import { Button } from "@/components/Button/Button";
import { PrimaryHeading } from "@/styles/text.styles";

export interface PageHeaderProps
  extends ComponentProps<typeof PageHeaderStyled> {
  text: string;
  isLoading?: boolean;
  button?: {
    text: string;
    onClick?: () => void;
  };
}

export const PageHeaderStyled = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "4",
    mb: "6",
  },
});

export const PageHeader = ({
  text,
  button,
  isLoading = false,
  ...props
}: PageHeaderProps) => {
  return (
    <PageHeaderStyled {...props}>
      <PrimaryHeading
        className={css({
          flex: "1 1 auto",
        })}
      >
        {text}
      </PrimaryHeading>
      {button && (
        <Button
          text={button.text}
          width="fit"
          onClick={button.onClick}
          disabled={isLoading}
        />
      )}
    </PageHeaderStyled>
  );
};
