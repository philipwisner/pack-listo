"use client";
import { useActionState, startTransition, useState } from "react";
import { signupAction } from "@/utils/auth/actions";
import { isMockMode } from "@/utils/auth/shared";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import {
  AuthContainerContent,
  FormContainer,
  PageBackground,
} from "../login/styles";
import { DarkModeToggle } from "@/components/DarkModeToggle/DarkModeToggle";
import { Logo } from "@/components/Logo/Logo";
import { Input } from "@/components/TextInput/TextInput";
import { Button } from "@/components/Button/Button";
import { InternalLink } from "@/components/InternalLink/InternalLink";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const [fieldErrors, setFieldErrors] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    // Check if the overall form is invalid
    if (!form.checkValidity()) {
      e.preventDefault(); // Stop form submission

      // 2. Query individual fields to see who is failing
      const emailInput = form.querySelector("#email") as HTMLInputElement;
      const passwordInput = form.querySelector("#password") as HTMLInputElement;

      setFieldErrors({
        email: !emailInput.validity.valid,
        password: !passwordInput.validity.valid,
      });
    } else {
      // Clear errors if everything is valid on submission attempt
      setFieldErrors({});
    }
  };

  const handleMockBypass = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", "Local Dev");
      formData.append("email", "developer@packlisto.local");
      formData.append("password", "localdevpass");
      formAction(formData);
    });
  };

  const isMockActive = isMockMode();

  return (
    <PageBackground>
      <div
        className={css({
          position: "fixed",
          top: "0",
          right: "0",
        })}
      >
        <DarkModeToggle />
      </div>
      <AuthContainerContent>
        <Logo />
        <FormContainer action={formAction} onSubmit={handleSubmit} noValidate>
          <div>
            <InputLabel htmlFor="email" label="Name" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              disabled={isPending}
              hasError={fieldErrors.email}
            />
          </div>
          <div>
            <InputLabel htmlFor="email" label="E-mail" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="user@email.com"
              disabled={isPending}
              hasError={fieldErrors.email}
            />
          </div>
          <div>
            <InputLabel htmlFor="password" label="Password" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••••"
              disabled={isPending}
              hasError={fieldErrors.password}
            />
          </div>
          <Button
            text="Sign Up"
            type="submit"
            isLoading={isPending}
            loadingText="Creating Account..."
          />
        </FormContainer>
        <div
          className={flex({
            direction: "column",
            align: "center",
            gap: "4",
            mt: "8",
          })}
        >
          <p
            className={css({
              fontSize: "base",
              color: "text.muted",
            })}
          >
            Already have an account? <InternalLink text="Log In" url="/login" />
          </p>
          {isMockActive && (
            <button
              onClick={handleMockBypass}
              type="button"
              disabled={isPending}
              className={css({
                width: "full",
                py: "2.5",
                px: "4",
                borderRadius: "xl",
                bg: { base: "indigo.50/50", _dark: "indigo.950/20" },
                border: "1px dashed",
                borderColor: "indigo.300/50",
                color: "text.muted",
                fontSize: "xs",
                fontWeight: "semibold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                _hover: {
                  bg: { base: "indigo.50", _dark: "indigo.950/40" },
                  borderColor: "indigo.500",
                },
              })}
            >
              💡 Dev Shortcut: Bypass Auth (Mock Mode)
            </button>
          )}
        </div>
      </AuthContainerContent>
    </PageBackground>
  );
}
