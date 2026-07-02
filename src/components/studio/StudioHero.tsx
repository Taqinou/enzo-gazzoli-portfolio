"use client";

import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

const MARQUEE_KEYS = [
  "services.offers.website.title",
  "services.offers.application.title",
  "services.offers.shopify.title",
  "services.offers.custom.title",
] as const;

// Hero studio : thèse Playfair géante révélée par masque ligne à ligne,
// blueprint grid fine en fond, filigrane, marquee mono des services.
export default function StudioHero() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const marqueeItems = MARQUEE_KEYS.map((key) => t(key));

  return (
    <section className="relative min-h-screen w-full bg-bg text-ink overflow-hidden flex flex-col">
      {/* Blueprint grid (la « Vercel aesthetic », en noir sur off-white) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_65%_at_45%_40%,black,transparent)]"
      />

      {/* Filigrane serif italic (pattern BackgroundName) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-end justify-end pointer-events-none select-none z-0"
      >
        <span
          className="font-serif italic lowercase text-[34vw] leading-[0.7] tracking-[-0.07em] text-ink opacity-[0.03] translate-y-[10%] translate-x-[3%]"
          style={{ transform: "rotate(-2deg)" }}
        >
          {t("studio.hero.backdrop")}
        </span>
      </div>

      <div className="relative z-10 grow flex flex-col justify-center px-6 md:px-20 pt-28 md:pt-24">
        <Reveal delay={0.1}>
          <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-8 md:mb-12">
            <Scramble text={t("studio.hero.eyebrow")} />
          </p>
        </Reveal>

        <h1 className="font-serif lowercase tracking-[-0.05em] leading-[0.95] text-[12.5vw] md:text-[8vw]">
          <Reveal variant="mask" delay={0.25}>
            <span>{t("studio.hero.thesisLine1")}</span>
          </Reveal>
          <Reveal variant="mask" delay={0.4}>
            <span className="italic text-blue">
              {t("studio.hero.thesisLine2")}
            </span>
          </Reveal>
        </h1>

        <Reveal delay={0.6}>
          <p className="font-serif italic text-lg md:text-2xl text-ink/60 max-w-xl mt-8 md:mt-10 leading-snug">
            {t("studio.hero.subline")}
          </p>
        </Reveal>

        <Reveal delay={0.75}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 mt-10 md:mt-12">
            <Link
              href="/services"
              onClick={() => playClick()}
              className="bg-blue text-white px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold hover:bg-ink transition-colors duration-300"
            >
              {t("studio.hero.ctaPrimary")}
            </Link>
            <Link
              href="/#work"
              onClick={() => playClick()}
              className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60 hover:text-blue transition-colors duration-300 underline decoration-1 underline-offset-8"
            >
              {t("studio.hero.ctaSecondary")} ↓
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Marquee mono des services, bordée façon ruban */}
      <Reveal delay={0.9} className="relative z-10">
        <div className="studio-marquee border-t border-ink/15 py-4 md:py-5" aria-hidden="true">
          <div className="studio-marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-baseline">
                {marqueeItems.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="inline-flex items-baseline font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-ink/60"
                  >
                    <span className="px-6 md:px-10">{item}</span>
                    <span className="text-blue">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
