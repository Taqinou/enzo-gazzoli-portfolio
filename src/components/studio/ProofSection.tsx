"use client";

import Reveal from "@/components/studio/Reveal";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials } from "@/data/testimonials";

const FACTS = ["01", "02", "03"] as const;

// Section preuve : faits réels en tiles + témoignages honnêtes (les
// placeholders sont rendus « en cours de collecte », jamais de fausse citation).
export default function ProofSection() {
  const { t } = useTranslation();

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
      <Reveal>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue mb-4">
          {t("studio.proof.label")}
        </p>
        <h2 className="font-studio font-bold tracking-[-0.03em] text-3xl md:text-5xl text-ink">
          {t("studio.proof.heading")}
        </h2>
      </Reveal>

      {/* Faits réels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {FACTS.map((fact, index) => (
          <Reveal key={fact} delay={index * 0.06}>
            <div className="h-full rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-blue">{fact}</span>
              <p className="font-studio font-medium text-[15px] text-ink/80 leading-snug mt-3 lowercase">
                {t(`studio.proof.facts.${fact}`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Témoignages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={0.1 + index * 0.06}>
            {testimonial.status === "verified" ? (
              <figure className="h-full rounded-2xl border border-ink/10 bg-white p-7 flex flex-col gap-4">
                <blockquote className="font-serif italic text-lg md:text-xl text-ink/85 leading-snug">
                  « {t(testimonial.quoteKey)} »
                </blockquote>
                <figcaption className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45 mt-auto">
                  — {t(testimonial.authorKey)}
                </figcaption>
              </figure>
            ) : (
              <div className="h-full rounded-2xl border border-dashed border-ink/20 bg-transparent p-7 flex flex-col gap-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                  {t("studio.proof.pending")}
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/30 mt-auto">
                  — {t(testimonial.authorKey)}
                </p>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
