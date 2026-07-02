"use client";

import Link from "next/link";
import { ArrowUpRight, AppWindow, Globe, ShoppingBag, Sparkles } from "lucide-react";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import type { ProjectType } from "@/data/pricing";

// Bento grid de l'offre : les intitulés viennent des clés services.offers.*
// existantes (zéro doublon), chaque carte renvoie vers /services.
const OFFERS: {
  type: ProjectType;
  icon: typeof Globe;
  span: string;
}[] = [
  { type: "website", icon: Globe, span: "md:col-span-3" },
  { type: "application", icon: AppWindow, span: "md:col-span-2" },
  { type: "shopify", icon: ShoppingBag, span: "md:col-span-2" },
  { type: "custom", icon: Sparkles, span: "md:col-span-3" },
];

export default function OfferSection() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
      <Reveal>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue mb-4">
          {t("studio.offer.label")}
        </p>
        <h2 className="font-studio font-bold tracking-[-0.03em] text-3xl md:text-5xl text-ink">
          {t("studio.offer.heading")}
        </h2>
        <p className="font-studio text-base md:text-lg text-ink/55 mt-4 max-w-lg">
          {t("studio.offer.lede")}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-12">
        {OFFERS.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <Reveal key={offer.type} delay={index * 0.06} className={offer.span}>
              <Link
                href="/services"
                onClick={() => playClick()}
                className="group relative flex flex-col justify-between h-full min-h-[220px] rounded-2xl border border-ink/10 bg-white p-7 overflow-hidden transition-all duration-300 hover:border-blue/30 hover:shadow-[0_12px_48px_-16px_rgba(0,0,255,0.18)]"
              >
                {/* Numéro en filigrane */}
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -right-2 font-studio font-bold text-[7rem] leading-none text-ink/[0.03] select-none transition-colors duration-300 group-hover:text-blue/[0.05]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-ink/10 bg-bg text-ink/70 transition-colors duration-300 group-hover:text-blue group-hover:border-blue/25">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink/25 transition-all duration-300 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                <div className="relative mt-10">
                  <h3 className="font-studio font-semibold text-lg md:text-xl text-ink lowercase tracking-[-0.01em]">
                    {t(`services.offers.${offer.type}.title`).toLowerCase()}
                  </h3>
                  <p className="font-studio text-sm text-ink/55 leading-relaxed mt-2 max-w-sm">
                    {t(`services.offers.${offer.type}.description`)}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="flex justify-center mt-10">
          <Link
            href="/services"
            onClick={() => playClick()}
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white font-studio text-sm font-medium text-ink px-6 py-3 hover:border-blue/40 hover:text-blue transition-colors duration-300"
          >
            {t("studio.offer.cta")}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
