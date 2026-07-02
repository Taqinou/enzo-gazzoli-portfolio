"use client";

import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials } from "@/data/testimonials";

const FACTS = ["01", "02", "03"] as const;

// Section preuve : témoignages honnêtes (les placeholders sont rendus comme
// « en cours de collecte », jamais comme de fausses citations) + faits réels.
export default function ProofSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32">
      <BlurFade inView>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-4">
          {t("studio.proof.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-12 md:mb-16">
          {t("studio.proof.heading")}
        </h2>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-14 md:mb-20">
        {testimonials.map((testimonial, index) => (
          <BlurFade key={testimonial.id} inView delay={index * 0.1}>
            {testimonial.status === "verified" ? (
              <figure className="border border-ink p-6 md:p-8 h-full flex flex-col gap-4">
                <blockquote className="font-serif italic text-xl md:text-2xl leading-snug">
                  « {t(testimonial.quoteKey)} »
                </blockquote>
                <figcaption className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/50 mt-auto">
                  — {t(testimonial.authorKey)}
                </figcaption>
              </figure>
            ) : (
              <div className="border border-dashed border-ink/30 p-6 md:p-8 h-full flex flex-col gap-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">
                  {t("studio.proof.pending")}
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/30 mt-auto">
                  — {t(testimonial.authorKey)}
                </p>
              </div>
            )}
          </BlurFade>
        ))}
      </div>

      <div className="flex flex-col border-t border-ink/20">
        {FACTS.map((fact, index) => (
          <BlurFade key={fact} inView delay={index * 0.06}>
            <div className="flex items-baseline gap-4 md:gap-6 py-4 md:py-5 border-b border-ink/20">
              <span className="font-mono text-xs text-ink/30">{fact}</span>
              <p className="font-serif lowercase text-lg md:text-2xl tracking-[-0.02em]">
                {t(`studio.proof.facts.${fact}`)}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
