"use client";
import { useActionState, useState, useEffect } from "react";
import { loginAction } from "@/features/auth/auth.actions";
import { Input } from "@/components/TextInput/TextInput";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { Button } from "@/components/Button/Button";
import { FormContainer } from "@/features/auth/auth.styles";

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

  return (
    <FormContainer action={formAction} onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {fieldErrors.server && (
        <p
          style={{
            color: "var(--colors-red-500, #ef4444)",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {fieldErrors.server}
        </p>
      )}
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
          onChange={() => handleInputChange("email")}
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
          onChange={() => handleInputChange("password")}
        />
      </div>

      <Button
        text="Log In"
        type="submit"
        isLoading={isPending}
        loadingText="Logging in..."
      />
    </FormContainer>
  );
}
