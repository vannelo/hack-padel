import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hack Padel",
  description: "Primera cancha de padel en Lindavista",
  viewport: "width=device-width, initial-scale=1",
  keywords:
    "padel, lindavista, deporte, cancha, raqueta, pala, pelota, torneos, mexico, cdmx, liga, club, escuela, clases, entrenamiento, alquiler, reservaciones, eventos, cumpleaños, fiestas, corporativos, empresas, amigos, familia, niños, adultos, principiantes, avanzados, profesionales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
