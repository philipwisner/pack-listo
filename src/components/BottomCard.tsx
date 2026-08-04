import { type ComponentProps, useRef } from "react";
import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";
import { Button } from "@/components//Button/Button";
import { InputLabel } from "@/components/InputLabel";
import { Input } from "@/components/TextInput/TextInput";
import { Error } from "@/components/Error";
import { useClickOutside } from "@/hooks/useClickOutside";
import { SecondaryHeading } from "@/styles/text.styles";

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
  fieldErrors?: { [key: string]: boolean };
}

export const BottomCardStyled = styled("div", {
  base: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: { base: "white", _dark: "gray.800" },
    zIndex: 1000,
    minHeight: "100px",
    paddingTop: token("spacing.10"),
    paddingBottom: token("spacing.20"),
  },
});

export const BottomCard = ({
  heading,
  inputs,
  button,
  isLoading = false,
  onClose,
  onSave,
  fieldErrors,
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
          paddingLeft: token("spacing.8"),
          paddingRight: token("spacing.8"),
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
          <form
            onSubmit={onSave}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
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
                      data-1p-ignore
                      data-bwignore
                      data-lpignore="true"
                      hasError={fieldErrors?.[input.id]}
                      // aria-invalid={Boolean(
                      //   fieldErrors.password || fieldErrors.server,
                      // )}
                      // aria-describedby={passwordDescribedBy}
                      // onChange={() => handleInputChange("password")}
                    />
                    {fieldErrors?.[input.id] && (
                      <Error
                        id="login-password-error"
                        text="Password is required."
                        role="alert"
                      />
                    )}
                  </div>
                );
              })}
            <Button
              text="Cancel"
              width="fit"
              type="button"
              variant="secondary"
            />
            <Button text={button?.text} width="fit" type="submit" />

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
