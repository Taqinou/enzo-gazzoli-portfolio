import type { Metadata } from "next";
import SmoothScroll from "@/components/studio/SmoothScroll";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import OfferSection from "@/components/studio/OfferSection";
import WorkSection from "@/components/studio/work/WorkSection";
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
          <WorkSection />
          <MethodSection />
          <ProofSection />
          <StudioCTA />
        </main>

        <StudioFooter />

      </div>
    </SmoothScroll>
  );
}
