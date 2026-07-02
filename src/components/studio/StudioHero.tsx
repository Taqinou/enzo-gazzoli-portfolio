"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

// Hero typographique (langage tech moderne) : badge pill, titre sans-serif
// oversized avec accent serif italic bleu, grille technique + glow radial.
export default function StudioHero() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Grille technique en fond, estompée vers les bords */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />
      {/* Glow bleu radial subtil */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[70vh] bg-[radial-gradient(ellipse_at_center,rgba(0,0,255,0.10),transparent_65%)] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 backdrop-blur px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
            {t("studio.hero.eyebrow")}
          </span>
        </Reveal>

        <h1 className="font-studio font-bold tracking-[-0.04em] leading-[1.02] text-[11vw] md:text-[72px] text-ink mt-8">
          <Reveal delay={0.25}>
            <span className="block">{t("studio.hero.thesisLine1")}</span>
          </Reveal>
          <Reveal delay={0.4}>
            <span className="block font-serif italic font-normal text-blue tracking-[-0.02em]">
              {t("studio.hero.thesisLine2")}
            </span>
          </Reveal>
        </h1>

        <Reveal delay={0.55}>
          <p className="font-studio text-base md:text-lg text-ink/55 leading-relaxed max-w-xl mx-auto mt-7">
            {t("studio.hero.subline")}
          </p>
        </Reveal>

        <Reveal delay={0.7}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/services"
              onClick={() => playClick()}
              className="group inline-flex items-center gap-2 rounded-full bg-blue text-white font-studio text-sm font-semibold px-7 py-3.5 hover:bg-ink transition-colors duration-300 shadow-[0_8px_32px_-8px_rgba(0,0,255,0.4)]"
            >
              {t("studio.hero.ctaPrimary")}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/#work"
              onClick={() => playClick()}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 backdrop-blur text-ink font-studio text-sm font-medium px-7 py-3.5 hover:border-ink/40 transition-colors duration-300"
            >
              {t("studio.hero.ctaSecondary")}
              <ArrowDown
                size={16}
                className="text-ink/40 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
