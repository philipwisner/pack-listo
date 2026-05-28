"use client";
import { useActionState, useState, useEffect, Suspense } from "react"; // 👈 Added Suspense
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/features/auth/auth.actions";
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
} from "@/features/auth/auth.styles";
import { MutedText } from "@/styles/text.styles";

const initialState = {
  error: "",
  success: false,
};

// 1. Move the search params and form logic into a sub-component
function LoginFormContent() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const searchParams = useSearchParams();
  const redirectToValue = searchParams.get("next") || "/dashboard";

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
      <input type="hidden" name="redirectTo" value={redirectToValue} />

      {fieldErrors.server && (
        <p
          style={{
            color: "var(--colors-red-500, #ef4444)",
            fontSize: "0.875rem",
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

// 2. The default export safely wraps the content in a Suspense boundary
export default function LoginPage() {
  return (
    <PageBackground>
      <AuthContainerContent>
        <Logo />

        {/* 👈 Next.js will now safely prerender this page shell statically */}
        <Suspense
          fallback={
            <p style={{ color: "var(--colors-slate-500)" }}>Loading form...</p>
          }
        >
          <LoginFormContent />
        </Suspense>

        <AdditionalOptions>
          <MutedText>
            Don't have an account? <InternalLink text="Sign Up" url="/signup" />
          </MutedText>
        </AdditionalOptions>
      </AuthContainerContent>
    </PageBackground>
  );
}
