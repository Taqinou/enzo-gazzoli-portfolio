import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Providers } from "@/components/core/Providers";
import { PERSONAL, SOCIAL_LINKS, SITE_CONFIG } from "@/data/constants";
import "./globals.css";

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSONAL.name,
  url: SITE_CONFIG.url,
  email: `mailto:${PERSONAL.email}`,
  jobTitle: "Creative Fullstack Developer",
  description: "Creative fullstack developer and freelance designer based in Nancy, France. Specializing in Next.js, immersive web experiences, and digital design.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nancy",
    addressCountry: "FR",
  },
  sameAs: [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.malt,
    SOCIAL_LINKS.fiverr,
  ],
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        url: "/images/og-image.jpg",
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
    icon: "/favicon.ico",
    apple: "/images/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
