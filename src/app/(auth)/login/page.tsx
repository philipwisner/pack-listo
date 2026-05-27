"use client";
import { useActionState, startTransition, useState } from "react";
import { loginAction } from "@/utils/auth/actions";
import { isMockMode } from "@/utils/auth/shared";
import { Input } from "@/components/TextInput/TextInput";
import { Logo } from "@/components/Logo/Logo";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { Button } from "@/components/Button/Button";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import {
  PageBackground,
  FormContainer,
  AuthContainerContent,
  AdditionalOptions,
} from "@/styles/authStyles";
import { MutedText } from "@/styles/textStyles";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
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
      formData.append("email", "developer@packlisto.local");
      formData.append("password", "localdevpass");
      formAction(formData);
    });
  };

  const isMockActive = isMockMode();

  return (
    <PageBackground>
      <AuthContainerContent>
        <Logo />
        <FormContainer action={formAction} onSubmit={handleSubmit} noValidate>
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
            text="Sign In"
            type="submit"
            isLoading={isPending}
            loadingText="Signing in..."
          />
        </FormContainer>
        <AdditionalOptions>
          <MutedText>
            Don't have an account? <InternalLink text="Sign Up" url="/signup" />
          </MutedText>
          {isMockActive && (
            <Button
              text="💡 Dev Shortcut: Bypass Auth (Mock Mode)"
              type="button"
              variant="alternative"
              size="small"
              width="fit"
              onClick={handleMockBypass}
              disabled={isPending}
            />
          )}
        </AdditionalOptions>
      </AuthContainerContent>
    </PageBackground>
  );
}
