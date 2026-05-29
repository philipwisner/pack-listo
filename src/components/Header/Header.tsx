"use client";
import { css } from "@/styled-system/css/css";
import { flex } from "@/styled-system/patterns/flex";
import { InternalLink } from "../InternalLink/InternalLink";
import { logoutAction } from "@/features/auth/auth.actions";
import { Button } from "../Button/Button";
import { Logo } from "../Logo/Logo";
import Link from "next/link";
import { AuthUser } from "@/lib/auth";

export interface HeaderProps {
  user?: AuthUser | null;
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header
      className={css({
        bg: "background",
        w: "100%",
      })}
    >
      <div
        className={flex({
          justify: "space-between",
          align: "center",
          maxWidth: "xl",
          mx: "auto",
          px: { base: "4", md: "8" },
          py: "4",
        })}
      >
        <Link
          href="/dashboard"
          className={flex({
            align: "center",
            gap: "2.5",
            maxWidth: "230px",
          })}
        >
          <Logo />
        </Link>
        <div className={flex({ align: "center", gap: "4" })}>
          <InternalLink text="Dashboard" url="/dashboard" />
          <InternalLink text="Lists" url="/lists" />
          <InternalLink text="Items" url="/items" />
          <InternalLink text="Categories" url="/categories" />
          <InternalLink text="Bags" url="/bags" />
          {user && user.isAdmin && <InternalLink text="Admin" url="/admin" />}
          <p>{user?.name}</p>
          <form action={logoutAction}>
            <Button
              type="submit"
              text="Log Out"
              variant="secondary"
              size="small"
            />
          </form>
        </div>
      </div>
    </header>
  );
};
