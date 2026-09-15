"use client";

import { useState } from "react";
import Link from "next/link";
import InView from "@/components/studio/offer/InView";
import { OFFERS, num, useOfferCopy, OfferHeading, OfferCta } from "@/components/studio/offer/shared";
import { useSound } from "@/hooks/useSound";

// Variante B « le viseur » : un seul écran. Les quatre offres occupent les
// quatre quadrants d'un cadre, séparés par une croix — celle du crosshair de
// la DA. Au survol d'un quadrant, la croix glisse vers lui : la cellule
// regardée s'agrandit, les trois autres s'effacent, la description apparaît
// dedans. C'est une mise au point, comme l'ouverture du hero. Aucun fond,
// aucun arrondi : des filets seulement. À l'arrivée, la croix se dessine
// depuis son centre et les titres sortent de la brume.
export default function OfferViseur() {
  const { title, desc, price, from } = useOfferCopy();
  const { playClick, playMechanicalClack } = useSound();
  // Sans survol : aucun point, les quatre cases au repos, nettes.
  const [focus, setFocus] = useState<number | null>(null);

  return (
    <section id="offer" className="relative text-ink px-6 md:px-20 pt-4 md:pt-6 pb-20 md:pb-32 scroll-mt-20">
      <OfferHeading />

      <div
        className="offer-viewfinder relative mt-12 md:mt-16 grid md:h-[78svh] md:min-h-[36rem]"
        data-focus={focus ?? ""}
        onMouseLeave={() => setFocus(null)}
      >
        {/* cadre : filets haut et bas */}
        <InView className="studio-rule absolute top-0 left-0 right-0 h-px bg-ink/[0.14]" />
        <InView className="studio-rule absolute bottom-0 left-0 right-0 h-px bg-ink/[0.14]" delay={0.1} />

        {/* la croix : deux lignes qui suivent --cx / --cy et se dessinent du centre */}
        <InView className="offer-viewfinder-lines pointer-events-none absolute inset-0 hidden md:block">
          <span
            aria-hidden="true"
            className="offer-viewfinder-center absolute top-0 bottom-0 w-px bg-ink/[0.14]"
            style={{ top: 0, transform: "scaleY(var(--draw))" }}
          />
          <span
            aria-hidden="true"
            className="offer-viewfinder-center absolute left-0 right-0 h-px bg-ink/[0.14]"
            style={{ left: 0, transform: "scaleX(var(--draw))" }}
          />
        </InView>

        {OFFERS.map((type, i) => {
          const on = focus === i;
          const dim = focus !== null && !on;
          return (
            <Link
              key={type}
              href="/services"
              onMouseEnter={() => {
                if (focus !== i) playMechanicalClack(200, 0.12);
                setFocus(i);
              }}
              onFocus={() => setFocus(i)}
              onClick={() => playClick()}
              className={`relative flex flex-col p-5 md:p-7 min-h-[40svh] md:min-h-0 overflow-hidden border-b border-ink/[0.14] md:border-0 ${
                i === 3 ? "border-b-0" : ""
              }`}
            >
              {/* la brume revient là où on regarde */}
              <span
                aria-hidden="true"
                className={`offer-viewfinder-haze pointer-events-none absolute inset-0 ${on ? "on" : ""}`}
              />
              <InView className="studio-mist relative flex flex-col h-full" delay={0.35 + i * 0.12}>
                <div
                  className={`flex flex-col h-full transition-[filter,opacity] duration-[900ms] ease-out-expo ${
                    dim ? "md:blur-[3px] md:opacity-70" : "blur-0 opacity-100"
                  }`}
                >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-mono text-[11px] font-bold tabular-nums transition-colors duration-500 ${
                      on ? "text-blue" : dim ? "text-ink/25" : "text-ink/40"
                    }`}
                  >
                    {num(i)}
                  </span>
                  <span
                    className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] transition-colors duration-500 ${
                      on ? "text-ink" : dim ? "text-ink/25" : "text-ink/45"
                    }`}
                  >
                    {from} {price(type)}
                  </span>
                </div>

                <div className="mt-auto pt-8">
                  {/* La taille suit la mise au point par transform (pas de
                      font-size) et la boîte du titre a une largeur fixe en vw :
                      les retours à la ligne ne bougent jamais pendant que les
                      cases se redimensionnent, donc aucun reflow. */}
                  <h3
                    className={`font-serif tracking-[-0.04em] leading-[0.95] text-[9vw] md:text-[4.6vw] md:w-[40vw] origin-bottom-left will-change-transform transition-[transform,color] duration-[900ms] ease-out-expo ${
                      on
                        ? "italic text-ink md:scale-[1.15]"
                        : dim
                          ? "text-ink/55 md:scale-[0.6]"
                          : "text-ink md:scale-100"
                    }`}
                  >
                    {title(type)}
                  </h3>
                  <p
                    className={`font-serif italic mt-4 md:mt-5 text-[4.4vw] md:text-[1.25vw] leading-[1.25] text-ink/70 max-w-xl transition-all duration-700 ease-out-expo ${
                      on ? "md:opacity-100 md:blur-0 md:delay-200" : "md:opacity-0 md:blur-sm md:delay-0"
                    }`}
                  >
                    {desc(type)}
                  </p>
                </div>
                </div>
              </InView>
            </Link>
          );
        })}
      </div>

      <InView className="studio-mist mt-14 md:mt-20" delay={0.3}>
        <OfferCta />
      </InView>
    </section>
  );
}
