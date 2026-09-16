"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import MethodFigure from "@/components/studio/MethodFigure";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = ["01", "02", "03", "04"] as const;
// Part de l'écran sur laquelle la section confiance chevauche la fin de la
// méthode (lg:-mt-[18vh] dans ProofSection) : moins de blanc entre les deux.
const EXIT_OVERLAP = 0.18;

export default function MethodSection() {
  const { t } = useTranslation();
  const { playScrollTick } = useSound();

  const sectionRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const lastActiveRef = useRef(0);

  // Boucle rAF : progression continue → (1) l'étape active, (2) la sous-
  // progression DANS l'étape, qui défloute les mots de la description un à un
  // façon « suivi de lecture au scroll ». Aucun setState par
  // frame hors changement d'étape ; les couleurs sont posées en direct sur le
  // DOM. Respecte prefers-reduced-motion (texte encré d'emblée).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number;
    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        if (total > 0) {
          const rect = el.getBoundingClientRect();
          const vhPx = window.innerHeight;
          // la lecture s'achève un peu avant la fin de l'épinglage : la section
          // confiance remonte par-dessus les derniers EXIT_OVERLAP de scroll
          const p = Math.min(0.9999, Math.max(0, -rect.top / (total - vhPx * EXIT_OVERLAP)));
          // sortie : une fois décrochée, la scène se dissout dans le flou en
          // remontant (la section confiance sort du même flou)
          const stage = stageRef.current;
          if (stage && !reduce) {
            const vh = window.innerHeight;
            const exit = Math.max(0, Math.min(1, (vh * (1 + EXIT_OVERLAP) - rect.bottom) / (vh * 0.5)));
            stage.style.filter = exit > 0 ? `blur(${(exit * 12).toFixed(2)}px)` : "";
            stage.style.opacity = exit > 0 ? (1 - exit * 0.85).toFixed(3) : "";
          }
          const stepF = p * STEPS.length;
          const step = Math.min(STEPS.length - 1, Math.floor(stepF));
          const sub = reduce ? 1 : Math.max(0, Math.min(1, stepF - step));
          // la figure de l'étape se construit au même rythme que la lecture ;
          // les étapes passées restent complètes (1) et les suivantes vides
          // (0) : pendant le fondu, la figure qui s'efface ne se réinitialise pas
          const figures = figureRef.current?.children;
          if (figures) {
            for (let k = 0; k < figures.length; k++) {
              const value = k < step ? 1 : k > step ? 0 : sub;
              (figures[k] as SVGElement).style.setProperty("--p", value.toFixed(3));
            }
          }
          if (step !== lastActiveRef.current) {
            lastActiveRef.current = step;
            setActive(step);
            playScrollTick();
          }
          const words = descRef.current?.querySelectorAll<HTMLElement>("[data-w]");
          if (words && words.length) {
            const head = sub * (words.length + 3); // tête de lecture
            words.forEach((w, j) => {
              const wp = Math.max(0, Math.min(1, head - j));
              // flou → net au passage de la tête de lecture (plus d'opacité réduite)
              w.style.filter = wp >= 1 ? "none" : `blur(${((1 - wp) * 7).toFixed(2)}px)`;
            });
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [playScrollTick]);

  const heading = (
    <>
      <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-3">
        {t("studio.method.label")}
      </p>
      <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[4vw]">
        {t("studio.method.heading")}
      </h2>
    </>
  );

  return (
    <div id="method" className="scroll-mt-20">
      {/* ——— DESKTOP (lg+) : scroll-jack « pinned split ». À lg (≥1024) et non
          md, car en tablette portrait la colonne est trop étroite pour le
          chiffre en vh → la liste mobile prend le relais jusqu'à 1024px. ——— */}
      <div ref={sectionRef} className="hidden lg:block relative h-[400vh]">
        <section ref={stageRef} className="sticky top-0 h-screen bg-bg text-ink overflow-hidden flex flex-col">
          <div className="px-20 pt-28">{heading}</div>

          {/* split : chiffre géant + titre à gauche, glyphe + description à droite */}
          <div className="relative flex-1 grid grid-cols-[45%_55%] items-center border-t border-ink/[0.12] mt-10">
            <div className="relative h-full flex flex-col justify-center px-20 border-r border-ink/[0.12]">
              <div className="relative w-full h-[38vh]">
                {STEPS.map((step, i) => (
                  <span
                    key={step}
                    aria-hidden={i !== active}
                    className={`method-swap absolute left-0 bottom-0 font-serif leading-none text-[min(38vh,24vw)] tracking-[-0.05em] ${
                      i === active ? "is-on text-ink" : i < active ? "is-past" : "is-next"
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
              <div className="relative w-full h-24 mt-4">
                {STEPS.map((step, i) => (
                  <h3
                    key={step}
                    aria-hidden={i !== active}
                    className={`method-swap method-swap-late absolute inset-x-0 top-0 font-serif lowercase text-[min(2.75rem,3.4vw)] leading-[0.95] tracking-[-0.05em] ${
                      i === active ? "is-on" : i < active ? "is-past" : "is-next"
                    }`}
                  >
                    {t(`studio.method.steps.${step}.title`)}
                  </h3>
                ))}
              </div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-20 py-10">
              {/* les figures partagent le même plateau et chacune démarre où la
                  précédente s'arrête : un simple fondu court, sans échelle, suffit
                  à les enchaîner sans que le passage se voie */}
              <div ref={figureRef} className="relative h-56 w-56 mb-8 -ml-4">
                {STEPS.map((step, i) => (
                  <MethodFigure
                    key={step}
                    step={step}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-300 ease-out ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              {/* seule l'étape active est montée (key) → fondu doux + encrage */}
              <p
                key={active}
                ref={descRef}
                className="max-w-xl font-serif text-[min(2.6rem,3.2vw)] leading-[1.3] tracking-[-0.02em]"
                style={{ animation: "studio-soft-in 0.45s ease both" }}
              >
                {t(`studio.method.steps.${STEPS[active]}.description`)
                  .split(" ")
                  .map((word, j) => (
                    <Fragment key={j}>
                      <span data-w className="inline-block blur-[7px] transition-[filter] duration-200 ease-linear">
                        {word}
                      </span>{" "}
                    </Fragment>
                  ))}
              </p>
            </div>
          </div>

        </section>
      </div>

      {/* ——— MOBILE + TABLETTE (<lg) : liste verticale sobre ——— */}
      <div className="lg:hidden bg-bg text-ink px-6 md:px-20 py-20">
        <div className="mb-12">{heading}</div>
        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <div key={step} className="border-t border-ink/[0.12] py-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-3">
                {step}
              </p>
              <div className="flex items-start gap-4">
                <MethodFigure step={step} className="h-20 w-20 shrink-0 -mt-2" />
                <div>
                  <h3 className="font-serif lowercase text-4xl leading-[1.05] tracking-[-0.05em]">
                    {t(`studio.method.steps.${step}.title`)}
                  </h3>
                  <p className="font-serif text-xl text-ink/70 leading-snug mt-3">
                    {t(`studio.method.steps.${step}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
