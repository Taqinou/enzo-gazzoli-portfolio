"use client";

import Reveal from "@/components/studio/Reveal";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = ["01", "02", "03", "04"] as const;

// Méthode en 4 étapes (langage tech moderne) : timeline horizontale sobre,
// numéros en badges, connecteurs fins.
export default function MethodSection() {
  const { t } = useTranslation();

  return (
    <section id="method" className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <Reveal>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue mb-4">
          {t("studio.method.label")}
        </p>
        <h2 className="font-studio font-bold tracking-[-0.03em] text-3xl md:text-5xl text-ink">
          {t("studio.method.heading")}
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 mt-12">
        {STEPS.map((step, index) => (
          <Reveal key={step} delay={index * 0.08}>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue/30 bg-blue/[0.06] font-mono text-[11px] font-bold text-blue shrink-0">
                  {step}
                </span>
                {/* Connecteur (sauf dernière étape) */}
                {index < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden md:block h-px grow bg-gradient-to-r from-ink/15 to-transparent"
                  />
                )}
              </div>
              <h3 className="font-studio font-semibold text-lg text-ink lowercase tracking-[-0.01em] mt-5">
                {t(`studio.method.steps.${step}.title`)}
              </h3>
              <p className="font-studio text-sm text-ink/55 leading-relaxed mt-2">
                {t(`studio.method.steps.${step}.description`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
