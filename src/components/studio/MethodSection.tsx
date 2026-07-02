"use client";

import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = ["01", "02", "03", "04"] as const;

// Méthode en 4 étapes : gros chiffres serif de fond à faible opacité
// (langage des chiffres d'archive), label mono + description serif.
export default function MethodSection() {
  const { t } = useTranslation();

  return (
    <section
      id="method"
      className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 scroll-mt-20"
    >
      <BlurFade inView>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-4">
          {t("studio.method.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-12 md:mb-20">
          {t("studio.method.heading")}
        </h2>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 md:gap-y-20">
        {STEPS.map((step, index) => (
          <BlurFade key={step} inView delay={(index % 2) * 0.1}>
            <div className="relative min-h-[160px] md:min-h-[200px] flex flex-col justify-end border-t border-ink/20 pt-6">
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 font-serif text-[6rem] md:text-[9rem] leading-[0.8] text-ink opacity-[0.04] select-none pointer-events-none"
              >
                {step}
              </span>
              <span className="font-mono text-xs text-ink/30 mb-3">{step}</span>
              <h3 className="font-serif lowercase text-2xl md:text-4xl tracking-[-0.05em] mb-3">
                {t(`studio.method.steps.${step}.title`)}
              </h3>
              <p className="font-serif italic text-base md:text-lg text-ink/60 leading-snug max-w-md">
                {t(`studio.method.steps.${step}.description`)}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
