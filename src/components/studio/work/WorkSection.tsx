"use client";

import Link from "next/link";
import InView from "@/components/studio/offer/InView";
import { WorkHeading, WorkShot, useCaseStudyLinks } from "@/components/studio/work/shared";
import { caseStudies } from "@/data/caseStudies";

// Places dans le mur (md+) : une grande planche, puis des formats différents.
const SPANS = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

// Section travaux « le mur » (retenue le 16 sept. 2026) : les captures des
// sites composent la section en formats différents, imprimées en pixels bleus
// sur crème pour parler la palette du site. Le survol d'un projet ne touche
// ni son image ni les autres projets (Enzo). Au survol : le nom passe en
// italique et une vague de flou le traverse lettre par lettre (même geste que
// les pilules du hero), un filet bleu se trace sous la légende. Ni année, ni
// flèche, ni curseur spécial (retirés à sa demande).
export default function WorkSection() {
  const { title, open, playMechanicalClack } = useCaseStudyLinks();

  return (
    <section id="work" className="relative text-ink px-6 md:px-20 py-20 md:py-32 scroll-mt-20">
      <WorkHeading />

      <div
        className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[21vw] gap-4 md:gap-5"
      >
        {caseStudies.map((cs, i) => {
          return (
            <InView key={cs.slug} className={`studio-mist ${SPANS[i] ?? "md:col-span-4"}`} delay={0.08 * i}>
              <Link
                href={`/work/${cs.slug}`}
                onClick={(e) => open(e, cs)}
                onMouseEnter={() => playMechanicalClack(200, 0.12)}
                className="group flex h-full flex-col"
              >
                <WorkShot
                  cs={cs}
                  className="relative aspect-[2400/1463] md:aspect-auto md:flex-1"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
                <div className="relative pt-3 pb-2">
                  <h3 className="font-serif lowercase tracking-[-0.03em] text-2xl md:text-[1.6vw] leading-none group-hover:italic">
                    <span className="sr-only">{title(cs)}</span>
                    {/* chaque lettre, pour la vague de flou des pilules du hero */}
                    <span aria-hidden="true">
                      {Array.from(title(cs)).map((char, k) => (
                        <span key={k} className="work-title-char" style={{ "--i": k } as React.CSSProperties}>
                          {char === " " ? "\u00a0" : char}
                        </span>
                      ))}
                    </span>
                  </h3>
                  {/* un filet bleu se trace sous la légende, de gauche à droite */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-px bg-blue origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                </div>
              </Link>
            </InView>
          );
        })}
      </div>
    </section>
  );
}
