"use client";

import Link from "next/link";
import BlurFade from "@/components/ui/BlurFade";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import type { ProjectType } from "@/data/pricing";

const OFFERS: ProjectType[] = ["website", "application", "shopify", "custom"];

// Rangées d'offres (reprend le langage des rangées de /services, sans prix ni
// simulateur) : les intitulés viennent des clés services.offers.* existantes.
export default function OfferSection() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32">
      <BlurFade inView>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-4">
          {t("studio.offer.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.offer.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-12 md:mb-16 max-w-lg">
          {t("studio.offer.lede")}
        </p>
      </BlurFade>

      <div className="flex flex-col border-t border-ink/20">
        {OFFERS.map((offer, index) => (
          <BlurFade key={offer} inView delay={index * 0.08}>
            <Link
              href="/services"
              onClick={() => playClick()}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-10 py-6 md:py-10 border-b border-ink/20 hover:border-ink/40 hover:bg-ink/[0.01] transition-all duration-300"
            >
              <div className="flex items-center gap-4 md:gap-6 transition-transform duration-300 group-hover:translate-x-2">
                <span className="font-mono text-xs text-ink/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-[8vw] md:text-[3vw] leading-[0.95] text-ink group-hover:text-blue transition-colors duration-300">
                  {t(`services.offers.${offer}.title`)}
                </h3>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 pl-8 md:pl-0">
                <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-ink/50 md:text-right max-w-md">
                  {t(`services.offers.${offer}.description`)}
                </p>
                <span
                  aria-hidden="true"
                  className="font-mono text-blue opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                >
                  →
                </span>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>

      <BlurFade inView delay={0.2}>
        <div className="pt-10 md:pt-14">
          <Link
            href="/services"
            onClick={() => playClick()}
            className="inline-block bg-blue text-white px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold hover:bg-ink transition-colors duration-300"
          >
            {t("studio.offer.cta")}
          </Link>
        </div>
      </BlurFade>
    </section>
  );
}
