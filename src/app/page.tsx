import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "enzo gazzoli — studio.",
  description:
    "Independent web studio in Nancy, France. Design & development of websites, e-commerce and web applications — Next.js, React, immersive experiences.",
};

// Placeholder provisoire — remplacé par la vraie home studio (étape 3).
export default function StudioHome() {
  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center gap-12 px-6">
      <h1 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[clamp(3rem,12vw,9rem)]">
        studio.
      </h1>
      <nav className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <Link
          href="/archive"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue transition-colors duration-300"
        >
          Archive
        </Link>
        <Link
          href="/services"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue transition-colors duration-300"
        >
          Services
        </Link>
        <Link
          href="/cv"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue transition-colors duration-300"
        >
          CV
        </Link>
      </nav>
    </main>
  );
}
