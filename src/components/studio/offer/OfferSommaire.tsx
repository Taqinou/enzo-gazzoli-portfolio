"use client";

import { useState } from "react";
import Link from "next/link";
import BlurWords from "@/components/studio/BlurWords";
import InView from "@/components/studio/offer/InView";
import { OFFERS, num, useOfferCopy, OfferHeading, OfferCta } from "@/components/studio/offer/shared";
import { useSound } from "@/hooks/useSound";

// Variante A « le sommaire » : plus de colonne index + volet. Les quatre
// offres deviennent quatre lignes pleine largeur, comme le sommaire d'une
// revue : numéro, titre Playfair géant, prix plancher à droite. Chaque ligne
// sort de la brume à son tour (prolongement de la sortie du hero) et son
// filet se trace de gauche à droite. Au survol, un tiroir s'ouvre sous la
// ligne avec la description qui se défloute mot à mot ; une seule ligne
// ouverte, la première par défaut. Le clic mène à /services.
export default function OfferSommaire() {
  const { title, desc, formulas, price, from } = useOfferCopy();
  const { playClick, playMechanicalClack } = useSound();
  const [active, setActive] = useState(0);

  return (
    <section id="offer" className="relative text-ink px-6 md:px-20 pt-4 md:pt-6 pb-20 md:pb-32 scroll-mt-20">
      <OfferHeading />

      <div className="mt-14 md:mt-24">
        {OFFERS.map((type, i) => {
          const open = active === i;
          return (
            <div key={type} className="relative">
              {/* filet supérieur qui se trace */}
              <InView className="studio-rule absolute top-0 left-0 right-0 h-px bg-ink/[0.14]" delay={i * 0.12} />

              <Link
                href="/services"
                onMouseEnter={() => {
                  if (active !== i) playMechanicalClack(200, 0.12);
                  setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={() => playClick()}
                className="group block"
              >
                <InView className="studio-mist" delay={0.15 + i * 0.14}>
                  <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_1fr_auto] items-baseline gap-x-4 md:gap-x-8 pt-7 md:pt-9 pb-6 md:pb-8">
                    <span
                      className={`font-mono text-[11px] font-bold tabular-nums transition-colors duration-500 ${
                        open ? "text-blue" : "text-ink/35"
                      }`}
                    >
                      {num(i)}
                    </span>
                    <h3
                      className={`font-serif tracking-[-0.04em] leading-[0.95] text-[8.5vw] md:text-[4.6vw] transition-all duration-500 ease-out-expo ${
                        open ? "italic text-ink md:translate-x-2" : "not-italic text-ink/45 group-hover:text-ink/70"
                      }`}
                    >
                      {title(type)}
                    </h3>
                    <p
                      className={`col-start-2 md:col-start-3 mt-2 md:mt-0 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-500 ${
                        open ? "text-ink" : "text-ink/40"
                      }`}
                    >
                      {from} {price(type)}
                    </p>
                  </div>
                </InView>

                {/* tiroir */}
                <div className={`offer-drawer ${open ? "open" : ""}`}>
                  <div>
                    <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_1fr_auto] gap-x-4 md:gap-x-8 pb-9 md:pb-12">
                      <span aria-hidden="true" />
                      <p className="font-serif italic text-[5.2vw] md:text-[1.75vw] leading-[1.15] text-ink/80 max-w-3xl">
                        {open && <BlurWords key={type} text={desc(type)} step={0.025} />}
                      </p>
                      {formulas(type).length > 0 && (
                        <p className="col-start-2 md:col-start-3 mt-4 md:mt-0 md:self-end font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45 whitespace-nowrap">
                          {formulas(type).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* filet bleu qui glisse sous la ligne ouverte */}
              <span
                aria-hidden="true"
                className={`absolute -bottom-px left-0 h-px bg-blue transition-all duration-700 ease-out-expo ${
                  open ? "w-full" : "w-0"
                }`}
              />
            </div>
          );
        })}
        <InView className="studio-rule h-px bg-ink/[0.14]" delay={0.5} />
      </div>

      <InView className="studio-mist mt-14 md:mt-20" delay={0.3}>
        <OfferCta />
      </InView>
    </section>
  );
}
