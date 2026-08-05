import { type ComponentProps, useRef } from "react";
import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";
import { Button } from "@/components//Button/Button";
import { InputLabel } from "@/components/InputLabel";
import { Input } from "@/components/TextInput/TextInput";
import { Select } from "@/components/Select/Select";
import { CustomSelect } from "@/components/CustomSelect/CustomSelect";
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
    option?: any[];
    options?: any[];
    defaultValue?: any;
    closeOnSelect?: boolean;
    multiple?: boolean;
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
    backgroundColor: { base: "white", _dark: "gray.900" },
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
          width: "100%",
        }}
      >
        {heading && <SecondaryHeading>{heading}</SecondaryHeading>}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <form
            onSubmit={onSave}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
              width: "100%",
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
                <div key={input.id} style={{ flex: 1, minWidth: "200px" }}>
                  <InputLabel htmlFor={input.id} label={input.label} />
                  {input.type === "custom-select" ? (
                    <CustomSelect
                      name={input.id}
                      label={input.label}
                      placeholder={input.placeholder}
                      options={(input.option || input.options || []).map(
                        (opt: any) => ({
                          value: opt.id ?? opt.value ?? String(opt),
                          label: opt.name ?? opt.label ?? String(opt),
                        }),
                      )}
                      defaultValue={input.defaultValue || undefined}
                      required={input.required}
                      hasError={hasError}
                      closeOnSelect={input.closeOnSelect ?? true}
                      multiple={input.multiple ?? false}
                    />
                  ) : input.type === "select" ? (
                    <Select
                      id={input.id}
                      name={input.id}
                      required={input.required}
                      defaultValue={input.defaultValue}
                      hasError={hasError}
                      aria-required={input.required}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                    >
                      {input.placeholder && (
                        <option value="">{input.placeholder}</option>
                      )}
                      {(input.option || input.options || []).map((opt: any) => {
                        const value = opt.id ?? opt.value ?? opt;
                        const label = opt.name ?? opt.label ?? opt;
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </Select>
                  ) : (
                    <Input
                      id={input.id}
                      name={input.id}
                      type={input.type}
                      required={input.required}
                      placeholder={input.placeholder}
                      defaultValue={input.defaultValue}
                      aria-required={input.required}
                      hasError={hasError}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                      data-1p-ignore
                      data-bwignore
                      data-lpignore="true"
                    />
                  )}
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
