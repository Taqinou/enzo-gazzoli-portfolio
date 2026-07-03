"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = ["01", "02", "03", "04"] as const;

// Petit glyphe abstrait (trait bleu) propre à chaque étape : cadrage → design
// → développement → mise en ligne. Line art minimal, pas d'icône littérale.
function Glyph({ step, className }: { step: string; className?: string }) {
  const common = {
    fill: "none",
    stroke: "var(--blue)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {step === "01" && (
        <>
          {/* cadrage : cadre + point de mire */}
          <path {...common} d="M22 34V22h12M98 34V22H86M22 86v12h12M98 86v12H86" />
          <circle {...common} cx="60" cy="60" r="14" />
          <circle cx="60" cy="60" r="3" fill="var(--blue)" stroke="none" />
        </>
      )}
      {step === "02" && (
        <>
          {/* design : deux plans de travail décalés */}
          <rect {...common} x="26" y="34" width="52" height="40" rx="4" />
          <rect {...common} x="46" y="50" width="52" height="40" rx="4" />
        </>
      )}
      {step === "03" && (
        <>
          {/* développement : chevrons de code */}
          <path {...common} d="M44 42 26 60l18 18M76 42l18 18-18 18" />
          <path {...common} d="M66 38 54 82" />
        </>
      )}
      {step === "04" && (
        <>
          {/* mise en ligne : trajectoire ascendante + pulse */}
          <path {...common} d="M24 92 54 62l16 16 30-42" />
          <path {...common} d="M84 36h16v16" />
          <circle cx="54" cy="62" r="3" fill="var(--blue)" stroke="none" />
        </>
      )}
    </svg>
  );
}

// Méthode — éditorial « pinned split » : le scroll fait défiler 4 étapes dans
// un panneau sticky (conteneur h-[400vh] ⚠️ nécessite un ancêtre SANS overflow
// qui créerait un conteneur de scroll — la home est en overflow-x-clip pour ça).
// Gauche : chiffre Playfair géant + titre. Droite : glyphe abstrait + phrase
// qui s'encre mot à mot au scroll (suivi de lecture). Rail de progression.
export default function MethodSection() {
  const { t } = useTranslation();
  const { playScrollTick } = useSound();

  const sectionRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const lastActiveRef = useRef(0);

  // Boucle rAF : progression continue → (1) l'étape active, (2) la sous-
  // progression DANS l'étape, qui encre les mots de la description un à un
  // (gris → noir) façon « suivi de lecture au scroll ». Aucun setState par
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
          const p = Math.min(0.9999, Math.max(0, -rect.top / total));
          const stepF = p * STEPS.length;
          const step = Math.min(STEPS.length - 1, Math.floor(stepF));
          const sub = reduce ? 1 : Math.max(0, Math.min(1, stepF - step));
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
              w.style.color = `rgb(var(--ink-rgb) / ${(0.26 + 0.74 * wp).toFixed(3)})`;
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
        <section className="sticky top-0 h-screen bg-bg text-ink overflow-hidden flex flex-col">
          <div className="px-20 pt-28">{heading}</div>

          {/* split : chiffre géant + titre à gauche, glyphe + description à droite */}
          <div className="relative flex-1 grid grid-cols-[45%_55%] items-center border-t border-ink/[0.12] mt-10">
            <div className="relative h-full flex flex-col justify-center px-20 border-r border-ink/[0.12]">
              <div className="relative w-full h-[38vh]">
                {STEPS.map((step, i) => (
                  <span
                    key={step}
                    aria-hidden={i !== active}
                    className={`absolute left-0 bottom-0 font-serif leading-none text-[min(38vh,24vw)] tracking-[-0.05em] transition-all duration-[650ms] ease-out-expo ${
                      i === active
                        ? "opacity-100 translate-y-0 text-ink"
                        : i < active
                          ? "opacity-0 -translate-y-8"
                          : "opacity-0 translate-y-8"
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
                    className={`absolute inset-x-0 top-0 font-serif lowercase text-[min(2.75rem,3.4vw)] leading-[0.95] tracking-[-0.05em] transition-all duration-[650ms] ease-out-expo ${
                      i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {t(`studio.method.steps.${step}.title`)}
                  </h3>
                ))}
              </div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-20 py-10">
              <div className="relative h-40 w-40 mb-12">
                {STEPS.map((step, i) => (
                  <Glyph
                    key={step}
                    step={step}
                    className={`absolute inset-0 h-full w-full transition-all duration-[650ms] ease-out-expo ${
                      i === active ? "opacity-100 scale-100" : "opacity-0 scale-90"
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
                    <span key={j} data-w className="text-ink/25 transition-[color] duration-200 ease-linear">
                      {word}{" "}
                    </span>
                  ))}
              </p>
            </div>
          </div>

          {/* rail de progression bas */}
          <div className="flex items-center gap-2 px-20 pb-12">
            {STEPS.map((step, i) => (
              <span
                key={step}
                className={`h-px transition-all duration-[600ms] ease-out-expo ${
                  i === active ? "w-12 bg-blue" : "w-5 bg-ink/20"
                }`}
              />
            ))}
            <span className="font-mono text-[10px] font-bold text-ink/40 ml-2">
              {STEPS[active]} / {String(STEPS.length).padStart(2, "0")}
            </span>
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
                <Glyph step={step} className="h-9 w-9 shrink-0 mt-1" />
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
