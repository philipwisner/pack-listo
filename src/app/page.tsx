import Image from "next/image";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

export default function Home() {
  return (
    <div
      className={flex({
        direction: "column",
        flex: 1,
        align: "center",
        justify: "center",
        bg: { base: "zinc.50", _dark: "black" },
        fontFamily: "sans",
      })}
    >
      <main
        className={flex({
          flex: 1,
          width: "full",
          maxWidth: "3xl",
          direction: "column",
          align: { base: "center", sm: "flex-start" },
          justify: "space-between",
          py: "32",
          px: "16",
          bg: { base: "white", _dark: "black" },
        })}
      >
        <Image
          className={css({ _dark: { filter: "invert(1)" } })}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div
          className={flex({
            direction: "column",
            align: { base: "center", sm: "flex-start" },
            gap: "6",
            textAlign: { base: "center", sm: "left" },
          })}
        >
          <h1
            className={css({
              maxWidth: "xs",
              fontSize: "3xl",
              fontWeight: "semibold",
              lineHeight: "10",
              letterSpacing: "tight",
              color: { base: "black", _dark: "zinc.50" },
            })}
          >
            To get started, edit the page.tsx file.
          </h1>
          <p
            className={css({
              maxWidth: "md",
              fontSize: "lg",
              lineHeight: "8",
              color: { base: "zinc.600", _dark: "zinc.400" },
            })}
          >
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com..."
              className={css({
                fontWeight: "medium",
                color: { base: "zinc.950", _dark: "zinc.50" },
              })}
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn..."
              className={css({
                fontWeight: "medium",
                color: { base: "zinc.950", _dark: "zinc.50" },
              })}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        <div
          className={flex({
            direction: { base: "column", sm: "row" },
            gap: "4",
            fontSize: "base",
            fontWeight: "medium",
          })}
        >
          <a
            className={flex({
              height: "12",
              width: { base: "full", md: "158px" },
              align: "center",
              justify: "center",
              gap: "2",
              rounded: "full",
              bg: "black", // Assuming foreground is black
              px: "5",
              color: "white", // Assuming background is white
              transition: "colors",
              _hover: {
                bg: { base: "#383838", _dark: "#ccc" },
              },
            })}
            href="https://vercel.com/new..."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={css({ _dark: { filter: "invert(1)" } })}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={flex({
              height: "12",
              width: { base: "full", md: "158px" },
              align: "center",
              justify: "center",
              rounded: "full",
              border: "1px solid",
              borderColor: { base: "black/8", _dark: "white/14.5" },
              px: "5",
              transition: "colors",
              _hover: {
                borderColor: "transparent",
                bg: { base: "black/4", _dark: "#1a1a1a" },
              },
            })}
            href="https://nextjs.org/docs..."
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
