"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import InView from "@/components/studio/offer/InView";
import { OFFERS, num, useOfferCopy, OfferHeading, OfferCta } from "@/components/studio/offer/shared";
import { useSound } from "@/hooks/useSound";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Variante C « la descente » : on vient de traverser les nuages, on continue
// de descendre. Les quatre offres sont quatre étages qu'on passe l'un après
// l'autre, en zigzag de part et d'autre d'un fil vertical. Le fil se trace au
// rythme du scroll (bleu jusqu'à la hauteur où on est, un point à la pointe)
// et chaque numéro s'allume quand le fil l'atteint. Les titres sortent de la
// brume, le prix est traité en Playfair, à la taille d'un titre secondaire.
// Rien n'est épinglé : scroll normal, un seul listener (comme le hero).
export default function OfferDescente() {
  const { title, desc, price, from } = useOfferCopy();
  const { playClick, playMechanicalClack } = useSound();
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const floorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState(0);
  const reachedRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      if (tipRef.current) tipRef.current.style.opacity = "0";
      setReached(OFFERS.length);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      // La pointe du fil suit une ligne fixe de l'écran (≈ 62 % de la hauteur).
      const eye = window.innerHeight * 0.62;
      const p = clamp01((eye - rect.top) / rect.height);
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
      if (tipRef.current) {
        tipRef.current.style.transform = `translate(-50%, -50%) translateY(${p * rect.height}px)`;
        tipRef.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
      }
      const y = eye;
      let count = 0;
      floorRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 <= y) count += 1;
      });
      if (count !== reachedRef.current) {
        if (count > reachedRef.current) playMechanicalClack(200, 0.1);
        reachedRef.current = count;
        setReached(count);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [playMechanicalClack]);

  return (
    <section id="offer" className="relative text-ink px-6 md:px-20 pt-4 md:pt-6 pb-20 md:pb-32 scroll-mt-20">
      <OfferHeading />

      <div ref={trackRef} className="relative mt-10 md:mt-6">
        {/* le fil : gris en fond, bleu qui se trace au scroll, point à la pointe */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[1.125rem] md:left-1/2 w-px bg-ink/[0.12]"
        />
        <span
          ref={lineRef}
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[1.125rem] md:left-1/2 w-px bg-blue origin-top will-change-transform"
          style={{ transform: "scaleY(0)" }}
        />
        <span
          ref={tipRef}
          aria-hidden="true"
          className="absolute top-0 left-[1.125rem] md:left-1/2 w-2 h-2 rounded-full bg-blue will-change-transform transition-opacity duration-300"
          style={{ transform: "translate(-50%, -50%)", opacity: 0 }}
        />

        {OFFERS.map((type, i) => {
          const left = i % 2 === 0;
          const lit = reached > i;
          return (
            <div
              key={type}
              ref={(el) => {
                floorRefs.current[i] = el;
              }}
              className="relative grid grid-cols-[2.25rem_1fr] md:grid-cols-[1fr_5rem_1fr] items-center py-14 md:py-0 md:min-h-[52svh]"
            >
              {/* numéro posé sur le fil */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-[1.125rem] md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full bg-bg border font-mono text-[10px] font-bold tabular-nums transition-all duration-500 ${
                    lit ? "border-blue text-blue" : "border-ink/20 text-ink/40"
                  }`}
                >
                  {num(i)}
                </span>
              </span>

              <Link
                href="/services"
                onClick={() => playClick()}
                className={`group col-start-2 ${
                  left ? "md:col-start-1 md:text-right md:pr-6" : "md:col-start-3 md:text-left md:pl-6"
                } pl-4 md:pl-0`}
              >
                <InView className="studio-mist">
                  <h3
                    className={`font-serif tracking-[-0.045em] leading-[0.92] text-[10vw] md:text-[6vw] transition-colors duration-500 ${
                      lit ? "text-ink" : "text-ink/60"
                    } group-hover:italic`}
                  >
                    {title(type)}
                  </h3>
                </InView>
                <InView className="studio-mist" delay={0.2}>
                  <p className="font-serif italic mt-3 md:mt-4 text-[6vw] md:text-[2.1vw] leading-none text-ink/70">
                    <span className="text-ink/45">{from}</span> {price(type)}
                  </p>
                </InView>
                <InView className="studio-reveal" delay={0.35}>
                  <p
                    className={`mt-5 md:mt-6 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.12em] leading-[1.6] text-ink/50 max-w-md ${
                      left ? "md:ml-auto" : ""
                    }`}
                  >
                    {desc(type)}
                  </p>
                </InView>
              </Link>
            </div>
          );
        })}

        {/* le fil s'arrête sur le bouton */}
        <div className="relative grid grid-cols-[2.25rem_1fr] md:grid-cols-[1fr_5rem_1fr] pt-6 md:pt-10">
          <div className="col-start-2 md:col-span-3 md:justify-self-center pl-4 md:pl-0">
            <InView className="studio-mist inline-block bg-bg py-2 px-2 -mx-2">
              <OfferCta />
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}
