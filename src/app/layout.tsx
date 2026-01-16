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
  description:
    "Freelance creative web fullstack developer based in Nancy, France. Specializing in Next.js, immersive web experiences, and digital design.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nancy",
    addressCountry: "FR",
  },
  sameAs: [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.instagram,
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
  description:
    "Portfolio of Enzo Gazzoli, a freelance creative fullstack web developer based in Nancy, France. Specializing in Next.js, immersive web experiences, and digital design.",
  keywords: [
    // EN - General
    "Creative Developer",
    "Freelance Developer",
    "Web Developer",
    "Frontend Developer",
    "Fullstack Developer",
    "Remote Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Web Designer",
    "UI/UX Designer",
    "Creative Coding",
    "Digital Experience",
    "Enzo Gazzoli",
    // EN - Services: Website
    "Landing Page",
    "Creative Portfolio",
    "Business Website",
    "Corporate Website",
    "One Page Website",
    "Custom Website",
    // EN - Services: Application
    "MVP Development",
    "SaaS Development",
    "Full SaaS",
    "Business Dashboard",
    "Web Application",
    "Custom Application",
    // EN - Services: E-commerce
    "Headless Shopify",
    "Shopify Development",
    "E-commerce Website",
    "Online Store",
    // EN - Services: Custom
    "Technical Audit",
    "Code Audit",
    "Dev Day",
    "Freelance Consulting",
    // EN - Features/Options
    "Authentication Integration",
    "Stripe Payment Integration",
    "CMS Integration",
    "Strapi",
    "Sanity",
    "Multilingual Website",
    "Advanced Forms",
    "Transactional Emails",
    "Technical SEO",
    "Analytics Integration",
    "Newsletter Integration",
    "Advanced Animations",
    "Framer Motion",
    "Web Animation",
    "Motion Design",
    "Dark Mode",
    "Website Maintenance",
    "3D Web",
    "Interactive Web",
    "Tailwind CSS",
    // FR - Général
    "Développeur Web",
    "Développeur Freelance",
    "Développeur Créatif",
    "Développeur Frontend",
    "Développeur Fullstack",
    "Développeur Indépendant",
    "Développeur React",
    "Développeur Next.js",
    "Développeur TypeScript",
    "Designer Web",
    "Intégrateur Web",
    "Freelance Nancy",
    "Freelance France",
    "Freelance Lorraine",
    "Agence Web Nancy",
    "Expérience Digitale",
    // FR - Services: Site Web
    "Landing Page",
    "Page de Destination",
    "Portfolio Créatif",
    "Site Vitrine",
    "Site Internet",
    "Site Web sur Mesure",
    "Création de Site Web",
    "Conception Web",
    // FR - Services: Application
    "Développement MVP",
    "Développement SaaS",
    "SaaS Complet",
    "Dashboard Métier",
    "Tableau de Bord",
    "Application Web",
    "Application sur Mesure",
    // FR - Services: E-commerce
    "Boutique Headless",
    "Développement Shopify",
    "Site E-commerce",
    "Boutique en Ligne",
    // FR - Services: Sur Mesure
    "Audit Technique",
    "Audit de Code",
    "Journée Dev",
    "Consulting Freelance",
    // FR - Fonctionnalités/Options
    "Authentification",
    "Paiement Stripe",
    "Intégration CMS",
    "Site Multilingue",
    "Formulaire Avancé",
    "Emails Transactionnels",
    "SEO Technique",
    "Référencement Naturel",
    "Intégration Analytics",
    "Intégration Newsletter",
    "Animations Avancées",
    "Animation Web",
    "Design Interactif",
    "Mode Sombre",
    "Maintenance Site Web",
  ],
  authors: [{ name: "Enzo Gazzoli" }],
  verification: {
    google: "eyH37y7r0gpLfmh1ubKdrjJD8l__DLmMx-mVYHcx44U",
  },
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
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
