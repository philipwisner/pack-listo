"use client";
import { useActionState, startTransition, useState } from "react";
import { signupAction } from "@/utils/auth/actions";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { Logo } from "@/components/Logo/Logo";
import { Input } from "@/components/TextInput/TextInput";
import { Button } from "@/components/Button/Button";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import { MutedText } from "@/styles/textStyles";
import {
  PageBackground,
  AuthContainerContent,
  FormContainer,
  AdditionalOptions,
} from "@/styles/authStyles";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [_state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const [fieldErrors, setFieldErrors] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
  }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    // Check if the overall form is invalid
    if (!form.checkValidity()) {
      e.preventDefault(); // Stop form submission

      // 2. Query individual fields to see who is failing
      const nameInput = form.querySelector("#name") as HTMLInputElement;
      const emailInput = form.querySelector("#email") as HTMLInputElement;
      const passwordInput = form.querySelector("#password") as HTMLInputElement;

      setFieldErrors({
        name: !nameInput.validity.valid,
        email: !emailInput.validity.valid,
        password: !passwordInput.validity.valid,
      });
    } else {
      // Clear errors if everything is valid on submission attempt
      setFieldErrors({});
    }
  };

  return (
    <PageBackground>
      <AuthContainerContent>
        <Logo />
        <FormContainer action={formAction} onSubmit={handleSubmit} noValidate>
          <div>
            <InputLabel htmlFor="name" label="Name" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              disabled={isPending}
              hasError={fieldErrors.name}
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
        <AdditionalOptions>
          <MutedText>
            Already have an account? <InternalLink text="Log In" url="/login" />
          </MutedText>
        </AdditionalOptions>
      </AuthContainerContent>
    </PageBackground>
  );
}
