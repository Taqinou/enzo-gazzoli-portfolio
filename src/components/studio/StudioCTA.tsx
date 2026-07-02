"use client";

import Link from "next/link";
import BlurFade from "@/components/ui/BlurFade";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL } from "@/data/constants";

// CTA final : section bleue pleine largeur (miroir de la section contact de
// /services), renvoie vers le formulaire existant /services#contact.
export default function StudioCTA() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <section className="relative bg-blue text-white px-6 md:px-20 py-24 md:py-40 overflow-hidden">
      {/* Texte décoratif de fond en text-stroke (langage overlays du site) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none"
      >
        <span className="font-serif italic lowercase text-[30vw] leading-[0.7] tracking-[-0.07em] text-stroke-white opacity-40 translate-x-[10%]">
          ?
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[14vw] md:text-[8vw]">
          <BlurFade inView blur={10} yOffset={20}>
            <span className="block">{t("studio.cta.hookLine1")}</span>
          </BlurFade>
          <BlurFade inView delay={0.15} blur={10} yOffset={20}>
            <span className="block italic">{t("studio.cta.hookLine2")}</span>
          </BlurFade>
        </h2>

        <BlurFade inView delay={0.3}>
          <p className="font-serif italic text-lg md:text-2xl text-white/70 max-w-xl mt-8 md:mt-10 leading-snug">
            {t("studio.cta.subline")}
          </p>
        </BlurFade>

        <BlurFade inView delay={0.45}>
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
        </BlurFade>
      </div>
    </section>
  );
}
