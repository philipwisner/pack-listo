"use client";

import { useActionState, useState, useEffect } from "react";
import { signupAction } from "@/features/auth/auth.actions";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { Input } from "@/components/TextInput/TextInput";
import { Button } from "@/components/Button/Button";
import { FormContainer } from "@/features/auth/auth.styles";
import { Error } from "@/components/Error/Error";

const initialState = {
  error: "",
  success: false,
};

export function SignupFormContent() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const [fieldErrors, setFieldErrors] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    server?: string;
  }>({});

  // Synchronize database execution errors (e.g., "Email already registered")
  useEffect(() => {
    if (state?.error) {
      setFieldErrors({
        name: true,
        email: true,
        password: true,
        server: state.error,
      });
    }
  }, [state]);

  const handleInputChange = (field: "name" | "email" | "password") => {
    if (fieldErrors[field] || fieldErrors.server) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: false,
        server: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.preventDefault();

      const nameInput = form.querySelector("#name") as HTMLInputElement;
      const emailInput = form.querySelector("#email") as HTMLInputElement;
      const passwordInput = form.querySelector("#password") as HTMLInputElement;

      setFieldErrors({
        name: !nameInput.validity.valid,
        email: !emailInput.validity.valid,
        password: !passwordInput.validity.valid,
        server: "Please fill out all required fields correctly.",
      });
    } else {
      setFieldErrors({});
    }
  };

  const nameDescribedBy =
    [
      fieldErrors.name ? "signup-name-error" : null,
      fieldErrors.server ? "signup-form-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const emailDescribedBy =
    [
      fieldErrors.email ? "signup-email-error" : null,
      fieldErrors.server ? "signup-form-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const passwordDescribedBy =
    [
      fieldErrors.password ? "signup-password-error" : null,
      fieldErrors.server ? "signup-form-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
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
          aria-invalid={Boolean(fieldErrors.name || fieldErrors.server)}
          aria-describedby={nameDescribedBy}
          onChange={() => handleInputChange("name")}
        />
        {fieldErrors.name && (
          <Error id="signup-name-error" text="Name is required." role="alert" />
        )}
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
          aria-invalid={Boolean(fieldErrors.email || fieldErrors.server)}
          aria-describedby={emailDescribedBy}
          onChange={() => handleInputChange("email")}
        />
        {fieldErrors.email && (
          <Error
            id="signup-email-error"
            text="Please enter a valid email address."
            role="alert"
          />
        )}
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
          aria-invalid={Boolean(fieldErrors.password || fieldErrors.server)}
          aria-describedby={passwordDescribedBy}
          onChange={() => handleInputChange("password")}
        />
        {fieldErrors.password && (
          <Error
            id="signup-password-error"
            text="Password is required."
            role="alert"
          />
        )}
      </div>
      <Button
        text="Sign Up"
        type="submit"
        isLoading={isPending}
        loadingText="Creating Account..."
      />
      {fieldErrors.server && (
        <Error
          variant="message"
          id="signup-form-error"
          text={fieldErrors.server}
          role="alert"
        />
      )}
    </FormContainer>
  );
}
