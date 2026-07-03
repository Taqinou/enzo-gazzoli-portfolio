"use client";

import Image from "next/image";
import Link from "next/link";
import BlurWords from "@/components/studio/BlurWords";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

// CTA final — rappel du hero : ciel photographique (sky.jpg) bien visible,
// voile crème comme le hero (texte ink lisible), bouton verre translucide.
// En bas, la section fond vers le bleu plein → raccord invisible avec le
// footer bleu (où s'inscrit « enzo gazzoli. »). Centré → enchaîne vers le
// wordmark centré du footer.
export default function StudioCTA() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  // Mêmes réglages que le hero (défloutage mot à mot cadencé).
  const line1 = t("studio.cta.hookLine1");
  const line2 = t("studio.cta.hookLine2");
  const l1Words = line1.split(" ").length;
  const l2Base = 0.2 + l1Words * 0.07;

  return (
    <section className="relative text-ink px-6 md:px-20 pt-28 md:pt-40 pb-40 md:pb-56 text-center overflow-hidden">
      {/* ——— Le ciel (rappel du hero) ——— */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="studio-sky-drift absolute inset-0">
          <Image src="/images/studio/sky.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        {/* voile crème haut : part du crème PLEIN (raccord invisible avec la
            section crème au-dessus) puis révèle le ciel. + radial de lisibilité */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(249,249,249) 0%, rgba(249,249,249,0.8) 7%, rgba(249,249,249,0.15) 22%, rgba(249,249,249,0) 36%)",
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_36%,rgba(249,249,249,0.5),transparent_70%)]"
        />
        {/* fondu vers le bleu plein en bas → raccord footer */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,255,0) 60%, rgba(0,0,255,0.5) 82%, rgb(0,0,255) 100%)",
          }}
        />
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
          <Link
            href="/services"
            onClick={() => playClick()}
            className="group inline-flex items-center gap-2.5 mt-10 md:mt-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/60 text-ink px-8 py-4 font-mn-sans text-[15px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_-14px_rgba(5,5,20,0.3)] hover:bg-white/60 transition-colors duration-300"
          >
            {t("studio.cta.button")}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
