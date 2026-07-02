"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL } from "@/data/constants";

// CTA final en grande carte bleue (pattern « CTA card » des sites tech) :
// glow interne, titre oversized avec accent serif italic, bouton pill blanc.
export default function StudioCTA() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
      <Reveal>
        <div className="relative rounded-3xl bg-blue text-white overflow-hidden px-7 py-16 md:px-16 md:py-24 text-center">
          {/* Glow + grille fine internes */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)]"
          />

          <div className="relative">
            <h2 className="font-studio font-bold tracking-[-0.03em] leading-[1.05] text-4xl md:text-6xl">
              {t("studio.cta.hookLine1")}{" "}
              <span className="font-serif italic font-normal">
                {t("studio.cta.hookLine2")}
              </span>
            </h2>
            <p className="font-studio text-base md:text-lg text-white/70 max-w-md mx-auto mt-5">
              {t("studio.cta.subline")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-9">
              <Link
                href="/services#contact"
                onClick={() => playClick()}
                className="group inline-flex items-center gap-2 rounded-full bg-white text-blue font-studio text-sm font-semibold px-7 py-3.5 hover:bg-ink hover:text-white transition-colors duration-300"
              >
                {t("studio.cta.button")}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                {t("studio.cta.or")}{" "}
                <a
                  href={`mailto:${PERSONAL.email}`}
                  onClick={() => playClick()}
                  className="font-studio font-medium normal-case text-[13px] tracking-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white transition-colors duration-300"
                >
                  {PERSONAL.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
