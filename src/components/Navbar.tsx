"use client";
import Link from "next/link";
import { css } from "@/styled-system/css/css";
import { flex } from "@/styled-system/patterns/flex";
import { InternalLink } from "@/components/InternalLink";
import { Button } from "@/components/Button/Button";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/features/auth/auth.actions";
import { AuthUser } from "@/lib/auth";
import { Dropdown } from "@/components/Dropdown";

export interface NavbarProps {
  user?: AuthUser | null;
}

export const Navbar = ({ user }: NavbarProps) => {
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
        <div className={flex({ align: "center", gap: "4", flexWrap: "wrap" })}>
          <InternalLink text="Dashboard" url="/dashboard" />
          <InternalLink text="Lists" url="/lists" />
          <InternalLink text="Items" url="/items" />
          <InternalLink text="Categories" url="/categories" />
          <InternalLink text="Bags" url="/bags" />
          {user && user.isAdmin && <InternalLink text="Admin" url="/admin" />}
          <Dropdown
            triggerLabel="Settings"
            // items={[
            //   { id: "user", label: user?.name ?? "Unknown" },
            //   { id: "edit", label: "Edit Profile" },
            // ]}
            groups={[
              {
                id: "user",
                label: user?.name ?? "Unknown",
                items: [
                  {
                    id: "profile",
                    label: "Edit Profile",
                  },
                ],
              },
              {
                id: "configure",
                label: "Configure",
                items: [
                  {
                    id: "categories",
                    label: "Categories",
                    href: "/categories",
                  },
                  {
                    id: "bags",
                    label: "Bags",
                    href: "/bags",
                  },
                ],
              },
              {
                id: "settings",
                label: "App Settings",
                items: [
                  {
                    id: "theme",
                    label: "Dark Mode",
                  },
                  {
                    id: "measurement",
                    label: "Measurements",
                  },
                ],
              },
              {
                id: "actions",
                label: "Actions",
                items: [{ id: "logout", label: "Log Out", shortcut: "⇧⌘L" }],
              },
            ]}
          />
          <Dropdown
            customTrigger={<p>{user?.name}</p>}
            groups={[
              {
                id: "user",
                label: user?.name ?? "Unknown",
                items: [
                  {
                    id: "profile",
                    label: "Edit Profile",
                  },
                ],
              },
              {
                id: "configure",
                label: "Configure",
                items: [
                  {
                    id: "categories",
                    label: "Categories",
                    href: "/categories",
                  },
                  {
                    id: "bags",
                    label: "Bags",
                    href: "/bags",
                  },
                ],
              },
              {
                id: "settings",
                label: "App Settings",
                items: [
                  {
                    id: "theme",
                    label: "Dark Mode",
                  },
                  {
                    id: "measurement",
                    label: "Measurements",
                  },
                ],
              },
              {
                id: "actions",
                label: "Actions",
                items: [{ id: "logout", label: "Log Out", shortcut: "⇧⌘L" }],
              },
            ]}
          />
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
