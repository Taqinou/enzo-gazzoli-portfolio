"use client";

import Image from "next/image";
import BlurWords from "@/components/studio/BlurWords";
import DitherWave from "@/components/studio/DitherWave";
import HeroPill from "@/components/studio/HeroPill";
import Reveal from "@/components/studio/Reveal";
import { useTranslation } from "@/hooks/useTranslation";

// CTA final — rappel du hero : le ciel (sky-painting.jpg) bien visible,
// voile crème comme le hero (texte ink lisible), pilule verre du hero. En bas,
// la section passe au bleu plein par une bande de pixels tramés qui ondule
// (DitherWave) → raccord invisible avec le footer bleu (« enzo gazzoli. »).
// Centré → enchaîne vers le wordmark centré du footer.
export default function StudioCTA() {
  const { t } = useTranslation();

  // Mêmes réglages que le hero (défloutage mot à mot cadencé).
  const line1 = t("studio.cta.hookLine1");
  const line2 = t("studio.cta.hookLine2");
  const l1Words = line1.split(" ").length;
  const l2Base = 0.2 + l1Words * 0.07;

  return (
    <section className="relative text-ink px-6 md:px-20 pt-16 md:pt-24 pb-40 md:pb-56 text-center overflow-hidden">
      {/* ——— Le ciel (rappel du hero) ——— */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="studio-sky-drift absolute inset-0">
          <Image src="/images/studio/sky-painting.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        {/* voile crème haut : part du crème PLEIN (raccord invisible avec la
            section crème au-dessus) puis révèle le ciel. + radial de lisibilité */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(247,246,245) 0%, rgba(247,246,245,0.8) 7%, rgba(247,246,245,0.15) 22%, rgba(247,246,245,0) 36%)",
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_36%,rgba(247,246,245,0.5),transparent_70%)]"
        />
        {/* passage au bleu plein en bas → raccord footer : bande de pixels
            bleus tramés qui ondule comme de la lave (même tramage que les
            visuels des travaux) */}
        <DitherWave className="absolute inset-x-0 bottom-0 h-[20%] w-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-[0.92] text-[14vw] md:text-[8vw]">
          <span className="block not-italic">
            <BlurWords text={line1} baseDelay={0.2} />
          </span>
          <span className="block italic">
            <BlurWords text={line2} baseDelay={l2Base} />
          </span>
        </h2>

        <Reveal delay={0.28}>
          <p className="font-serif italic text-lg md:text-2xl text-ink/65 max-w-xl mt-8 md:mt-10 leading-snug">
            {t("studio.cta.subline")}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          {/* même pilule et même survol que le hero (remplissage, flou des lettres) */}
          <div className="mt-10 md:mt-12">
            <HeroPill href="/services" label={t("studio.cta.button")} variant="glass" arrow="right" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
