"use client";

import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import type { ProjectType } from "@/data/pricing";

// Anti-grid assumé : rangées décalées (le « scattered chaos » de l'archive),
// numéros mono géants, hover = rotation + hard shadow bleue + clack.
const OFFERS: { type: ProjectType; offset: string; tilt: string }[] = [
  { type: "website", offset: "md:ml-0", tilt: "hover:-rotate-1" },
  { type: "application", offset: "md:ml-[10vw]", tilt: "hover:rotate-1" },
  { type: "shopify", offset: "md:ml-[3vw]", tilt: "hover:-rotate-1" },
  { type: "custom", offset: "md:ml-[14vw]", tilt: "hover:rotate-1" },
];

export default function OfferSection() {
  const { t } = useTranslation();
  const { playClick, playMechanicalClack } = useSound();

  return (
    <section className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 overflow-hidden">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          <Scramble text={t("studio.offer.label")} />
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.offer.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-14 md:mb-20 max-w-lg">
          {t("studio.offer.lede")}
        </p>
      </Reveal>

      <div className="flex flex-col gap-6 md:gap-10">
        {OFFERS.map((offer, index) => (
          <Reveal key={offer.type} delay={(index % 2) * 0.08}>
            <Link
              href="/services"
              onClick={() => playClick()}
              onMouseEnter={() => playMechanicalClack(200, 0.15)}
              className={`group relative flex flex-col md:flex-row md:items-center gap-3 md:gap-10 border border-ink bg-bg px-6 py-7 md:px-10 md:py-9 md:max-w-[70vw] ${offer.offset} ${offer.tilt} transition-all duration-300 ease-out-expo hover:shadow-[16px_16px_0px_var(--blue)] hover:bg-white`}
            >
              <span
                aria-hidden="true"
                className="absolute -top-6 right-4 md:-top-10 md:right-8 font-mono font-black text-[4rem] md:text-[7rem] leading-none text-ink/[0.06] tracking-[-0.05em] select-none pointer-events-none transition-colors duration-300 group-hover:text-blue/10"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="relative font-serif text-[8vw] md:text-[3vw] leading-[0.95] text-ink group-hover:text-blue transition-colors duration-300 shrink-0 group-hover:italic">
                {t(`services.offers.${offer.type}.title`)}
              </h3>

              <div className="relative flex items-center justify-between gap-6 md:ml-auto">
                <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-ink/50 md:text-right max-w-md">
                  {t(`services.offers.${offer.type}.description`)}
                </p>
                <span
                  aria-hidden="true"
                  className="font-mono text-blue text-xl opacity-0 -translate-x-2 transition-all duration-300 ease-out-expo group-hover:opacity-100 group-hover:translate-x-0"
                >
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14 md:mt-20">
          <Link
            href="/services"
            onClick={() => playClick()}
            className="inline-block bg-blue text-white px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold hover:bg-ink transition-colors duration-300"
          >
            {t("studio.offer.cta")}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
