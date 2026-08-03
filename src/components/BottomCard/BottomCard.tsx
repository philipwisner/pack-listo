import { styled } from "@/styled-system/jsx";
import { type ComponentProps, useRef } from "react";
import { Button } from "../Button/Button";
import { token } from "@/styled-system/tokens";
import { SecondaryHeading } from "@/styles/text.styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import { InputLabel } from "../InputLabel/InputLabel";
import { Input } from "../TextInput/TextInput";

export interface BottomCardProps
  extends ComponentProps<typeof BottomCardStyled> {
  heading?: string;
  isLoading?: boolean;
  button?: {
    text: string;
    type: "button" | "submit" | "reset";
    onClick?: () => void;
  };
  inputs?: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }[];
  onClose?: () => void;
  onSave?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const BottomCardStyled = styled("div", {
  base: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: { base: "white", _dark: "gray.800" },
    padding: "1rem",
    zIndex: 1000,
    minHeight: "100px",
  },
});

export const BottomCard = ({
  heading,
  inputs,
  button,
  isLoading = false,
  onClose,
  onSave,
}: BottomCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    onClose?.();
  });

  return (
    <BottomCardStyled ref={ref}>
      <div
        style={{
          maxWidth: token("sizes.pageContainer"),
          margin: "0 auto",
        }}
      >
        <SecondaryHeading>{heading}</SecondaryHeading>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <form onSubmit={onSave}>
            {inputs &&
              inputs.length &&
              inputs.map((input) => {
                return (
                  <div key={input.id}>
                    <InputLabel htmlFor={input.id} label={input.label} />
                    <Input
                      id={input.id}
                      name={input.id}
                      type={input.type}
                      required={input.required}
                      placeholder={input.placeholder}
                      aria-required={input.required}
                      // hasError={fieldErrors.password}
                      // aria-invalid={Boolean(
                      //   fieldErrors.password || fieldErrors.server,
                      // )}
                      // aria-describedby={passwordDescribedBy}
                      // onChange={() => handleInputChange("password")}
                    />
                    {/* {fieldErrors.password && (
                    <Error
                      id="login-password-error"
                      text="Password is required."
                      role="alert"
                    />
                  )} */}
                  </div>
                );
              })}
            <Button text="Create List" width="fit" type="submit" />

            {/* {error && (
              <div
                style={{
                  background: "var(--accent-blue)",
                  color: "white",
                  padding: "1rem",
                  marginBottom: "2rem",
                  fontWeight: 800,
                }}
              >
                ERROR: {error}
              </div>
            )} */}
          </form>
        </div>
      </div>
    </BottomCardStyled>
  );
};
