import { Header } from "@/components/Header/Header";
import { getCurrentUser } from "@/lib/auth";
import { flex } from "@/styled-system/patterns";
import { css } from "@/styled-system/css";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div
      className={flex({
        direction: "column",
        h: "100dvh",
        w: "100vw",
        overflow: "hidden",
      })}
    >
      <Header user={user} />
      <main
        className={css({
          flex: "1",
          overflowY: "auto",
          w: "100%",
          bg: "background",
        })}
      >
        {children}
      </main>
    </div>
  );
}
