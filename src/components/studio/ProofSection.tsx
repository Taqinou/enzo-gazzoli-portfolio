"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials } from "@/data/testimonials";

// Confiance — bloc « mono-citation » : UN seul témoignage, plein cadre, traité
// comme une citation éditoriale (guillemet bleu géant, Playfair). Règle
// d'honnêteté : on ne rend QUE les témoignages "verified" — tant qu'il n'y en a
// aucun de vrai, la section n'existe pas (return null). S'il y en a plusieurs,
// petite navigation (flèches + points). Aucun faux témoignage, jamais.
export default function ProofSection() {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const [index, setIndex] = useState(0);

  const verified = testimonials.filter((x) => x.status === "verified");
  if (verified.length === 0) return null;

  const i = index % verified.length;
  const active = verified[i];
  const go = (d: number) => {
    playClick();
    setIndex((prev) => (prev + d + verified.length) % verified.length);
  };

  return (
    <section id="proof" className="relative bg-bg text-ink px-6 md:px-20 py-28 md:py-44 overflow-hidden scroll-mt-20">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-10 md:mb-14">
          {t("studio.proof.label")}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <figure className="relative max-w-5xl">
          {/* guillemet ouvrant, graphique bleu */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[0.35em] -left-2 md:-left-4 font-serif text-blue leading-none select-none text-[22vw] md:text-[13vw]"
            style={{ opacity: 0.14 }}
          >
            “
          </span>

          <blockquote
            key={active.id}
            className="relative font-serif italic lowercase tracking-[-0.02em] leading-[1.12] text-[7vw] md:text-[3.6vw]"
            style={{ animation: "studio-soft-in 0.5s ease both" }}
          >
            {t(active.quoteKey)}
          </blockquote>

          <figcaption className="mt-10 md:mt-14 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 md:w-14 bg-blue" />
            {active.projectSlug ? (
              <Link
                href={`/work/${active.projectSlug}`}
                onClick={() => playClick()}
                className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60 hover:text-blue transition-colors duration-300"
              >
                {t(active.authorKey)}
              </Link>
            ) : (
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">
                {t(active.authorKey)}
              </span>
            )}
          </figcaption>

          {/* navigation (seulement si plusieurs témoignages vérifiés) */}
          {verified.length > 1 && (
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-2" aria-hidden="true">
                {verified.map((v, k) => (
                  <span
                    key={v.id}
                    className={`h-px transition-all duration-500 ease-out-expo ${
                      k === i ? "w-8 bg-blue" : "w-3 bg-ink/25"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => go(-1)}
                  aria-label={t("studio.proof.prevLabel")}
                  className="font-mono text-lg text-ink/40 hover:text-blue transition-colors duration-300"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label={t("studio.proof.nextLabel")}
                  className="font-mono text-lg text-ink/40 hover:text-blue transition-colors duration-300"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </figure>
      </Reveal>
    </section>
  );
}
