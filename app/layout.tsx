import type { Metadata } from "next";
import "@/app/globals.css";
import { Montserrat } from "next/font/google";
import Providers from "@/providers/Providers";
import { NotificationProvider } from "@/providers/NotificationContext";
import ThemeProviders from "@/providers/ThemeProviders";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html lang="en">
      <body className={montserrat.className}>
        <ThemeProviders>
          <Providers>
            <NotificationProvider>{children}</NotificationProvider>
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  );
}
