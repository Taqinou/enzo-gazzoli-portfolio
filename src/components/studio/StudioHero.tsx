"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BlurWords from "@/components/studio/BlurWords";
import HeroPill from "@/components/studio/HeroPill";
import Reveal from "@/components/studio/Reveal";
import { useHeroScene } from "@/hooks/useHeroScene";
import { useTranslation } from "@/hooks/useTranslation";

// Délai max avant de lancer l'ouverture si le ciel tarde à charger (ms).
const READY_FALLBACK_MS = 1500;
// Début de la vague de mots : la caméra a presque fini de reculer (s).
const WORDS_DELAY = 0.55;
const WORD_STEP = 0.07;
// Tuiles de la nappe qui défile : la nappe, son miroir, la nappe (raccords
// invisibles, boucle sans saut).
const VEIL_TILES = [false, true, false];

// Hero « le titre dans le ciel ». Trois plans : le ciel au fond, le titre, puis
// une nappe de nuages détourée de la même image (sky-veil-painting.webp, voir
// scripts/sky-veil.py) qui passe devant les lettres. Ouverture en un seul
// mouvement de caméra : on part dans les nuages, la caméra recule et fait le
// point, le titre se dégage à la fin. Sortie liée au scroll : la caméra monte
// dans les nuages, l'écran blanchit et l'offre monte à travers la brume : la
// section suivante démarre juste sous le pli (hauteur − chevauchement ≈ 100svh)
// et chevauche tout le temps de pose, le blanc ne s'achève qu'une fois son
// titre à mi-écran, jamais d'écran vide. Sortie au scroll :
// useHeroScene ; ouverture et dérives : .studio-hero-* dans globals.css.
export default function StudioHero() {
  const { t } = useTranslation();

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
      className={`studio-hero relative w-full bg-bg text-ink h-svh motion-safe:h-[192svh] motion-safe:-mb-[90svh] ${
        ready ? "is-ready" : ""
      }`}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden isolate">
        {/* ——— Plan 1 : le ciel ——— */}
        <div ref={skyRef} aria-hidden="true" className="absolute -inset-[4%] will-change-transform">
          <div className="studio-hero-camera absolute inset-0">
            <div className="studio-sky-drift absolute inset-0 overflow-hidden">
              {/* le ciel défile vers la gauche sans fin : trois tuiles de
                  sky-painting-loop.jpg (raccordée à elle-même, scripts/sky-loop.py),
                  décalées d'une tuile par boucle */}
              <div className="studio-sky-loop">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="studio-sky-tile">
                    <Image
                      ref={i === 0 ? skyImgRef : undefined}
                      src="/images/studio/sky-painting-loop.jpg"
                      alt=""
                      fill
                      priority={i === 0}
                      loading="eager"
                      sizes="115vw"
                      className="object-cover"
                      onLoad={i === 0 ? () => setReady(true) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Mise au point : copie floue du ciel qui s'efface pendant le recul.
                Débord large : le bord transparent du flou reste hors cadre. */}
            <div className="studio-hero-focus absolute -inset-[14%]">
              <Image
                src="/images/studio/sky-painting.jpg"
                alt=""
                fill
                loading="eager"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        {/* Intégration : léger voile crème en bas seulement (Enzo a fait
            retirer la brume du haut). Le bas n'a pas besoin d'aller jusqu'au
            crème opaque : à la sortie, l'écran a blanchi avant que le bord du
            hero ne remonte. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(247,246,245,0)_66%,rgba(247,246,245,0.3)_84%,rgba(247,246,245,0.6)_100%)]"
        />
        {/* Voile radial doux derrière le titre (lisibilité) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_52%_36%_at_50%_46%,rgba(247,246,245,0.4),transparent_70%)]"
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
                <HeroPill href="/services" label={t("studio.hero.ctaPrimary")} variant="primary" arrow="right" />
                <HeroPill href="/#work" label={t("studio.hero.ctaSecondary")} variant="glass" arrow="down" />
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
              <div className="studio-hero-veil-drift absolute inset-y-0 left-0 flex w-[300%] will-change-transform">
                {VEIL_TILES.map((mirrored, i) => (
                  <div key={i} className="relative h-full w-1/3 shrink-0">
                    <Image
                      src="/images/studio/sky-veil-painting.webp"
                      alt=""
                      fill
                      loading="eager"
                      sizes="100vw"
                      className={`object-cover object-top ${mirrored ? "-scale-x-100" : ""}`}
                    />
                  </div>
                ))}
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
