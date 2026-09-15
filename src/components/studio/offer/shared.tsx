"use client";

import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects, type ProjectType } from "@/data/pricing";

export const OFFERS: ProjectType[] = ["website", "application", "shopify", "ai"];

export const num = (i: number) => String(i + 1).padStart(2, "0");

/** Libellés partagés par les variantes : titre, description, prix plancher, formules. */
export function useOfferCopy() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const title = (type: ProjectType) => t(`services.offers.${type}.title`).toLowerCase();
  const desc = (type: ProjectType) => t(`services.offers.${type}.description`);
  const formulas = (type: ProjectType) =>
    projects[type].formulas.map((f) => (locale === "en" ? f.nameEn : f.name));
  const price = (type: ProjectType) =>
    String(projects[type].fromPrice).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  const from = locale === "en" ? "from" : "à partir de";
  return { t, locale, title, desc, formulas, price, from };
}

/** Label + titre de section : arrive dans le blanc de sortie du hero. */
export function OfferHeading({ lede = false }: { lede?: boolean }) {
  const { t } = useTranslation();
  return (
    <Reveal>
      <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
        {t("studio.offer.label")}
      </p>
      <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw]">
        {t("studio.offer.heading")}
      </h2>
      {lede && (
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mt-4 max-w-lg">
          {t("studio.offer.lede")}
        </p>
      )}
    </Reveal>
  );
}

/** La pilule encre validée sur le hero. */
export function OfferCta({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { playClick } = useSound();
  return (
    <Link
      href="/services"
      onClick={() => playClick()}
      className={`group inline-flex items-center gap-2.5 rounded-full bg-ink text-white font-mn-sans text-[15px] font-medium px-8 py-4 shadow-[0_10px_30px_-10px_rgba(5,5,20,0.5)] hover:bg-blue transition-colors duration-300 ${className}`}
    >
      {t("studio.offer.cta")}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
