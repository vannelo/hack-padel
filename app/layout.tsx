import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { NotificationProvider } from "@/providers/NotificationContext";
import Providers from "@/providers/Providers";
import ThemeProviders from "@/providers/ThemeProviders";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hack Padel",
  description: "Primera cancha de padel en Lindavista",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProviders>
          <Providers>
            <NotificationProvider>{children}</NotificationProvider>
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  );
}
