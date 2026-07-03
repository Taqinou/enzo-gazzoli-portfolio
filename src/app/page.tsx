import type { Metadata } from "next";
import SmoothScroll from "@/components/studio/SmoothScroll";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import OfferSection from "@/components/studio/OfferSection";
import CaseStudiesSection from "@/components/studio/CaseStudiesSection";
import MethodSection from "@/components/studio/MethodSection";
import ProofSection from "@/components/studio/ProofSection";
import StudioCTA from "@/components/studio/StudioCTA";
import StudioFooter from "@/components/studio/StudioFooter";

export const metadata: Metadata = {
  title: "enzo gazzoli — studio.",
  description:
    "Independent web studio in Nancy, France. Design & development of showcase websites, e-commerce and web applications — Next.js, React, tailored experiences that stand out.",
  openGraph: {
    title: "enzo gazzoli — studio.",
    description:
      "Independent web studio — websites, e-commerce and web applications, from strategy to deployment.",
    url: "https://enzo-gazzoli.com",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

// Vitrine studio : scroll fluide cinématographique (Lenis), page à scroll
// normal (le scroll-snap reste la signature de l'aile /archive).
export default function StudioHome() {
  return (
    <SmoothScroll>
      {/* overflow-x-clip (pas -hidden) : clippe l'horizontal SANS créer de
          conteneur de scroll → position:sticky des sections fonctionne */}
      <div className="min-h-screen bg-bg text-ink overflow-x-clip">
        <StudioNav />

        <main>
          <StudioHero />
          <OfferSection />
          <CaseStudiesSection />
          <MethodSection />
          <ProofSection />
          <StudioCTA />
        </main>

        <StudioFooter />

        {/* Texture grain globale (pattern /services) */}
        <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScroll>
  );
}
