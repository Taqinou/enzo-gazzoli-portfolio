import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "archive — enzo gazzoli.",
  description:
    "The archive & lab of Enzo Gazzoli — immersive web experiments, creative development and selected works. Scroll-snap experience, sound design and brutalist aesthetics.",
  openGraph: {
    title: "archive — enzo gazzoli.",
    description:
      "Immersive web experiments, creative development and selected works.",
    url: "https://enzo-gazzoli.com/archive",
    type: "website",
  },
  alternates: {
    canonical: "/archive",
  },
};

export default function ArchiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
