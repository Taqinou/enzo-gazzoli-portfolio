import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ENZO GAZZOLI - PORTFOLIO",
  description: "Enzo Gazzoli - Developpeur Creative",
  icons: {
    icon: [
      { url: "/images/logo-eg-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/images/logo-eg-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/logo-eg-1024x1024.svg", sizes: "1024x1024", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} antialiased`}>{children}</body>
    </html>
  );
}
