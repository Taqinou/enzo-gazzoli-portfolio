"use client";

import { useState } from "react";
import Link from "next/link";
import BlurWords from "@/components/studio/BlurWords";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects, type ProjectType } from "@/data/pricing";

const OFFERS: ProjectType[] = ["website", "application", "shopify", "ai"];

// Index + volet détail : à gauche les 4 offres, à droite le volet qui se
// défloute vers l'offre survolée (description Playfair, formules ou éléments
// inclus tirés de pricing.ts, prix plancher). Numéro géant en filigrane, filet bleu qui glisse
// sous la ligne active. DA raffinée.
export default function OfferSection() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const { playClick, playMechanicalClack } = useSound();

  const [activeD, setActiveD] = useState(0);

  const num = (i: number) => String(i + 1).padStart(2, "0");
  const title = (type: ProjectType) => t(`services.offers.${type}.title`);
  const desc = (type: ProjectType) => t(`services.offers.${type}.description`);
  // Pastilles du volet : les formules de l'offre. Seule la 01 en propose
  // depuis la refonte de la grille — pour les trois autres la rangée reste
  // vide, le prix plancher passe seul à droite.
  const formulas = (type: ProjectType) =>
    projects[type].formulas.map((f) => (locale === "en" ? f.nameEn : f.name));
  const priceLabel = (type: ProjectType) => {
    const formatted = String(projects[type].fromPrice).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${locale === "en" ? "from" : "à partir de"} ${formatted} €`;
  };

  const activeType = OFFERS[activeD];

  return (
    <section id="offer" className="relative text-ink px-6 md:px-20 pt-4 md:pt-6 pb-20 md:pb-32 overflow-hidden scroll-mt-20">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          {t("studio.offer.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.offer.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-14 md:mb-20 max-w-lg">
          {t("studio.offer.lede")}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-10 md:gap-16 items-start">
        {/* index */}
        <div className="border-b border-ink/[0.12]">
          {OFFERS.map((type, i) => (
            <Link
              key={type}
              href="/services"
              onMouseEnter={() => {
                setActiveD(i);
                playMechanicalClack(200, 0.12);
              }}
              onFocus={() => setActiveD(i)}
              onClick={() => playClick()}
              className="group relative flex items-baseline gap-4 border-t border-ink/[0.12] py-4 md:py-5"
            >
              <span
                className={`font-mono text-[11px] font-bold tabular-nums transition-colors duration-300 ${
                  activeD === i ? "text-blue" : "text-ink/40"
                }`}
              >
                {num(i)}
              </span>
              <span
                className={`font-serif lowercase tracking-[-0.03em] text-[7vw] md:text-[2.3vw] leading-tight transition-all duration-300 ease-out-expo ${
                  activeD === i ? "text-ink italic md:translate-x-1.5" : "text-ink/40"
                }`}
              >
                {title(type)}
              </span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-px left-0 h-px bg-blue transition-all duration-500 ease-out-expo ${
                  activeD === i ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* volet détail */}
        <Link
          href="/services"
          onClick={() => playClick()}
          className="group block md:min-h-[20rem] md:sticky md:top-28"
        >
          {/* key={activeD} → remonte le bloc à chaque offre : la description se
              re-défloute mot à mot. min-h fige la hauteur (≈ colonne de gauche)
              pour que la section ne bouge plus au survol. */}
          <div key={activeD} className="relative">
            {/* numéro géant en filigrane (5 % via opacité d'élément) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-0 md:-top-12 font-mono font-black text-ink text-[8rem] md:text-[13rem] leading-none tracking-[-0.05em] select-none"
              style={{ opacity: 0.05 }}
            >
              {num(activeD)}
            </span>

            <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue mb-5">
              {num(activeD)} — {title(activeType)}
            </p>
            <p className="relative font-serif italic text-[7vw] md:text-[2.7vw] leading-[1.06] text-ink">
              <BlurWords text={desc(activeType)} step={0.03} />
            </p>

            <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {formulas(activeType).map((name) => (
                  <span
                    key={name}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/55 border border-ink/15 rounded-full px-3 py-1.5"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-ink/70">
                {priceLabel(activeType)}
                <span
                  aria-hidden="true"
                  className="font-serif text-xl text-blue transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </div>
          </div>
        </Link>
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14 md:mt-20">
          <Link
            href="/services"
            onClick={() => playClick()}
            className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-white font-mn-sans text-[15px] font-medium px-8 py-4 shadow-[0_10px_30px_-10px_rgba(5,5,20,0.5)] hover:bg-blue transition-colors duration-300"
          >
            {t("studio.offer.cta")}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
