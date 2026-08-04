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
  // Accepts a string message or a boolean flag per input ID
  fieldErrors?: Record<string, string | boolean | undefined>;
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
        {heading && <SecondaryHeading>{heading}</SecondaryHeading>}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <form
            onSubmit={onSave}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {inputs?.map((input) => {
              const error = fieldErrors?.[input.id];
              const hasError = Boolean(error);
              const errorId = `${input.id}-error`;
              const errorMessage =
                typeof error === "string"
                  ? error
                  : `${input.label} is invalid.`;

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
                    hasError={hasError}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                  />
                  {hasError && (
                    <Error id={errorId} text={errorMessage} role="alert" />
                  )}
                </div>
              );
            })}

            <Button
              text="Cancel"
              width="fit"
              type="button"
              variant="secondary"
              onClick={onClose}
            />
            <Button
              text={button?.text ?? "Save"}
              width="fit"
              type="submit"
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
    </BottomCardStyled>
  );
};
