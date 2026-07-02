"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/ui/BlurFade";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
}

// Carte d'étude de cas : panneau tourné + hard shadow bleue au hover
// (langage DESIGN_SYSTEM), cover typographique de fallback sans image.
const CaseStudyCard = memo(({ caseStudy, index }: CaseStudyCardProps) => {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const rotation = index % 2 === 0 ? "md:-rotate-1" : "md:rotate-1";

  return (
    <BlurFade inView delay={(index % 2) * 0.1}>
      <Link
        href={`/work/${caseStudy.slug}`}
        onClick={() => playClick()}
        className={`group block border border-ink bg-bg ${rotation} transition-all duration-300 ease-out-expo hover:rotate-0 hover:shadow-[20px_20px_0px_var(--blue)]`}
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-ink bg-blue">
          {caseStudy.imageUrl ? (
            <Image
              src={caseStudy.imageUrl}
              alt={t(`caseStudies.${caseStudy.slug}.title`)}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
            />
          ) : (
            // Cover typographique de fallback (sneakerscope)
            <div
              aria-label={t("studio.work.typoCoverAlt")}
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute font-mono font-bold text-white/10 text-[10rem] leading-none select-none"
              >
                {caseStudy.projectIndex}
              </span>
              <span className="relative font-serif italic lowercase text-white text-[3rem] md:text-[3.5rem] tracking-[-0.05em]">
                {t(`caseStudies.${caseStudy.slug}.title`)}.
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif lowercase text-2xl md:text-3xl tracking-[-0.05em] group-hover:text-blue transition-colors duration-300">
              {t(`caseStudies.${caseStudy.slug}.title`)}.
            </h3>
            <span className="font-mono text-[10px] font-bold text-ink/40">
              {caseStudy.year}
            </span>
          </div>
          <p className="font-serif italic text-base md:text-lg text-ink/60 leading-snug">
            {t(`caseStudies.${caseStudy.slug}.tagline`)}
          </p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
            {caseStudy.stack.join(" / ")}
          </p>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blue mt-2">
            {t("studio.work.viewCase")}{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </BlurFade>
  );
});

CaseStudyCard.displayName = "CaseStudyCard";

export default function CaseStudiesSection() {
  const { t } = useTranslation();

  return (
    <section
      id="work"
      className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 scroll-mt-20"
    >
      <BlurFade inView>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-4">
          {t("studio.work.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.work.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-12 md:mb-16 max-w-lg">
          {t("studio.work.lede")}
        </p>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {caseStudies.map((caseStudy, index) => (
          <CaseStudyCard
            key={caseStudy.slug}
            caseStudy={caseStudy}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
