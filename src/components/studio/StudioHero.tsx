"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlurWords from "@/components/studio/BlurWords";
import Reveal from "@/components/studio/Reveal";
import { useHeroScene } from "@/hooks/useHeroScene";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

// Délai max avant de lancer l'ouverture si le ciel tarde à charger (ms).
const READY_FALLBACK_MS = 1500;
// Début de la vague de mots : la caméra a presque fini de reculer (s).
const WORDS_DELAY = 0.55;
const WORD_STEP = 0.07;

// Hero « le titre dans le ciel ». Trois plans : le ciel au fond, le titre, puis
// une nappe de nuages détourée de la même photo (sky-veil.webp, voir
// scripts/sky-veil.py) qui passe devant les lettres. Ouverture en un seul
// mouvement de caméra : on part dans les nuages, la caméra recule et fait le
// point, le titre se dégage à la fin. Sortie liée au scroll : la caméra monte
// dans les nuages, l'écran blanchit et l'offre arrive dans ce blanc (la
// section suivante chevauche la fin du hero, cf. -mb). Sortie au scroll :
// useHeroScene ; ouverture et dérives : .studio-hero-* dans globals.css.
export default function StudioHero() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const skyImgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const whiteoutRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useHeroScene({
    section: sectionRef,
    sky: skyRef,
    title: titleRef,
    veil: veilRef,
    cta: ctaRef,
    whiteout: whiteoutRef,
  });

  // L'ouverture attend le ciel : la page ne se monte qu'après hydratation,
  // l'image part tard, et la caméra reculerait sinon sur du vide.
  useEffect(() => {
    const img = skyImgRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || (img?.complete && img.naturalWidth > 0)) {
      setReady(true);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), READY_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const line1 = t("studio.hero.thesisLine1");
  const line2 = t("studio.hero.thesisLine2");
  const l1Words = line1.split(" ").length;
  const l2Words = line2.split(" ").length;
  const l2Base = WORDS_DELAY + l1Words * WORD_STEP;
  const ctaDelay = WORDS_DELAY + 0.3 + (l1Words + l2Words) * WORD_STEP;

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`studio-hero relative w-full bg-bg text-ink h-svh motion-safe:h-[130svh] motion-safe:-mb-[24svh] ${
        ready ? "is-ready" : ""
      }`}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden isolate">
        {/* ——— Plan 1 : le ciel ——— */}
        <div ref={skyRef} aria-hidden="true" className="absolute -inset-[4%] will-change-transform">
          <div className="studio-hero-camera absolute inset-0">
            <div className="studio-sky-drift absolute inset-0">
              <Image
                ref={skyImgRef}
                src="/images/studio/sky.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onLoad={() => setReady(true)}
              />
            </div>
            {/* Mise au point : copie floue du ciel qui s'efface pendant le recul.
                Débord large : le bord transparent du flou reste hors cadre. */}
            <div className="studio-hero-focus absolute -inset-[14%]">
              <Image
                src="/images/studio/sky.jpg"
                alt=""
                fill
                loading="eager"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        {/* Intégration : fondu crème en haut (nav) et longue transition en
            bas jusqu'au crème opaque */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(249,249,249,0.55)_0%,rgba(249,249,249,0)_22%,rgba(249,249,249,0)_52%,rgba(249,249,249,0.45)_72%,rgba(249,249,249,0.85)_86%,rgb(249,249,249)_97%)]"
        />
        {/* Voile radial doux derrière le titre (lisibilité) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_52%_36%_at_50%_46%,rgba(249,249,249,0.4),transparent_70%)]"
        />

        {/* ——— Plan 2 : le titre. Colonne sans z-index : le titre (z-10) passe
            sous la nappe (z-20), les boutons (z-30) au-dessus ——— */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 pt-16 pb-[6vh]">
          <h1
            ref={titleRef}
            className="relative z-10 w-full text-center leading-[0.98] text-ink will-change-transform"
          >
            <span className="block font-serif not-italic lowercase tracking-[-0.035em] text-[9vw] md:text-[min(7.4vw,9rem)]">
              <BlurWords text={line1} baseDelay={WORDS_DELAY} step={WORD_STEP} />
            </span>
            <span className="block font-serif italic lowercase tracking-[-0.035em] text-[10.5vw] md:text-[min(7.4vw,9rem)]">
              <BlurWords text={line2} baseDelay={l2Base} step={WORD_STEP} lastWordClassName="text-blue" />
            </span>
          </h1>

          <div ref={ctaRef} className="relative z-30 mt-10 md:mt-12">
            <Reveal delay={ctaDelay}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
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

        {/* ——— Plan 3 : la nappe de nuages, devant le titre ——— */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[8%] h-[80%] z-20 origin-bottom will-change-transform"
        >
          <div className="studio-hero-veil-mask absolute inset-0">
            <div className="studio-hero-veil-rise absolute inset-0">
              <div className="studio-hero-veil-drift absolute inset-y-0 -left-[25%] w-[150%]">
                <Image
                  src="/images/studio/sky-veil.webp"
                  alt=""
                  fill
                  loading="eager"
                  sizes="150vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exposition : blanc d'ouverture (CSS) puis blanc de sortie (scroll) */}
        <div aria-hidden="true" className="studio-hero-flash pointer-events-none absolute inset-0 z-40 bg-bg" />
        <div
          ref={whiteoutRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 bg-bg opacity-0"
        />
      </div>
    </section>
  );
}
