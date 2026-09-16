"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CaseStudyNarrative from "@/components/studio/CaseStudyNarrative";
import Reveal from "@/components/studio/Reveal";
import SmoothScroll from "@/components/studio/SmoothScroll";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { getCaseStudy, getNextCaseStudy } from "@/data/caseStudies";
import { releaseWorkZoom, workZoom } from "@/lib/workZoom";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface CaseStudyContentProps {
  slug: string;
}

// Étude de cas en DA raffinée. Hero immersif : screenshot plein cadre avec
// voile crème en bas, titre + tagline en overlay, méta juste dessous.
// Narration éditoriale, filets fins, ombres douces, footer « projet suivant ».
export default function CaseStudyContent({ slug }: CaseStudyContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { playClick, playExit } = useSound();

  const heroImgRef = useRef<HTMLImageElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  // Arrivée par le zoom de la home (workZoom) : le hero est déjà exactement à
  // l'image de la copie posée par-dessus ; titre et voile apparaissent ensuite.
  const [textVisible, setTextVisible] = useState(() => workZoom.slug !== slug);

  useIsoLayoutEffect(() => {
    if (workZoom.slug !== slug) return;
    const veil = veilRef.current;
    if (veil) veil.style.opacity = "0";
    const img = heroImgRef.current;
    const reveal = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          // l'image du hero est peinte sous la copie : dès la fin du zoom, on
          // retire la copie et le texte arrive aussitôt
          window.setTimeout(() => {
            releaseWorkZoom();
            if (veil) {
              veil.style.transition = "opacity .15s ease-out";
              veil.style.opacity = "1";
            }
            setTextVisible(true);
          }, Math.max(0, workZoom.endsAt - performance.now()));
        }),
      );
    if (img && !img.complete) img.addEventListener("load", reveal, { once: true });
    else reveal();
  }, [slug]);

  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return null;

  const nextCaseStudy = getNextCaseStudy(slug);
  const titleText = t(`caseStudies.${slug}.title`);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/");
    }, 80);
  };

  // Hero projet : la même image que la vignette de la home (capture imprimée
  // en pixels bleus, *-pixel.webp), plein cadre et légèrement zoomée
  // (HERO_ZOOM = 1.08 dans lib/workZoom.ts : à garder synchronisés), pixels
  // nets. Le titre est porté par l'overlay du hero, pas de doublon.
  const visual = () => (
    <div className="absolute inset-0 bg-bg overflow-hidden">
      <Image
        ref={heroImgRef}
        src={`/images/work/${slug}-pixel.webp`}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover [image-rendering:pixelated] scale-[1.08]"
      />
    </div>
  );

  return (
    <SmoothScroll>
      {/* overflow-x-clip (pas -hidden) : clippe l'horizontal SANS créer de
          conteneur de scroll imbriqué qui entrerait en conflit avec Lenis
          (sinon scroll bancal sur la page projet). */}
      <div className="min-h-screen bg-bg text-ink overflow-x-clip">
        {/* Nav retour */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline px-6 md:px-10 py-6 md:py-8 z-[50] pointer-events-none mix-blend-difference">
          <a
            href="/"
            onClick={handleBack}
            className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
          >
            {t("caseStudies.backToStudio")}
          </a>
          <Link
            href="/services"
            onClick={() => playClick()}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
          >
            {t("studio.cta.button")}
          </Link>
        </nav>

        {/* Hero immersif */}
        <header className="relative flex flex-col md:flex-row md:min-h-[82svh] md:items-end overflow-hidden">
          {/* média (image + voile) : raccord exact avec la copie du zoom de la
              home (lib/workZoom.ts). Desktop : plein largeur × 82svh, titre
              posé dessus. Téléphone : l'image à son ratio (aucun recadrage
              portrait), titre en dessous. */}
          <div className="relative w-full aspect-[2400/1463] md:absolute md:inset-0 md:aspect-auto overflow-hidden">
            <div className="absolute inset-0">{visual()}</div>
            {/* voile crème bas pour poser le titre en ink */}
            <div
              ref={veilRef}
              aria-hidden="true"
              className="hidden md:block absolute inset-0 bg-[linear-gradient(to_bottom,rgba(247,246,245,0.25)_0%,rgba(247,246,245,0)_28%,rgba(247,246,245,0)_45%,rgba(247,246,245,0.75)_74%,rgb(247,246,245)_97%)]"
            />
          </div>
          {/* Le texte : présent en visite directe, en fondu doux après le zoom
              (textVisible). */}
          <div
            className="relative z-10 w-full px-6 md:px-20 pt-8 md:pt-0 pb-10 md:pb-16"
            style={{ opacity: textVisible ? 1 : 0, transition: "opacity .08s linear" }}
          >
            <h1 className="font-serif lowercase tracking-[-0.05em] leading-[0.9] text-[14vw] md:text-[min(8vw,7rem)]">
              {titleText}.
            </h1>
            <p className="font-serif italic text-xl md:text-3xl text-ink/60 mt-4 max-w-2xl leading-snug">
              {t(`caseStudies.${slug}.tagline`)}
            </p>
          </div>
        </header>

        {/* Méta */}
        <Reveal delay={0.1}>
          <div className="px-6 md:px-20 py-10 md:py-14 border-b border-ink/[0.12]">
            <dl className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-4">
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.year")}
                </dt>
                <dd className="font-serif text-lg md:text-xl">{caseStudy.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.role")}
                </dt>
                <dd className="font-serif text-lg md:text-xl lowercase">
                  {t(`caseStudies.${slug}.role`)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.stack")}
                </dt>
                <dd className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] pt-1.5">
                  {caseStudy.stack.join(" / ")}
                </dd>
              </div>
              {caseStudy.liveUrl && (
                <div className="md:ml-auto">
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="inline-block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blue underline decoration-1 underline-offset-8 hover:text-ink transition-colors duration-300 pt-2"
                  >
                    {t("caseStudies.visit")} ↗
                  </a>
                </div>
              )}
            </dl>
          </div>
        </Reveal>

        {/* Narration — fil de process animé au scroll */}
        <main className="px-6 md:px-20 py-16 md:py-24">
          <CaseStudyNarrative slug={slug} />
        </main>

        {/* Étude suivante + mini-CTA */}
        <footer className="bg-blue text-white px-6 md:px-20 py-16 md:py-24 overflow-hidden">
          <Reveal>
            <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">
              {t("caseStudies.next")}
            </p>
            <Link
              href={`/work/${nextCaseStudy.slug}`}
              onClick={() => playClick()}
              className="group inline-block font-serif lowercase italic tracking-[-0.05em] leading-085 text-[10vw] md:text-[min(5vw,4.5rem)] hover:text-ink transition-colors duration-300"
            >
              {t(`caseStudies.${nextCaseStudy.slug}.title`)}.{" "}
              <span
                aria-hidden="true"
                className="inline-block not-italic transition-transform duration-300 ease-out-expo group-hover:translate-x-3"
              >
                →
              </span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-t border-white/20 mt-12 md:mt-16 pt-8">
              <p className="font-serif italic text-lg md:text-xl text-white/70">
                {t("caseStudies.miniCta")}
              </p>
              <Link
                href="/services"
                onClick={() => playClick()}
                className="inline-flex items-center gap-2 self-start rounded-full bg-white text-blue px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink hover:text-white transition-colors duration-300"
              >
                {t("studio.cta.button")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </footer>

        {/* Texture grain globale */}
        <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScroll>
  );
}
