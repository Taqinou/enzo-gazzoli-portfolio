"use client";

import { useEffect, useRef, useState } from "react";
import Scramble from "@/components/studio/Scramble";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = ["01", "02", "03", "04"] as const;

// Scroll choreography : le conteneur fait 4 écrans de haut, le panneau reste
// sticky et les étapes se succèdent selon la progression du scroll (chiffre
// serif géant qui permute + tick sonore). Listener passif, state minimal.
export default function MethodSection() {
  const { t } = useTranslation();
  const { playScrollTick } = useSound();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lastActiveRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(0.999, Math.max(0, -rect.top / total));
      const step = Math.floor(progress * STEPS.length);
      if (step !== lastActiveRef.current) {
        lastActiveRef.current = step;
        setActive(step);
        playScrollTick();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [playScrollTick]);

  return (
    <div id="method" ref={sectionRef} className="relative h-[400vh] scroll-mt-0">
      <section className="sticky top-0 h-screen bg-bg text-ink px-6 md:px-20 flex flex-col justify-center overflow-hidden">
        {/* Chiffre géant de fond, permute avec l'étape */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-end pr-[4vw] pointer-events-none select-none">
          {STEPS.map((step, i) => (
            <span
              key={step}
              className={`absolute font-serif text-[45vh] leading-none text-ink transition-all duration-[600ms] ease-out-expo ${
                i === active
                  ? "opacity-[0.05] translate-y-0"
                  : i < active
                    ? "opacity-0 -translate-y-[8vh]"
                    : "opacity-0 translate-y-[8vh]"
              }`}
            >
              {step}
            </span>
          ))}
        </div>

        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          <Scramble text={t("studio.method.label")} />
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-10 md:mb-16">
          {t("studio.method.heading")}
        </h2>

        {/* Étapes superposées, l'active seule est visible */}
        <div className="relative min-h-[200px] md:min-h-[180px] max-w-2xl">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`absolute inset-x-0 top-0 transition-all duration-[600ms] ease-out-expo ${
                i === active
                  ? "opacity-100 translate-y-0"
                  : i < active
                    ? "opacity-0 -translate-y-6 pointer-events-none"
                    : "opacity-0 translate-y-6 pointer-events-none"
              }`}
              aria-hidden={i !== active}
            >
              <div className="flex items-baseline gap-4 md:gap-6 border-t border-ink pt-5">
                <span className="font-mono text-xs font-bold text-blue">{step}</span>
                <div>
                  <h3 className="font-serif lowercase text-3xl md:text-5xl tracking-[-0.05em]">
                    {t(`studio.method.steps.${step}.title`)}
                  </h3>
                  <p className="font-serif italic text-base md:text-xl text-ink/60 leading-snug mt-3 max-w-md">
                    {t(`studio.method.steps.${step}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progression */}
        <div className="flex items-center gap-2 mt-10 md:mt-14" aria-hidden="true">
          {STEPS.map((step, i) => (
            <span
              key={step}
              className={`h-px transition-all duration-[600ms] ease-out-expo ${
                i === active ? "w-10 bg-blue" : "w-4 bg-ink/20"
              }`}
            />
          ))}
          <span className="font-mono text-[10px] font-bold text-ink/40 ml-2">
            {STEPS[active]} / {String(STEPS.length).padStart(2, "0")}
          </span>
        </div>
      </section>
    </div>
  );
}
