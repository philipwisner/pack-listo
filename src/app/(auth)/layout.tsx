import { flex } from "@/styled-system/patterns";
import { css } from "@/styled-system/css";

export const metadata = {
  title: {
    default: "Pack Listo",
    template: "%s | Pack Listo",
  },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={flex({
        direction: "column",
        h: "100dvh",
        w: "100vw",
        overflow: "hidden",
        bg: "background",
      })}
    >
      <main
        className={css({
          flex: "1",
          overflowY: "auto",
          w: "100%",
        })}
      >
        {children}
      </main>
    </div>
  );
}
