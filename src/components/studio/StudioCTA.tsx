"use client";

import { useRef } from "react";
import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL } from "@/data/constants";

// CTA final : bleu plein écran (le langage des overlays du site), « ? »
// géant en text-stroke qui suit doucement le curseur (parallax léger via
// ref DOM, zéro re-render), bouton à inversion brutale.
export default function StudioCTA() {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const markRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = markRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
  };

  return (
    <section
      className="relative bg-blue text-white px-6 md:px-20 py-24 md:py-40 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* « ? » géant en text-stroke, parallax curseur */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none"
      >
        <span
          ref={markRef}
          className="font-serif italic text-[55vh] leading-[0.7] text-stroke-white opacity-50 translate-x-[6%] transition-transform duration-500 ease-out-expo will-change-transform"
        >
          ?
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-[0.95] text-[14vw] md:text-[8vw]">
          <Reveal variant="mask">
            <span>{t("studio.cta.hookLine1")}</span>
          </Reveal>
          <Reveal variant="mask" delay={0.15}>
            <span className="italic">{t("studio.cta.hookLine2")}</span>
          </Reveal>
        </h2>

        <Reveal delay={0.3}>
          <p className="font-serif italic text-lg md:text-2xl text-white/70 max-w-xl mt-8 md:mt-10 leading-snug">
            {t("studio.cta.subline")}
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 mt-10 md:mt-14">
            <Link
              href="/services#contact"
              onClick={() => playClick()}
              className="bg-white text-blue px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold hover:bg-transparent hover:text-white border border-white transition-colors duration-300"
            >
              {t("studio.cta.button")}
            </Link>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              {t("studio.cta.or")}{" "}
              <a
                href={`mailto:${PERSONAL.email}`}
                onClick={() => playClick()}
                className="font-serif italic lowercase normal-case text-base md:text-lg tracking-normal text-white underline decoration-1 underline-offset-4 hover:text-white/70 transition-colors duration-300"
              >
                {PERSONAL.email}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
