"use client";

import { useActionState, startTransition } from "react";
import Link from "next/link";
import { signupAction } from "@/utils/auth/actions";
import { isMockMode } from "@/utils/auth/shared";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

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
    <div
      className={flex({
        minHeight: "100vh",
        align: "center",
        justify: "center",
        px: "4",
        py: "12",
        bg: { base: "slate.50", _dark: "zinc.950" },
        backgroundImage: {
          base: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)",
          _dark: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)",
        },
        fontFamily: "sans",
      })}
    >
      <div
        className={css({
          width: "full",
          maxWidth: "md",
          bg: { base: "white/80", _dark: "zinc.900/60" },
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: { base: "slate-200/50", _dark: "zinc-800/50" },
          borderRadius: "2xl",
          shadow: "2xl",
          p: "8",
          transition: "all 0.3s ease",
        })}
      >
        <div
          className={flex({
            direction: "column",
            align: "center",
            mb: "8",
            textAlign: "center",
          })}
        >
          <div
            className={flex({
              width: "12",
              height: "12",
              align: "center",
              justify: "center",
              borderRadius: "xl",
              bg: "indigo.500",
              color: "white",
              mb: "4",
              shadow: "0 0 15px rgba(99, 102, 241, 0.4)",
            })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1
            className={css({
              fontSize: "2xl",
              fontWeight: "bold",
              color: { base: "slate.900", _dark: "white" },
              letterSpacing: "tight",
            })}
          >
            Create Account
          </h1>
          <p
            className={css({
              fontSize: "sm",
              color: { base: "slate.500", _dark: "zinc.400" },
              mt: "1.5",
            })}
          >
            Get ready to explore the world stress-free
          </p>
        </div>

        <form action={formAction} className={css({ spaceY: "5" })}>
          {state?.error && (
            <div
              className={flex({
                align: "center",
                gap: "3",
                bg: "red.500/10",
                border: "1px solid",
                borderColor: "red.500/30",
                color: "red.500",
                p: "3.5",
                borderRadius: "xl",
                fontSize: "sm",
                mb: "4",
              })}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className={css({
                display: "block",
                fontSize: "xs",
                fontWeight: "semibold",
                color: { base: "slate.700", _dark: "zinc.300" },
                mb: "1.5",
                textTransform: "uppercase",
                letterSpacing: "wider",
              })}
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Alex Mercer"
              disabled={isPending}
              className={css({
                width: "full",
                px: "4",
                py: "3",
                borderRadius: "xl",
                border: "1px solid",
                borderColor: { base: "slate-200", _dark: "zinc-800" },
                bg: { base: "white/50", _dark: "zinc-950/50" },
                color: { base: "slate.900", _dark: "white" },
                outline: "none",
                fontSize: "sm",
                transition: "all 0.2s ease",
                _focus: {
                  borderColor: "indigo.500",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
                },
                _disabled: {
                  opacity: 0.6,
                  cursor: "not-allowed",
                },
              })}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={css({
                display: "block",
                fontSize: "xs",
                fontWeight: "semibold",
                color: { base: "slate.700", _dark: "zinc.300" },
                mb: "1.5",
                textTransform: "uppercase",
                letterSpacing: "wider",
              })}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              disabled={isPending}
              className={css({
                width: "full",
                px: "4",
                py: "3",
                borderRadius: "xl",
                border: "1px solid",
                borderColor: { base: "slate-200", _dark: "zinc-800" },
                bg: { base: "white/50", _dark: "zinc-950/50" },
                color: { base: "slate.900", _dark: "white" },
                outline: "none",
                fontSize: "sm",
                transition: "all 0.2s ease",
                _focus: {
                  borderColor: "indigo.500",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
                },
                _disabled: {
                  opacity: 0.6,
                  cursor: "not-allowed",
                },
              })}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={css({
                display: "block",
                fontSize: "xs",
                fontWeight: "semibold",
                color: { base: "slate.700", _dark: "zinc.300" },
                mb: "1.5",
                textTransform: "uppercase",
                letterSpacing: "wider",
              })}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              disabled={isPending}
              className={css({
                width: "full",
                px: "4",
                py: "3",
                borderRadius: "xl",
                border: "1px solid",
                borderColor: { base: "slate-200", _dark: "zinc-800" },
                bg: { base: "white/50", _dark: "zinc-950/50" },
                color: { base: "slate.900", _dark: "white" },
                outline: "none",
                fontSize: "sm",
                transition: "all 0.2s ease",
                _focus: {
                  borderColor: "indigo.500",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
                },
                _disabled: {
                  opacity: 0.6,
                  cursor: "not-allowed",
                },
              })}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={css({
              width: "full",
              py: "3",
              px: "4",
              borderRadius: "xl",
              bgGradient: "to-r",
              gradientFrom: "indigo.500",
              gradientTo: "violet.600",
              color: "white",
              fontWeight: "semibold",
              fontSize: "sm",
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
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div
          className={flex({
            direction: "column",
            align: "center",
            gap: "4",
            mt: "6",
            borderTop: "1px solid",
            borderColor: { base: "slate-100", _dark: "zinc-800/80" },
            pt: "6",
          })}
        >
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
                color: "indigo.500",
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

          <p
            className={css({
              fontSize: "xs",
              color: { base: "slate.500", _dark: "zinc.400" },
            })}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className={css({
                color: "indigo.500",
                fontWeight: "semibold",
                _hover: { textDecoration: "underline" },
              })}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

