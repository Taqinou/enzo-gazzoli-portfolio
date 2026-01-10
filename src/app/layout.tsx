import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "enzo gazzoli.",
  description: "Portfolio of Enzo Gazzoli, a creative fullstack developer and freelance designer based in Nancy, France. Specializing in Next.js, immersive web experiences, and digital design.",
  keywords: ["Creative Developer", "Freelance", "Web Design", "Nancy", "Next.js", "React", "3D Web", "Front-end Developer", "Portfolio", "Remote", "Fullstack"],
  authors: [{ name: "Enzo Gazzoli" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0000ff",
  openGraph: {
    title: "Enzo Gazzoli | Creative Fullstack Developer - Nancy",
    description: "Immersive digital experiences and creative development.",
    url: "https://enzo-gazzoli.com",
    siteName: "Enzo Gazzoli Portfolio",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // We will need to generate this later
        width: 1200,
        height: 630,
        alt: "Enzo Gazzoli Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enzo Gazzoli | Creative Fullstack Developer",
    description: "Immersive digital experiences and creative development.",
    creator: "@enzogazzoli",
  },
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
