import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Providers } from "@/components/core/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0000ff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://enzo-gazzoli.com"),
  title: "enzo gazzoli.",
  description: "Portfolio of Enzo Gazzoli, a creative fullstack developer and freelance designer based in Nancy, France. Specializing in Next.js, immersive web experiences, and digital design.",
  keywords: ["Creative Developer", "Freelance", "Web Design", "Nancy", "Next.js", "React", "3D Web", "Front-end Developer", "Portfolio", "Remote", "Fullstack"],
  authors: [{ name: "Enzo Gazzoli" }],
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
      { url: "/images/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo-eg-512x512.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
