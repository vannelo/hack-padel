import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import Nav from "@/components/Layout/Nav/Nav";

const inter = Inter({
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
      <body className={inter.className}>
        <main>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
