"use client";

import Link from "next/link";
import BlurFade from "@/components/ui/BlurFade";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

// Hero de la vitrine studio : thèse serif géante orientée valeur client,
// eyebrow mono, texte de fond façon BackgroundName, double CTA.
export default function StudioHero() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative min-h-screen w-full bg-bg text-ink overflow-hidden flex items-center">
      {/* Texte décoratif de fond (pattern BackgroundName) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-end justify-end pointer-events-none select-none z-0"
      >
        <span
          className="font-serif italic lowercase text-[38vw] leading-[0.7] tracking-[-0.07em] text-ink opacity-[0.035] translate-y-[12%] translate-x-[4%]"
          style={{ transform: "rotate(-2deg)" }}
        >
          {t("studio.hero.backdrop")}
        </span>
      </div>

      <div className="relative z-10 px-6 md:px-20 w-full">
        <BlurFade delay={0.1}>
          <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-8 md:mb-12">
            {t("studio.hero.eyebrow")}
          </p>
        </BlurFade>

        <h1 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[13vw] md:text-[8.5vw]">
          <BlurFade delay={0.25} blur={10} yOffset={20}>
            <span className="block">{t("studio.hero.thesisLine1")}</span>
          </BlurFade>
          <BlurFade delay={0.4} blur={10} yOffset={20}>
            <span className="block italic text-blue">
              {t("studio.hero.thesisLine2")}
            </span>
          </BlurFade>
        </h1>

        <BlurFade delay={0.6}>
          <p className="font-serif italic text-lg md:text-2xl text-ink/60 max-w-xl mt-8 md:mt-12 leading-snug">
            {t("studio.hero.subline")}
          </p>
        </BlurFade>

        <BlurFade delay={0.75}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 mt-10 md:mt-14">
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
              {t("studio.hero.ctaSecondary")}
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
