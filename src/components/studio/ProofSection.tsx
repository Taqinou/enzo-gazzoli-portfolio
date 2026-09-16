"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { testimonials } from "@/data/testimonials";

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// Confiance — bloc « mono-citation » : UN seul témoignage, plein cadre, traité
// comme une citation éditoriale (guillemet bleu géant, Playfair). Règle
// d'honnêteté : on ne rend QUE les témoignages "verified" ; s'il n'y en a
// aucun, la section n'existe pas. S'il y en a plusieurs, petite navigation.
//
// Arrivée liée au scroll, dans le langage de la méthode : le label sort du flou
// où la méthode vient de se dissoudre, puis la citation se lit, ses mots
// passant du flou au net un à un ; une fois lue, le filet bleu se trace et la
// signature apparaît. Événement scroll natif (Lenis), styles posés en direct.
export default function ProofSection() {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const [index, setIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  const verified = testimonials.filter((x) => x.status === "verified");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      const vh = window.innerHeight;
      const enter = reduce ? 1 : clamp01((vh - section.getBoundingClientRect().top) / (vh * 0.5));
      const label = labelRef.current;
      if (label) {
        label.style.opacity = enter.toFixed(3);
        label.style.filter = enter >= 1 ? "none" : `blur(${((1 - enter) * 10).toFixed(2)}px)`;
      }

      const quote = quoteRef.current;
      let read = 1;
      if (quote && !reduce) {
        const r = quote.getBoundingClientRect();
        // lecture : du haut de la citation à 85 % de l'écran jusqu'à son
        // milieu vers 45 %
        read = clamp01((vh * 0.85 - r.top) / (vh * 0.4 + r.height * 0.5));
      }
      const words = quote?.querySelectorAll<HTMLElement>("[data-w]");
      if (words && words.length) {
        const head = read * (words.length + 2);
        words.forEach((w, j) => {
          const wp = clamp01(head - j);
          w.style.filter = wp >= 1 ? "none" : `blur(${((1 - wp) * 8).toFixed(2)}px)`;
          w.style.opacity = (0.15 + wp * 0.85).toFixed(3);
        });
      }

      const sign = clamp01((read - 0.92) / 0.08);
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${sign.toFixed(3)})`;
      if (authorRef.current) {
        authorRef.current.style.opacity = sign.toFixed(3);
        authorRef.current.style.filter = sign >= 1 ? "none" : `blur(${((1 - sign) * 6).toFixed(2)}px)`;
      }
    };

    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [index]);

  if (verified.length === 0) return null;

  const i = index % verified.length;
  const active = verified[i];
  const go = (d: number) => {
    playClick();
    setIndex((prev) => (prev + d + verified.length) % verified.length);
  };

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="relative bg-bg lg:bg-transparent text-ink px-6 md:px-20 pt-12 md:pt-16 lg:-mt-[18vh] pb-10 md:pb-16 overflow-hidden scroll-mt-20"
    >
      <p
        ref={labelRef}
        className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-10 md:mb-14"
      >
        {t("studio.proof.label")}
      </p>

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
          ref={quoteRef}
          className="relative font-serif italic lowercase tracking-[-0.02em] leading-[1.12] text-[7vw] md:text-[3.6vw]"
        >
          <span className="sr-only">{t(active.quoteKey)}</span>
          <span aria-hidden="true">
            {t(active.quoteKey)
              .split(" ")
              .map((word, j) => (
                <Fragment key={j}>
                  <span data-w className="inline-block">
                    {word}
                  </span>{" "}
                </Fragment>
              ))}
          </span>
        </blockquote>

        <figcaption className="mt-10 md:mt-14 flex items-center gap-4">
          <span ref={lineRef} aria-hidden="true" className="h-px w-10 md:w-14 bg-blue origin-left" />
          <div ref={authorRef}>
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
          </div>
        </figcaption>

        {/* navigation (seulement si plusieurs témoignages vérifiés) */}
        {verified.length > 1 && (
          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2" aria-hidden="true">
              {verified.map((v, k) => (
                <span
                  key={v.id}
                  className={`h-px transition-all duration-500 ease-out-expo ${k === i ? "w-8 bg-blue" : "w-3 bg-ink/25"}`}
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
    </section>
  );
}
