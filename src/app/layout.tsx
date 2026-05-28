import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {
  DarkModeToggle,
  ToggleContainer,
} from "@/components/DarkModeToggle/DarkModeToggle";
import { Providers } from "@/contexts/Providers";

export const metadata: Metadata = {
  title: "Pack Listo",
  description: "Make packing stress free",
  appleWebApp: {
    capable: true,
    title: "Pack Listo",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png", sizes: "32x32" },
      { url: "/icon1.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('darkModeConfig');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  let shouldBeDark = false;

                  if (stored === 'light') {
                    shouldBeDark = false;
                  } else if (stored === 'dark') {
                    shouldBeDark = true;
                  } else {
                    // auto or not set
                    shouldBeDark = prefersDark;
                  }

                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <ToggleContainer>
            <DarkModeToggle />
          </ToggleContainer>
          {children}
        </Providers>
      </body>
    </html>
  );
}
