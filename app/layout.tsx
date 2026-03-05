import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "WikiScroll — Endless Knowledge",
  description: "Scroll endlessly through Wikipedia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${ibmMono.variable}`}>
      <body className="bg-[#080808] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
