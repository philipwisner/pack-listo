"use client";
import { useActionState, startTransition } from "react";
import Link from "next/link";
import { loginAction } from "@/utils/auth/actions";
import { isMockMode } from "@/utils/auth/shared";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import { Input } from "@/components/TextInput/TextInput";
import InputLabel from "@/components/InputLabel/InputLabel";
import { styled } from "@/styled-system/jsx";
import { DarkModeToggle } from "@/components/DarkModeToggle/DarkModeToggle";
import Logo from "@/components/Logo/Logo";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const handleMockBypass = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", "developer@packlisto.local");
      formData.append("password", "localdevpass");
      formAction(formData);
    });
  };

  const isMockActive = isMockMode();

  const PageBackground = styled("div", {
    base: {
      transition: "all 0.2s ease",
      minHeight: "100vh",
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      px: "4",
      py: "12",
      bg: "background",
    },
  });

  const FormContainer = styled("form", {
    base: {
      width: "100%",
      marginTop: "8",
    },
  });

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
      <div
        className={css({
          maxWidth: "450px",
          width: "100%",
          height: "auto",
        })}
      >
        <Logo />
        <FormContainer action={formAction} className={css({ spaceY: "5" })}>
          <div>
            <InputLabel htmlFor="email" label="E-mail" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              disabled={isPending}
            />
          </div>
          <div>
            <InputLabel htmlFor="password" label="Password" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={css({
              width: "100%",
              py: "3",
              px: "4",
              borderRadius: "md",
              bg: "button.primary.bg",
              color: "button.primary.text",
              fontWeight: "semibold",
              fontSize: "base",
              shadow: "lg",
              cursor: "pointer",
              transition: "all 0.2s ease",
              _hover: {
                shadow: "0 10px 20px -10px rgba(99, 102, 241, 0.5)",
                transform: "translateY(-1px)",
              },
              _active: {
                transform: "translateY(1px)",
              },
              _disabled: {
                opacity: 0.7,
                cursor: "not-allowed",
                transform: "none",
              },
            })}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
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
            Don't have an account?{" "}
            <Link
              href="/signup"
              className={css({
                fontWeight: "semibold",
                textDecoration: "underline",
                color: "text.main",
                _hover: {
                  textDecorationColor: "accent",
                },
              })}
            >
              Sign Up
            </Link>
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
      </div>
    </PageBackground>
  );
}
