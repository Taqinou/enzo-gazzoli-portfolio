"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
}

// Carte d'étude de cas (langage tech moderne) : surface propre, visuel
// produit, stack en pills, cover typographique de fallback sans image.
const CaseStudyCard = memo(({ caseStudy, index }: CaseStudyCardProps) => {
  const { t } = useTranslation();
  const { playClick } = useSound();

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <Link
        href={`/work/${caseStudy.slug}`}
        onClick={() => playClick()}
        className="group flex flex-col h-full rounded-2xl border border-ink/10 bg-white overflow-hidden transition-all duration-300 hover:border-blue/30 hover:shadow-[0_12px_48px_-16px_rgba(0,0,255,0.18)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-bg border-b border-ink/5">
          {caseStudy.imageUrl ? (
            <Image
              src={caseStudy.imageUrl}
              alt={t(`caseStudies.${caseStudy.slug}.title`)}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
            />
          ) : (
            // Cover typographique de fallback (sneakerscope)
            <div
              aria-label={t("studio.work.typoCoverAlt")}
              className="absolute inset-0 flex items-center justify-center bg-blue overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-8 -right-2 font-studio font-bold text-[9rem] leading-none text-white/10 select-none"
              >
                {caseStudy.projectIndex}
              </span>
              <span className="relative font-serif italic lowercase text-white text-4xl md:text-5xl tracking-[-0.03em]">
                {t(`caseStudies.${caseStudy.slug}.title`)}.
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-7 grow">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-studio font-semibold text-xl text-ink lowercase tracking-[-0.01em] group-hover:text-blue transition-colors duration-300">
              {t(`caseStudies.${caseStudy.slug}.title`)}
            </h3>
            <span className="font-mono text-[10px] font-bold text-ink/35 shrink-0">
              {caseStudy.year}
            </span>
          </div>
          <p className="font-studio text-sm text-ink/55 leading-relaxed">
            {t(`caseStudies.${caseStudy.slug}.tagline`)}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {caseStudy.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-ink/10 bg-bg px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink/50"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 font-studio text-[13px] font-semibold text-blue mt-2">
            {t("studio.work.viewCase")}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
});

CaseStudyCard.displayName = "CaseStudyCard";

export default function CaseStudiesSection() {
  const { t } = useTranslation();

  return (
    <section id="work" className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <Reveal>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue mb-4">
          {t("studio.work.label")}
        </p>
        <h2 className="font-studio font-bold tracking-[-0.03em] text-3xl md:text-5xl text-ink">
          {t("studio.work.heading")}
        </h2>
        <p className="font-studio text-base md:text-lg text-ink/55 mt-4 max-w-lg">
          {t("studio.work.lede")}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-12">
        {caseStudies.map((caseStudy, index) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} index={index} />
        ))}
      </div>
    </section>
  );
}
