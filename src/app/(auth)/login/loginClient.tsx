"use client";
import { useActionState, useState, useEffect } from "react";
import { loginAction } from "@/features/auth/auth.actions";
import { Input } from "@/components/TextInput/TextInput";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { Button } from "@/components/Button/Button";
import { FormContainer } from "@/features/auth/auth.styles";
import { ArrowRight } from "lucide-react";
import { Error } from "@/components/Error/Error";

const initialState = {
  error: "",
  success: false,
};

interface LoginFormContentProps {
  redirectTo: string;
}

export function LoginFormContent({ redirectTo }: LoginFormContentProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const [fieldErrors, setFieldErrors] = useState<{
    email?: boolean;
    password?: boolean;
    server?: string;
  }>({});

  useEffect(() => {
    if (state?.error) {
      setFieldErrors({
        email: true,
        password: true,
        server: state.error,
      });
    }
  }, [state]);

  const handleInputChange = (field: "email" | "password") => {
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

      const emailInput = form.querySelector("#email") as HTMLInputElement;
      const passwordInput = form.querySelector("#password") as HTMLInputElement;

      setFieldErrors({
        email: !emailInput.validity.valid,
        password: !passwordInput.validity.valid,
        server: "Please fill out all required fields correctly.",
      });
    } else {
      setFieldErrors({});
    }
  };

  const emailDescribedBy =
    [
      fieldErrors.email ? "login-email-error" : null,
      fieldErrors.server ? "login-form-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const passwordDescribedBy =
    [
      fieldErrors.password ? "login-password-error" : null,
      fieldErrors.server ? "login-form-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormContainer action={formAction} onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
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
          aria-required="true"
          aria-invalid={Boolean(fieldErrors.email || fieldErrors.server)}
          aria-describedby={emailDescribedBy}
          onChange={() => handleInputChange("email")}
        />
        {fieldErrors.email && (
          <Error
            id="login-email-error"
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
          aria-required="true"
          hasError={fieldErrors.password}
          aria-invalid={Boolean(fieldErrors.password || fieldErrors.server)}
          aria-describedby={passwordDescribedBy}
          onChange={() => handleInputChange("password")}
        />
        {fieldErrors.password && (
          <Error
            id="login-password-error"
            text="Password is required."
            role="alert"
          />
        )}
      </div>
      <Button
        text="Log In"
        type="submit"
        isLoading={isPending}
        loadingText="Logging in..."
        iconRight={<ArrowRight />}
      />
      {fieldErrors.server && (
        <Error
          variant="message"
          id="login-form-error"
          text={fieldErrors.server}
          role="alert"
        />
      )}
    </FormContainer>
  );
}
