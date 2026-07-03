"use client";

import Image from "next/image";
import Link from "next/link";
import BlurWords from "@/components/studio/BlurWords";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

// Hero atmosphérique (pattern Codex/Cursor) : ciel photographique plein
// écran en dérive lente, élément central minimal. Titre monochrome Playfair
// (ligne 1 romaine, ligne 2 italique) où seul le dernier mot passe en bleu —
// le bleu comme accent rare. La matière vient de la photo (sky.jpg).
export default function StudioHero() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const line1 = t("studio.hero.thesisLine1");
  const line2 = t("studio.hero.thesisLine2");
  const l1Words = line1.split(" ").length;
  const l2Words = line2.split(" ").length;
  const l2Base = 0.2 + l1Words * 0.07;
  const ctaDelay = 0.5 + (l1Words + l2Words) * 0.07;

  return (
    <section id="top" className="relative min-h-screen w-full bg-bg text-ink flex flex-col overflow-hidden">
      {/* ——— Le ciel ——— */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="studio-sky-drift absolute inset-0">
          <Image
            src="/images/studio/sky.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Intégration : fondu crème en haut (nav) et longue transition en
            bas jusqu'au crème opaque (aucune ligne de coupure) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(249,249,249,0.55)_0%,rgba(249,249,249,0)_22%,rgba(249,249,249,0)_52%,rgba(249,249,249,0.45)_72%,rgba(249,249,249,0.85)_86%,rgb(249,249,249)_97%)]"
        />
        {/* Voile radial doux derrière l'élément central (lisibilité) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_46%_38%_at_50%_46%,rgba(249,249,249,0.45),transparent_70%)]"
        />
      </div>

      {/* ——— L'élément central ——— */}
      <div className="relative z-10 grow flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-3xl pt-16 pb-[6vh]">
          <h1 className="leading-[1.06] text-ink">
            <span className="block font-serif not-italic lowercase tracking-[-0.03em] text-ink text-[9vw] md:text-[min(4.4vw,4rem)]">
              <BlurWords text={line1} baseDelay={0.2} />
            </span>
            <span className="block font-serif italic lowercase tracking-[-0.03em] text-ink text-[10.5vw] md:text-[min(4.4vw,4rem)] mt-1">
              <BlurWords text={line2} baseDelay={l2Base} lastWordClassName="text-blue" />
            </span>
          </h1>

          <Reveal delay={ctaDelay}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mt-10 md:mt-12">
              <Link
                href="/services"
                onClick={() => playClick()}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-white font-mn-sans text-[15px] font-medium px-8 py-4 shadow-[0_10px_30px_-10px_rgba(5,5,20,0.5)] hover:bg-blue transition-colors duration-300"
              >
                {t("studio.hero.ctaPrimary")}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/#work"
                onClick={() => playClick()}
                className="rounded-full bg-white/25 backdrop-blur-xl border border-white/50 text-ink font-mn-sans text-[15px] font-medium px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_-14px_rgba(5,5,20,0.3)] hover:bg-white/45 transition-colors duration-300"
              >
                {t("studio.hero.ctaSecondary")} ↓
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
