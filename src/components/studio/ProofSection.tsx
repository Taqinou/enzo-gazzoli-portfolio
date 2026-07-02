"use client";

import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials } from "@/data/testimonials";

const FACTS = ["01", "02", "03"] as const;

// Preuve : témoignages en « tampons » légèrement tournés (les rotations
// signature du site), placeholders honnêtes en bordure dashed, faits réels
// en rangées mono.
export default function ProofSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 overflow-hidden">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          <Scramble text={t("studio.proof.label")} />
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-12 md:mb-16">
          {t("studio.proof.heading")}
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 mb-16 md:mb-24">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 0.1}>
            {testimonial.status === "verified" ? (
              <figure
                className={`border border-ink bg-white p-7 md:p-9 flex flex-col gap-4 ${index % 2 === 0 ? "md:-rotate-2" : "md:rotate-1 md:mt-10"} shadow-[12px_12px_0px_var(--blue)] transition-transform duration-300 ease-out-expo hover:rotate-0`}
              >
                <blockquote className="font-serif italic text-xl md:text-2xl leading-snug">
                  « {t(testimonial.quoteKey)} »
                </blockquote>
                <figcaption className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/50 mt-auto">
                  — {t(testimonial.authorKey)}
                </figcaption>
              </figure>
            ) : (
              <div
                className={`border border-dashed border-ink/30 p-7 md:p-9 flex flex-col gap-4 ${index % 2 === 0 ? "md:-rotate-2" : "md:rotate-1 md:mt-10"}`}
              >
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">
                  {t("studio.proof.pending")}
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/30 mt-auto">
                  — {t(testimonial.authorKey)}
                </p>
              </div>
            )}
          </Reveal>
        ))}
      </div>

      <div className="flex flex-col border-t border-ink/20">
        {FACTS.map((fact, index) => (
          <Reveal key={fact} delay={index * 0.06}>
            <div className="group flex items-baseline gap-4 md:gap-6 py-4 md:py-5 border-b border-ink/20 transition-all duration-300 hover:pl-3">
              <span className="font-mono text-xs text-blue">{fact}</span>
              <p className="font-serif lowercase text-lg md:text-2xl tracking-[-0.02em]">
                {t(`studio.proof.facts.${fact}`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
